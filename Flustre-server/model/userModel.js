const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const options = { discriminatorKey: "role", timestamps: true };

const addressSchema = new Schema({
  fullName: { type: String },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\+?[0-9]{7,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  houseApartmentName: { type: String },
  street: { type: String },
  landmark: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
    },
    phonenumber: {
      type: String,
      validate: {
        validator: function (v) {
          // Only validate if a value is provided (not null or undefined)
          if (v == null || v === "") return true;
          return /^\+?[0-9]{7,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: { type: String },
    authProvider: {
      type: String,
      enum: ["local"],
      default: "local",
    },
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    address: {
      type: [addressSchema],
      validate: {
        validator: function (val) {
          if (val.length > 3) {
            val.shift(); // Remove the oldest address
          }
          return val.length <= 3; // Validate the length
        },
        message: "Address array exceeds the limit of 3.",
      },
    },
  },
  options
);

// Unique compound index for core identity fields
userSchema.index(
  {
    email: 1,
    phonenumber: 1,
    role: 1,
  },
  { unique: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

const NormalUser = User.discriminator("user", new Schema({}));

const Admin = User.discriminator("admin", new Schema({}));

const Seller = User.discriminator("seller", new Schema({}));

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = { User, NormalUser, Admin, Seller };
