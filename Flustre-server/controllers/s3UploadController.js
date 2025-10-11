const {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
  getSignedUrl,
  listFilesInFolder,
} = require("../utilities/s3Upload");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const AppError = require("../utilities/errorHandlings/appError");

// Upload single image to specific folder
exports.uploadSingleImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image", 400));
  }

  const { folder = "general", filename } = req.body;

  const result = await uploadToS3(req.file.buffer, {
    folder,
    filename,
    originalName: req.file.originalname,
    contentType: req.file.mimetype,
  });

  res.status(200).json({
    status: "success",
    data: {
      url: result.url,
      key: result.key,
      bucket: result.bucket,
    },
  });
});

// Upload multiple images to specific folder
exports.uploadMultipleImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one image", 400));
  }

  const { folder = "general", filename } = req.body;

  const results = await uploadMultipleToS3(req.files, {
    folder,
    filename,
  });

  res.status(200).json({
    status: "success",
    data: {
      images: results.map((result) => ({
        url: result.url,
        key: result.key,
        bucket: result.bucket,
      })),
    },
  });
});

// Upload product images
exports.uploadProductImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one product image", 400));
  }

  const { productId, productName } = req.body;

  const results = await uploadMultipleToS3(req.files, {
    folder: "products",
    filename: `${productName || "product"}_${productId || Date.now()}`,
  });

  res.status(200).json({
    status: "success",
    data: {
      productImages: results.map((result) => ({
        url: result.url,
        key: result.key,
        bucket: result.bucket,
      })),
    },
  });
});

// Upload banner images
exports.uploadBannerImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one banner image", 400));
  }

  const { bannerType, bannerName } = req.body;

  const results = await uploadMultipleToS3(req.files, {
    folder: "banners",
    filename: `${bannerType || "banner"}_${bannerName || Date.now()}`,
  });

  res.status(200).json({
    status: "success",
    data: {
      bannerImages: results.map((result) => ({
        url: result.url,
        key: result.key,
        bucket: result.bucket,
      })),
    },
  });
});

// Upload category images
exports.uploadCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one category image", 400));
  }

  const { categoryName, categoryId } = req.body;

  const results = await uploadMultipleToS3(req.files, {
    folder: "categories",
    filename: `${categoryName || "category"}_${categoryId || Date.now()}`,
  });

  res.status(200).json({
    status: "success",
    data: {
      categoryImages: results.map((result) => ({
        url: result.url,
        key: result.key,
        bucket: result.bucket,
      })),
    },
  });
});

// Upload brand images
exports.uploadBrandImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one brand image", 400));
  }

  const { brandName, brandId } = req.body;

  const results = await uploadMultipleToS3(req.files, {
    folder: "brands",
    filename: `${brandName || "brand"}_${brandId || Date.now()}`,
  });

  res.status(200).json({
    status: "success",
    data: {
      brandImages: results.map((result) => ({
        url: result.url,
        key: result.key,
        bucket: result.bucket,
      })),
    },
  });
});

// Delete image from S3
exports.deleteImage = catchAsync(async (req, res, next) => {
  const { key } = req.params;

  if (!key) {
    return next(new AppError("Image key is required", 400));
  }

  await deleteFromS3(key);

  res.status(200).json({
    status: "success",
    message: "Image deleted successfully",
  });
});

// Get signed URL for temporary access
exports.getSignedUrl = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  const { expiresIn = 3600 } = req.query;

  if (!key) {
    return next(new AppError("Image key is required", 400));
  }

  const signedUrl = await getSignedUrl(key, parseInt(expiresIn));

  res.status(200).json({
    status: "success",
    data: {
      signedUrl,
      expiresIn: parseInt(expiresIn),
    },
  });
});

// List files in a folder
exports.listFilesInFolder = catchAsync(async (req, res, next) => {
  const { folder = "general", maxKeys = 100 } = req.query;

  const files = await listFilesInFolder(folder, parseInt(maxKeys));

  res.status(200).json({
    status: "success",
    data: {
      files: files.map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        etag: file.ETag,
      })),
      count: files.length,
    },
  });
});
