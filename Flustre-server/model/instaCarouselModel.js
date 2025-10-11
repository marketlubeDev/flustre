const mongoose = require("mongoose");
const { Schema } = mongoose;

const instaCarouselSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

instaCarouselSchema.index({ title: "text" });

const InstaCarousel = mongoose.model("InstaCarousel", instaCarouselSchema);

module.exports = InstaCarousel;
