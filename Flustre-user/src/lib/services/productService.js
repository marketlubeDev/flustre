import axiosInstance from "../axios/axiosInstance";

// GET /product/get-products
export async function fetchProducts(params = {}, signal) {
  const response = await axiosInstance.get("/product/get-products", {
    params,
    signal,
  });
  return response.data;
}

// GET /product/get-product/:productId
export async function fetchProductDetails(productId, signal) {
  const response = await axiosInstance.get(
    `/product/get-product/${productId}`,
    {
      signal,
    }
  );
  return response.data;
}

// GET /product/search?keyword=...&page=...&limit=...
export async function searchProducts(params = {}, signal) {
  const response = await axiosInstance.get("/product/search", {
    params,
    signal,
  });
  return response.data;
}
