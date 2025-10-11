const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    // Product-level options definition to support variant combinations
    // Example: [{ name: "color", values: ["red", "white"] }, { name: "size", values: ["S","M","L"] }]
    options: [
      new Schema(
        {
          name: { type: String, required: true },
          values: [{ type: String, required: true }],
        },
        { _id: false }
      ),
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
    coupons: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
    activeStatus: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    label: { type: Schema.Types.ObjectId, ref: "Label" },
    isDeleted: { type: Boolean, default: false },
    offer: { type: Schema.Types.ObjectId, ref: "Offer" },
    priority: { type: Number, enum: [0, 1], default: 0 },
    // Product-level pricing fields (used when variants are not specified or as defaults)
    price: { type: Number, default: 0 },
    compareAtPrice: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    costPerItem: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    about: { type: String },
    specifications: [{ type: String }],
    featureImages: [{ type: String }],
    returnPolicyDays: { type: Number, default: 7 },
    returnPolicyText: { type: String, default: "" },
    // Multiple features sections (preferred)
    featuresSections: [
      new Schema(
        {
          layout: {
            type: String,
            enum: ["banner", "split"],
            default: "banner",
          },
          imagePosition: {
            type: String,
            enum: ["left", "right"],
            default: "right",
          },
          mediaType: {
            type: String,
            enum: ["image", "video"],
            default: "image",
          },
          mediaUrl: { type: String },
          title: { type: String },
          description: { type: String },
        },
        { _id: false }
      ),
    ],
  },
  { timestamps: true }
);

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
