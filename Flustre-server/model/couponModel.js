const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, required: true },
    discountAmount: { type: Number, required: true },
    // Minimum purchase is only required for order-level coupons; default 0 for others
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    expiryDate: { type: Date, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    // New fields to match updated UI
    usageLimit: { type: Number, default: 0 }, // 0 means unlimited
    usedCount: { type: Number, default: 0 },
    applyTo: {
      type: String,
      enum: ["order", "product", "category", "subcategory"],
      default: "order",
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
