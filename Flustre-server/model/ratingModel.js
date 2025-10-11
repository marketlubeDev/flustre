const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
    images: [{ type: String }],
    helpfulCount: { type: Number, default: 0 },
    reported: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only have one rating per product
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
