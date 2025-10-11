const {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  updateCartItem,
  checkStock,
  checkAvailability,
} = require("../../controllers/cartController");
const autheticateToken = require("../../middlewares/authMiddleware");

const cartRouter = require("express").Router();

cartRouter.post("/add-to-cart", autheticateToken(["user"]), addToCart);
cartRouter.delete(
  "/remove-from-cart",
  autheticateToken(["user"]),
  removeFromCart
);
cartRouter.post("/clear-cart", autheticateToken(["user"]), clearCart);
cartRouter.get("/get-cart", autheticateToken(["user"]), getCart);
cartRouter.patch(
  "/update-cart-quantity",
  autheticateToken(["user"]),
  updateCartItem
);
cartRouter.get("/check-stock", autheticateToken(["user"]), checkStock);
cartRouter.post("/check-availability", checkAvailability);
module.exports = cartRouter;
