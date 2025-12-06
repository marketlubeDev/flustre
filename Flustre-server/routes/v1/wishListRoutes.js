const {
  addToWishList,
  removeFromWishList,
  getWishList,
  clearWishList,
  syncWishList,
  checkWishListStatus,
} = require("../../controllers/wishListController");
const autheticateToken = require("../../middlewares/authMiddleware");

const wishListRouter = require("express").Router();

wishListRouter.post(
  "/add-to-wishlist",
  autheticateToken(["user"]),
  addToWishList
);
wishListRouter.delete(
  "/remove-from-wishlist",
  autheticateToken(["user"]),
  removeFromWishList
);
wishListRouter.get(
  "/get-wishlist",
  autheticateToken(["user"]),
  getWishList
);
wishListRouter.post(
  "/clear-wishlist",
  autheticateToken(["user"]),
  clearWishList
);
wishListRouter.post(
  "/sync-wishlist",
  autheticateToken(["user"]),
  syncWishList
);
wishListRouter.get(
  "/check-wishlist-status",
  autheticateToken(["user"]),
  checkWishListStatus
);

module.exports = wishListRouter;

