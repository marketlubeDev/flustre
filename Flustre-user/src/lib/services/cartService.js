import axiosInstance from "../axios/axiosInstance";

export async function checkAvailability(data) {
  console.log("data", data);
  const response = await axiosInstance.post("/cart/check-availability", data);
  return response.data;
}

export async function addToCartApi(data) {
  // Accepts either a product object/id and builds the expected server payload
  const { product, productId, variantId, quantity } =
    typeof data === "object" && !Array.isArray(data) ? data : { product: data };

  const payload = {
    productId: productId || (product && (product.id || product._id || product)),
    variantId: variantId,
    quantity: quantity ?? 1,
  };

  const response = await axiosInstance.post("/cart/add-to-cart", payload);
  return response.data;
}

export async function removeFromCartApi(data) {
  // Accepts either a product object/id and builds the expected server payload
  const { product, productId, variantId } =
    typeof data === "object" && !Array.isArray(data) ? data : { product: data };

  const payload = {
    productId: productId || (product && (product.id || product._id || product)),
    variantId: variantId,
  };

  const response = await axiosInstance.delete("/cart/remove-from-cart", {
    data: payload,
  });
  return response.data;
}
