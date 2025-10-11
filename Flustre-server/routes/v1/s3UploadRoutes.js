const express = require("express");
const multer = require("multer");
const s3UploadController = require("../../controllers/s3UploadController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Public routes (no authentication required)
router.post(
  "/upload-single",
  upload.single("image"),
  s3UploadController.uploadSingleImage
);
router.post(
  "/upload-multiple",
  upload.array("images", 10),
  s3UploadController.uploadMultipleImages
);

// Protected routes (authentication required) - allow admin role only
const protect = authMiddleware(["admin"]);

// Product image uploads
router.post(
  "/upload-product-images",
  protect,
  upload.array("images", 10),
  s3UploadController.uploadProductImages
);

// Banner image uploads
router.post(
  "/upload-banner-images",
  protect,
  upload.array("images", 5),
  s3UploadController.uploadBannerImages
);

// Category image uploads
router.post(
  "/upload-category-images",
  protect,
  upload.array("images", 5),
  s3UploadController.uploadCategoryImages
);

// Brand image uploads
router.post(
  "/upload-brand-images",
  protect,
  upload.array("images", 5),
  s3UploadController.uploadBrandImages
);

// File management routes
router.delete("/delete/:key(*)", protect, s3UploadController.deleteImage);
router.get("/signed-url/:key(*)", protect, s3UploadController.getSignedUrl);
router.get("/list-files", protect, s3UploadController.listFilesInFolder);

module.exports = router;
