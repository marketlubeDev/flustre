const mongoose = require("mongoose");
const { Schema } = mongoose;

// Redesigned Variant schema to align with new UI payload
// Each variant now stores a map of selected option values (e.g., { color: "red", size: "M" }),
// pricing, quantity, SKU, and an optional image.
const variantSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // Selected options for this variant, e.g. { color: "red", size: "S" }
    options: {
      type: Schema.Types.Mixed,
      default: {},
    },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: "Variant cannot have more than 5 images",
      },
    },
    // Soft delete support
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional unique index to prevent duplicate option combinations per product
variantSchema.index({ product: 1, options: 1 }, { unique: true });

const Variant = mongoose.model("Variant", variantSchema);
module.exports = Variant;
