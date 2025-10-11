const { s3, s3ConfigOptions, validateS3Config } = require("../config/s3Config");
const { Readable } = require("stream");
require("dotenv").config();

// Convert Buffer to Stream
const bufferToStream = (buffer) => {
  return Readable.from(buffer);
};

// Generate a unique filename with timestamp
const generateUniqueFilename = (originalName = "", prefix = "") => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const cleanName = originalName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const filename = `${cleanName}_${timestamp}_${randomString}`;
  return prefix ? `${prefix}_${filename}` : filename;
};

// Get file extension from buffer or filename
const getFileExtension = (buffer, originalName = "") => {
  // Try to get extension from original filename
  if (originalName && originalName.includes(".")) {
    return originalName.split(".").pop().toLowerCase();
  }

  // Default to jpg if no extension found
  return "jpg";
};

// Upload single file to S3
const uploadToS3 = async (buffer, options = {}) => {
  try {
    // Validate S3 configuration
    if (!validateS3Config()) {
      throw new Error(
        "S3 configuration is incomplete. Please check your environment variables."
      );
    }

    const {
      folder = "general",
      filename = generateUniqueFilename("image"),
      contentType = "image/jpeg",
      originalName = "",
    } = options;

    // Get the folder path from config
    const folderPath =
      s3ConfigOptions.folders[folder] || s3ConfigOptions.folders.general;

    // Get file extension
    const extension = getFileExtension(buffer, originalName);

    // Ensure the key has proper path structure
    const key = `${folderPath}/${filename}.${extension}`;

    const params = {
      Bucket: s3ConfigOptions.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "max-age=31536000", // Cache for 1 year
    };

    const result = await s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
      etag: result.ETag,
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Upload multiple files to S3
const uploadMultipleToS3 = async (files, options = {}) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        filename: options.filename
          ? `${options.filename}_${index}`
          : generateUniqueFilename(file.originalname || "image", index),
        originalName: file.originalname,
        contentType: file.mimetype,
      };
      return uploadToS3(file.buffer, fileOptions);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files to S3:", error);
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

// Delete file from S3
const deleteFromS3 = async (key) => {
  try {
    if (!validateS3Config()) {
      throw new Error(
        "S3 configuration is incomplete. Please check your environment variables."
      );
    }

    let extractedKey;
    if (key.includes("amazonaws.com")) {
      // Extract everything after the bucket name
      extractedKey = key.split(".com/")[1];
    } else {
      extractedKey = key;
    }

    const params = {
      Bucket: s3ConfigOptions.bucketName,
      Key: extractedKey,
    };

    const result = await s3.deleteObject(params).promise();
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Get signed URL for temporary access
const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    if (!validateS3Config()) {
      throw new Error(
        "S3 configuration is incomplete. Please check your environment variables."
      );
    }

    let extractedKey;
    if (key.includes("amazonaws.com")) {
      extractedKey = key.split(".com/")[1];
    } else {
      extractedKey = key;
    }

    const params = {
      Bucket: s3ConfigOptions.bucketName,
      Key: extractedKey,
      Expires: expiresIn,
    };

    return await s3.getSignedUrlPromise("getObject", params);
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

// List files in a folder
const listFilesInFolder = async (folder = "general", maxKeys = 100) => {
  try {
    if (!validateS3Config()) {
      throw new Error(
        "S3 configuration is incomplete. Please check your environment variables."
      );
    }

    const folderPath =
      s3ConfigOptions.folders[folder] || s3ConfigOptions.folders.general;

    const params = {
      Bucket: s3ConfigOptions.bucketName,
      Prefix: folderPath,
      MaxKeys: maxKeys,
    };

    const result = await s3.listObjectsV2(params).promise();
    return result.Contents || [];
  } catch (error) {
    console.error("Error listing files from S3:", error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
  getSignedUrl,
  listFilesInFolder,
  generateUniqueFilename,
  bufferToStream,
  s3ConfigOptions,
};
