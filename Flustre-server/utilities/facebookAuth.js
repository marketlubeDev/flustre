const { NormalUser } = require("../model/userModel");
const createToken = require("./createToken");

/**
 * Find or create a user based on Facebook authentication data
 * @param {Object} facebookData - Facebook user data
 * @returns {Promise<Object>} User object and token
 */
const findOrCreateFacebookUser = async (facebookData) => {
  try {
    const { facebookId, email, name, picture } = facebookData;

    // Check if user exists with Facebook ID
    let user = await NormalUser.findOne({ facebookId });

    if (!user) {
      // Check if user exists with email
      user = await NormalUser.findOne({ email });

      if (user) {
        // User exists but doesn't have Facebook ID, link the accounts
        user.facebookId = facebookId;
        user.facebookEmail = email;
        user.facebookName = name;
        user.facebookPicture = picture;
        user.authProvider = "facebook";
        user.isEmailVerified = true; // Facebook emails are pre-verified
        await user.save();
      } else {
        // Create new user with Facebook data
        user = new NormalUser({
          email,
          username:
            email.split("@")[0] || name.replace(/\s+/g, "").toLowerCase(), // Generate username from email or name
          facebookId,
          facebookEmail: email,
          facebookName: name,
          facebookPicture: picture,
          authProvider: "facebook",
          isEmailVerified: true,
          role: "user", // Ensure role is set
        });
        await user.save();
      }
    }

    // Generate token
    // const token = createToken(
    //   { id: user._id, email: user.email },
    //   process.env.SECRET_STR,
    //   process.env.LOGIN_EXPIRES
    // );
    const token = createToken(user._id, "user");

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        authProvider: user.authProvider,
        profilePicture: user.facebookPicture || user.profilePicture,
      },
      token,
    };
  } catch (error) {
    console.error("Error in findOrCreateFacebookUser:", error);
    throw error;
  }
};

module.exports = {
  findOrCreateFacebookUser,
};
