const {
  addProduct,
  listProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getProductsByLabel,
  getGroupedProductsByLabel,
  searchProducts,
  softDeleteProduct,
  updateVariant,
} = require("../../controllers/productController");
const autheticateToken = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/multer");

const productRouter = require("express").Router();

productRouter.get("/get-products", listProducts);
productRouter.get(
  "/get-products-by-role",
  autheticateToken(["admin", "store"]),
  listProducts
);
productRouter.get("/get-product/:productId", getProductDetails);
productRouter.get("/get-product-bylabel/:labelId", getProductsByLabel);
productRouter.get("/get-grouped-products-label", getGroupedProductsByLabel);

productRouter.get("/search", searchProducts);

productRouter.post(
  "/addproduct",
  autheticateToken(["admin", "store"]),
  upload.any(),
  addProduct
);

productRouter.patch(
  "/update-product",
  autheticateToken(["admin", "store"]),
  upload.any(),
  updateProduct
);

productRouter.delete(
  "/delete-product",
  autheticateToken(["admin", "seller"]),
  deleteProduct
);

productRouter.patch(
  "/soft-delete",
  autheticateToken(["admin" , "store"]),
  softDeleteProduct
);

productRouter.patch(
  "/update-variant/:variantId",
  autheticateToken(["admin" , "store"]),
  updateVariant
);

module.exports = productRouter;
