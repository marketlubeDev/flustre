// models/brandModel.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
    bannerImage: {
      type: String,
      default: null,
    },
    mobileBannerImage: {
      type: String,
      default: null,
    },
    isPriority: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// brandSchema.statics.countPriorityBrands = async function () {
//   return await this.countDocuments({ isPriority: true });
// };



const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
