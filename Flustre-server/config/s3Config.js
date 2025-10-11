const AWS = require("aws-sdk");
require("dotenv").config();

// AWS S3 Configuration
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
};

// Initialize S3 instance
const s3 = new AWS.S3(s3Config);

// S3 bucket configuration
const s3ConfigOptions = {
  bucketName: process.env.S3_BUCKET_NAME,
  region: process.env.AWS_REGION || "us-east-1",
  // Default folder structure for different types of uploads
  folders: {
    products: "sukalmart/products",
    banners: "sukalmart/banners",
    categories: "sukalmart/categories",
    brands: "sukalmart/brands",
    users: "sukalmart/users",
    offers: "sukalmart/offers",
    InstaCarousel: "sukalmart/InstaCarousel",
    general: "sukalmart/uploads",
  },
};

// Validate S3 configuration
const validateS3Config = () => {
  const requiredEnvVars = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_BUCKET_NAME",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing S3 environment variables: ${missingVars.join(", ")}`
    );
    return false;
  }

  return true;
};

module.exports = {
  s3,
  s3ConfigOptions,
  validateS3Config,
};
