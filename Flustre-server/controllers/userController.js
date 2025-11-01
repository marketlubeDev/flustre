const { NormalUser } = require("../model/userModel");
const createToken = require("../utilities/createToken");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const otpToEmail = require("../utilities/sendMail");
const { findOrCreateGoogleUser } = require("../utilities/googleAuth");
const { findOrCreateFacebookUser } = require("../utilities/facebookAuth");

const otpStore = new Map();

function ensureDefaultAddress(userDoc) {
  if (!userDoc || !Array.isArray(userDoc.address)) return userDoc;
  const addresses = userDoc.address;
  const hasDefault = addresses.some((a) => a && a.isDefault === true);
  if (!hasDefault && addresses.length > 0) {
    // mark the first one as default
    addresses.forEach((a, idx) => {
      a.isDefault = idx === 0;
    });
  }
  return userDoc;
}

const register = catchAsync(async (req, res, next) => {
  const { username, email, phonenumber, password } = req.body;
  if (!username || !email || !phonenumber || !password) {
    return next(new AppError("All fields are required", 400));
  }
  const isUserExist = await NormalUser.findOne({ email });
  const isPhoneNumberExist = await NormalUser.findOne({ phonenumber });
  if (isUserExist) {
    return next(new AppError("User already exists", 400));
  }
  if (isPhoneNumberExist) {
    return next(new AppError("Phone number already exists", 400));
  }
  const newUser = new NormalUser({ username, email, phonenumber, password });
  const user = await newUser.save();
  const userObj = user.toObject();
  delete userObj.password;
  const token = createToken(user._id, "user");
  res.cookie("user-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
  return res
    .status(201)
    .json({ message: "user created", user: userObj, token });
});

// const login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new AppError("Email and password are required", 400));
//   }

//   const user = await NormalUser.findOne({ email });
//   if (!user) {
//     return next(new AppError("Invalid email or password", 401));
//   }

//   const isMatch = await user.comparePassword(password.toString());
//   if (!isMatch) {
//     return next(new AppError("Invalid email or password", 401));
//   }

//   const token = createToken(user._id, "user");

//   const userObj = user.toObject();
//   delete userObj.password;

//   res.status(200).json({
//     message: "Logged in successfully",
//     user: userObj,
//     token,
//   });
// });

const sendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required to send OTP", 400));
  }

  const emailToSend = email.trim();

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailToSend)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  const [response, status, otp] = await otpToEmail(emailToSend);

  if (status !== "OK") {
    return next(new AppError("Failed to send OTP. Please try again.", 500));
  }

  // Store identifier (email) and user data
  otpStore.set(emailToSend, {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
    userData: {
      email: emailToSend,
    },
  });

  res.status(200).json({
    status: "Success",
    message: "OTP has been sent successfully to your email",
    content: {
      email: emailToSend,
    },
  });
});
const userLogOut = catchAsync(async (req, res, next) => {
  res.clearCookie("user-auth-token");

  res.status(200).json({
    message: "Logged out successfully",
  });
});

const listUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    NormalUser.find()
      .skip(skip)
      .limit(limit)
      .select("username email phonenumber address createdAt isBlocked"),
    NormalUser.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const verifyOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  // Get stored OTP data
  const storedOtpData = otpStore.get(email);
  if (!storedOtpData) {
    return next(new AppError("No OTP found. Please request a new OTP.", 400));
  }

  // Check if OTP is expired
  if (Date.now() > storedOtpData.expires) {
    otpStore.delete(email);
    return next(new AppError("This OTP is expired. Try again..", 401));
  }

  // Verify OTP
  if (storedOtpData.otp !== otp) {
    return next(new AppError("Incorrect OTP. Check your inbox again...", 400));
  }

  // Check if user exists (by email)
  const userExists = await NormalUser.findOne({ email });

  if (!userExists) {
    // New user - create account
    // Prepare user data with defaults
    const userData = {
      email: storedOtpData.userData.email,
      username:
        storedOtpData.userData.username ||
        storedOtpData.userData.email.split("@")[0] ||
        "User",
      // No password needed for OTP-based authentication
      // No phonenumber - using email only
      isEmailVerified: true,
    };

    const newUser = new NormalUser(userData);
    const savedUser = await newUser.save();

    // Remove password from response
    const userObj = savedUser.toObject();
    delete userObj.password;

    const token = createToken(savedUser._id);

    // Clear OTP after successful verification
    otpStore.delete(email);

    res.status(200).json({
      status: "Success",
      message: "Account created and logged in successfully",
      content: {
        user: userObj,
      },
      token,
    });
  } else {
    // Existing user - login
    // Remove password from response
    const userObj = userExists.toObject();
    delete userObj.password;

    const token = createToken(userExists._id);

    // Clear OTP after successful verification
    otpStore.delete(email);

    res.status(200).json({
      status: "Success",
      message: "Logged in successfully",
      content: {
        user: userObj,
      },
      token,
    });
  }
});

const resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Get stored OTP data
  const storedOtpData = otpStore.get(email);
  if (!storedOtpData) {
    return next(
      new AppError("Email not found. Please request a new OTP.", 400)
    );
  }

  // Send new OTP
  const [response, status, newOtp] = await otpToEmail(email);

  if (status !== "OK") {
    return next(new AppError("Failed to send OTP. Please try again.", 500));
  }

  // Update stored OTP with new OTP
  otpStore.set(email, {
    otp: newOtp,
    expires: Date.now() + 10 * 60 * 1000,
    userData: storedOtpData.userData,
  });

  res.status(200).json({
    status: "Success",
    message: "New OTP has been sent successfully to your email",
    content: {
      email,
    },
  });
});

const searchUser = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await NormalUser.find({
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phonenumber: { $regex: search, $options: "i" } },
    ],
  });
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

const checkUser = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const user = await NormalUser.findById(userId);
  res.status(200).json({ user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const updateData = req.body;

  // If request intends to set default address
  if (updateData.defaultAddressId) {
    const user = await NormalUser.findById(userId);
    if (!user) return next(new AppError("User not found", 404));
    const targetId = updateData.defaultAddressId.toString();
    user.address = (user.address || []).map((addr) => ({
      ...(addr.toObject?.() || addr),
      isDefault: addr._id.toString() === targetId,
    }));
    const saved = await user.save();
    ensureDefaultAddress(saved);
    const obj = saved.toObject();
    delete obj.password;
    return res.status(200).json(obj);
  }

  // If request intends to edit an existing address by id
  if (updateData.addressId && updateData.address) {
    const user = await NormalUser.findById(userId);
    if (!user) return next(new AppError("User not found", 404));
    const idx = (user.address || []).findIndex(
      (a) => a._id.toString() === updateData.addressId
    );
    if (idx === -1) return next(new AppError("Address not found", 404));
    const prev = user.address[idx];
    user.address[idx] = {
      ...(prev.toObject?.() || prev),
      ...updateData.address,
    };
    const saved = await user.save();
    ensureDefaultAddress(saved);
    const obj = saved.toObject();
    delete obj.password;
    return res.status(200).json(obj);
  }

  let updatedUser;
  if (updateData.address) {
    // Add address (push, trim to 3 as per validation)
    updatedUser = await NormalUser.findByIdAndUpdate(
      userId,
      { $push: { address: updateData.address } },
      { new: true }
    );
  } else {
    updatedUser = await NormalUser.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
  }

  ensureDefaultAddress(updatedUser);
  const userObj = updatedUser.toObject();
  delete userObj.password;
  res.status(200).json(userObj);
});

const deleteUserAddress = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const addressId = req.params.id;

  const updatedUser = await NormalUser.findByIdAndUpdate(
    userId,
    { $pull: { address: { _id: addressId } } },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  ensureDefaultAddress(updatedUser);
  res.status(200).json({
    status: "success",
    message: "Address deleted successfully",
    data: updatedUser,
  });
});

// Google Auth controller
const googleLogin = catchAsync(async (req, res, next) => {
  const { accessToken, userInfo } = req.body;

  if (!accessToken || !userInfo) {
    return next(
      new AppError("Google access token and user info are required", 400)
    );
  }

  try {
    // Create user data from Google user info
    const googleData = {
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      emailVerified: userInfo.verified_email || false,
    };

    // Find or create user
    const result = await findOrCreateGoogleUser(googleData);

    if (!result) {
      return next(
        new AppError("Google authentication failed - no result", 500)
      );
    }

    if (!result.user) {
      return next(new AppError("Google authentication failed - no user", 500));
    }

    if (!result.token) {
      return next(new AppError("Google authentication failed - no token", 500));
    }

    res.status(200).json({
      status: "Success",
      message: "Google authentication successful",
      content: {
        user: result.user,
      },
      token: result.token,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Google authentication failed", 500)
    );
  }
});

// Facebook Auth controller
const facebookLogin = catchAsync(async (req, res, next) => {
  const { accessToken, userInfo } = req.body;

  if (!accessToken || !userInfo) {
    return next(
      new AppError("Facebook access token and user info are required", 400)
    );
  }

  try {
    // Create user data from Facebook user info
    const facebookData = {
      facebookId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture?.data?.url || userInfo.picture || null,
    };

    // Find or create user
    const result = await findOrCreateFacebookUser(facebookData);

    if (!result) {
      return next(
        new AppError("Facebook authentication failed - no result", 500)
      );
    }

    if (!result.user) {
      return next(
        new AppError("Facebook authentication failed - no user", 500)
      );
    }

    if (!result.token) {
      return next(
        new AppError("Facebook authentication failed - no token", 500)
      );
    }

    // Return success response
    res.status(200).json({
      success: true,
      content: {
        user: result.user,
      },
      token: result.token,
    });
  } catch (error) {
    return next(
      new AppError(error.message || "Facebook authentication failed", 500)
    );
  }
});

const updateUserStatus = catchAsync(async (req, res, next) => {
  const { userId, isBlocked } = req.body;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const user = await NormalUser.findByIdAndUpdate(
    userId,
    { isBlocked },
    { new: true }
  ).select("username email phonenumber createdAt isBlocked");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
    user,
  });
});

module.exports = {
  register,
  // login,
  userLogOut,
  listUsers,
  searchUser,
  checkUser,
  updateUser,
  deleteUserAddress,
  sendOtp,
  verifyOtp,
  resendOtp,
  googleLogin,
  facebookLogin,
  updateUserStatus,
};
