import axiosInstance from "../axios/axiosInstance";

export async function addToWishlistApi(data) {
  const { productId, variantId } =
    typeof data === "object" && !Array.isArray(data) ? data : {};

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const payload = {
    productId,
    variantId: variantId || undefined,
  };

  const response = await axiosInstance.post("/wishlist/add-to-wishlist", payload);
  return response.data;
}


export async function removeFromWishlistApi(data) {
  const { productId, variantId } =
    typeof data === "object" && !Array.isArray(data) ? data : {};

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const payload = {
    productId,
    variantId: variantId || undefined,
  };

  const response = await axiosInstance.delete("/wishlist/remove-from-wishlist", {
    data: payload,
  });
  return response.data;
}


export async function getWishlistApi() {
  const response = await axiosInstance.get("/wishlist/get-wishlist");
  return response.data;
}


export async function clearWishlistApi() {
  const response = await axiosInstance.post("/wishlist/clear-wishlist");
  return response.data;
}


export async function syncWishlistApi(items) {
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }

  const response = await axiosInstance.post("/wishlist/sync-wishlist", {
    items,
  });
  return response.data;
}


export async function checkWishlistStatusApi(params) {
  const { productId, variantId } = params || {};

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const queryParams = new URLSearchParams({ productId });
  if (variantId) {
    queryParams.append("variantId", variantId);
  }

  const response = await axiosInstance.get(
    `/wishlist/check-wishlist-status?${queryParams.toString()}`
  );
  return response.data;
}

