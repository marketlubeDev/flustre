const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    coupons: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
