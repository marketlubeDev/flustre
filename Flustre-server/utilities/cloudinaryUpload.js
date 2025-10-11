// Import the new S3 utilities
const {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
  generateUniqueFilename,
  bufferToStream,
} = require("./s3Upload");

// Legacy functions - now using the new S3 utilities

// Upload to S3 (formerly uploadToCloudinary) - now using new S3 utility
const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    const result = await uploadToS3(buffer, options);
    return result.url; // Return just the URL for backward compatibility
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Upload multiple files to S3 - now using new S3 utility
const uploadMultipleToS3Legacy = async (files, options = {}) => {
  try {
    const results = await uploadMultipleToS3(files, options);
    return results.map((result) => result.url); // Return just URLs for backward compatibility
  } catch (error) {
    console.error("Error uploading multiple files to S3:", error);
    throw new Error(`Failed to upload multiple images: ${error.message}`);
  }
};

// Delete from S3 - now using new S3 utility
const deleteFromS3Legacy = async (key) => {
  try {
    return await deleteFromS3(key);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToS3: uploadMultipleToS3Legacy,
  generateUniqueFilename,
  deleteFromS3: deleteFromS3Legacy,
};
