const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} = require("../../controllers/instaCarouselController");
const autheticateToken = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/multer");

const router = require("express").Router();

router
  .route("/")
  .post(autheticateToken(["admin", "store"]), upload.any(), createVideo)
  .get(getVideos);

router
  .route("/:id")
  .get(getVideoById)
  .patch(autheticateToken(["admin", "store"]), upload.any(), updateVideo)
  .delete(autheticateToken(["admin", "store"]), deleteVideo);

module.exports = router;
