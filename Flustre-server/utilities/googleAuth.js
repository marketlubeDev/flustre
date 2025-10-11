const { OAuth2Client } = require("google-auth-library");
const { NormalUser } = require("../model/userModel");
const createToken = require("./createToken");
const AppError = require("./errorHandlings/appError");
const catchAsync = require("./errorHandlings/catchAsync");

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object>} Google user data
 */
const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
   

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error("Token verification error:", error.message);
    throw new AppError("Invalid Google token", 401);
  }
};

/**
 * Find or create user from Google data
 * @param {Object} googleData - Google user data
 * @returns {Promise<Object>} User object and token
 */
const findOrCreateGoogleUser = async (googleData) => {
  try {


    const { googleId, email, name, picture, emailVerified } = googleData;

    // Check if user exists with Google ID
    let user = await NormalUser.findOne({ googleId });

    if (!user) {
      // Check if user exists with email
      user = await NormalUser.findOne({ email });

      if (user) {
        // User exists but doesn't have Google ID, link the accounts
        user.googleId = googleId;
        user.googleEmail = email;
        user.googleName = name;
        user.googlePicture = picture;
        user.authProvider = "google";
        user.isEmailVerified = emailVerified;
        await user.save();
      } else {
        // Create new user with Google data
        user = new NormalUser({
          email,
          username: name,
          googleId,
          googleEmail: email,
          googleName: name,
          googlePicture: picture,
          authProvider: "google",
          isEmailVerified: emailVerified,
        });
        await user.save();
      }
    }

    // Generate JWT token
    const token = createToken(user._id, "user");

    // Return user data without password
    const userObj = user.toObject();
    delete userObj.password;

    const result = {
      user: userObj,
      token,
    };

    
    return result;
  } catch (error) {
    console.error("Error in findOrCreateGoogleUser:", error);
    throw error;
  }
};

/**
 * Handle Google authentication
 * @param {string} idToken - Google ID token
 * @returns {Promise<Object>} Authentication result
 */
const handleGoogleAuth = catchAsync(async (idToken) => {
  const googleData = await verifyGoogleToken(idToken);
  return await findOrCreateGoogleUser(googleData);
});

module.exports = {
  verifyGoogleToken,
  findOrCreateGoogleUser,
  handleGoogleAuth,
};
