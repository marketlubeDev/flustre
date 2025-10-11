const Banner = require("../model/bannerModel");
const {
  uploadToCloudinary,
  deleteFromS3,
} = require("../utilities/cloudinaryUpload");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const path = require("path");
const fs = require("fs");

const createBanner = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    bannerFor,
    image,
    category,
    percentage,
    productLink,
  } = req.body;

  const bannerData = { title, description, bannerFor, image, productLink };

  if (bannerFor === "category") {
    const alreadyExist = await Banner.findOne({
      category: category,
      bannerFor: "category",
    });
    if (alreadyExist) {
      return next(new AppError("Banner For this category already exists", 400));
    }

    bannerData.category = category;
    bannerData.percentage = percentage;
  }

  if (req.files && req.files.length > 0) {
    // Handle images based on fieldname
    for (const file of req.files) {
      const uploadedImage = await uploadToCloudinary(file.buffer, {
        folder: "banners",
      });

      switch (file.fieldname) {
        case "image":
          bannerData.image = uploadedImage;
          break;
        case "mobileImage":
          bannerData.mobileImage = uploadedImage;
          break;
        case "editImage":
          bannerData.image = uploadedImage;
          break;
        case "editMobileImage":
          bannerData.mobileImage = uploadedImage;
          break;
      }
    }
  }

  const newBanner = await Banner.create(bannerData);

  res.status(201).json({
    status: "success",
    data: newBanner,
  });
});

const getAllBanners = catchAsync(async (req, res, next) => {
  const { bannerFor } = req.query;

  let query = {};
  if (bannerFor) {
    query.bannerFor = bannerFor;
  }

  const banners = await Banner.find(query);
  res.status(200).json({
    status: "success",
    data: banners,
  });
});

const deleteBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError("Invalid banner ID format", 400));
  }

  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new AppError("Banner not found", 404));
  }

  // Delete images in parallel if they exist
  const deletePromises = [];
  if (banner.image) deletePromises.push(deleteFromS3(banner.image));
  if (banner.mobileImage) deletePromises.push(deleteFromS3(banner.mobileImage));

  try {
    // Delete images and banner in parallel
    await Promise.all([...deletePromises, Banner.findByIdAndDelete(id)]);

    res.status(200).json({
      status: "success",
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return next(
      new AppError("Failed to delete banner or associated images", 500)
    );
  }
});

const updateBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    bannerFor,
    image,
    category,
    percentage,
    productLink,
  } = req.body;

  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new AppError("Banner not found", 404));
  }

  if (req.files && req.files.length > 0) {
    // Handle images based on fieldname
    for (const file of req.files) {
      const uploadedImage = await uploadToCloudinary(file.buffer, {
        folder: "banners",
      });

      switch (file.fieldname) {
        case "image":
          banner.image = uploadedImage;
          break;
        case "mobileImage":
          banner.mobileImage = uploadedImage;
          break;
        case "editImage":
          banner.image = uploadedImage;
          break;
        case "editMobileImage":
          banner.mobileImage = uploadedImage;
          break;
      }
    }
  }

  banner.title = title || banner.title;
  banner.description = description || banner.description;
  banner.bannerFor = bannerFor || banner.bannerFor;
  banner.image = image || banner.image;
  banner.productLink = productLink || banner.productLink;
  if (bannerFor === "category") {
    const alreadyExist = await Banner.findOne({
      category: category,
      bannerFor: "category",
      _id: { $ne: id },
    });
    if (alreadyExist) {
      return next(new AppError("Banner For this category already exists", 400));
    }
    banner.category = category || banner.category;
    banner.percentage = percentage || banner.percentage;
  }

  await banner.save();

  res.status(200).json({
    status: "success",
    data: banner,
    message: "Banner updated successfully",
  });
});

const getAllBannersByCategory = catchAsync(async (req, res, next) => {
  const banners = await Banner.find({ bannerFor: "category" }).populate(
    "category"
  );
  res.status(200).json({ status: "success", data: banners });
});

module.exports = {
  createBanner,
  getAllBanners,
  deleteBanner,
  updateBanner,
  getAllBannersByCategory,
};
