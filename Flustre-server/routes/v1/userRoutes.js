const {
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
} = require("../../controllers/userController");
const autheticateToken = require("../../middlewares/authMiddleware");
const userRouter = require("express").Router();

userRouter.post("/register", register);
userRouter.post("/login", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/google-login", googleLogin);
userRouter.post("/facebook-login", facebookLogin);
userRouter.post("/logout", userLogOut);
userRouter.get("/list", autheticateToken(["admin"]), listUsers);
userRouter.get("/search", autheticateToken(["admin"]), searchUser);
userRouter.get("/check-user", autheticateToken(["user"]), checkUser);
userRouter.patch("/update-user", autheticateToken(["user"]), updateUser);
userRouter.patch(
  "/delete-address/:id",
  autheticateToken(["user"]),
  deleteUserAddress
);
module.exports = userRouter;
