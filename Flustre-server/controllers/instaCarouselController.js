const InstaCarousel = require("../model/instaCarouselModel");
const {
  uploadToCloudinary,
  deleteFromS3,
} = require("../utilities/cloudinaryUpload");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");

const createVideo = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new AppError("Title is required", 400));

  // Group files by field name; support both singular and plural keys
  const allFiles = Array.isArray(req.files) ? req.files : [];
  const videoParts = allFiles.filter(
    (f) =>
      f.fieldname === "video" ||
      f.fieldname === "videos" ||
      f.fieldname === "video[]" ||
      f.fieldname === "videos[]"
  );
  const thumbParts = allFiles.filter(
    (f) =>
      f.fieldname === "thumbnail" ||
      f.fieldname === "thumbnails" ||
      f.fieldname === "thumbnail[]" ||
      f.fieldname === "thumbnails[]"
  );

  // If no videos at all, reject
  if (videoParts.length === 0) {
    return next(new AppError("Video file is required", 400));
  }

  // Helper to upload a part and return URL
  const uploadPart = async (file) =>
    await uploadToCloudinary(file.buffer, {
      folder: "InstaCarousel",
      originalName: file.originalname,
      contentType: file.mimetype,
    });

  const createdDocs = [];

  // Pair by index: ith video with ith thumbnail if present
  for (let i = 0; i < videoParts.length; i++) {
    const videoFile = videoParts[i];
    const thumbFile = thumbParts[i];

    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadPart(videoFile),
      thumbFile ? uploadPart(thumbFile) : Promise.resolve(null),
    ]);

    const doc = await InstaCarousel.create({
      title,
      videoUrl,
      thumbnailUrl,
      createdBy: req.user || null,
    });
    createdDocs.push(doc);
  }

  res.status(201).json({ status: "success", data: createdDocs });
});

const getVideos = catchAsync(async (req, res, next) => {
  const { search = "", sort = "recent", isActive } = req.query;

  const filter = {};
  if (search) filter.title = { $regex: search, $options: "i" };
  if (typeof isActive !== "undefined") filter.isActive = isActive === "true";

  let sortObj = { createdAt: -1 };
  if (sort === "oldest") sortObj = { createdAt: 1 };
  if (sort === "az") sortObj = { title: 1 };
  if (sort === "za") sortObj = { title: -1 };

  const docs = await InstaCarousel.find(filter).sort(sortObj);
  res.status(200).json({ status: "success", data: docs });
});

const getVideoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await InstaCarousel.findById(id);
  if (!doc) return next(new AppError("Video not found", 404));
  res.status(200).json({ status: "success", data: doc });
});

const updateVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, isActive } = req.body;

  const doc = await InstaCarousel.findById(id);
  if (!doc) return next(new AppError("Video not found", 404));

  // handle new uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer, {
        folder: "InstaCarousel",
        originalName: file.originalname,
        contentType: file.mimetype,
      });
      if (file.fieldname === "video") doc.videoUrl = uploaded;
      if (file.fieldname === "thumbnail") doc.thumbnailUrl = uploaded;
    }
  }

  if (typeof title !== "undefined") doc.title = title;
  if (typeof isActive !== "undefined") doc.isActive = isActive;

  await doc.save();
  res
    .status(200)
    .json({ status: "success", data: doc, message: "Updated successfully" });
});

const deleteVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await InstaCarousel.findById(id);
  if (!doc) return next(new AppError("Video not found", 404));

  const deletes = [];
  if (doc.videoUrl) deletes.push(deleteFromS3(doc.videoUrl));
  if (doc.thumbnailUrl) deletes.push(deleteFromS3(doc.thumbnailUrl));

  await Promise.all([...deletes, InstaCarousel.findByIdAndDelete(id)]);

  res.status(200).json({ status: "success", message: "Deleted successfully" });
});

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
