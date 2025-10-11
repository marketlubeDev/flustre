import axiosInstance from "../axios/axiosInstance";

export async function placeOrder({ address, paymentMethod }) {
  const response = await axiosInstance.post("/order/placeorder", {
    address: address ?? null,
    paymentMethod,
  });
  return response.data;
}

export async function getUserOrders() {
  const response = await axiosInstance.get("/order/get-user-orders");
  return response.data;
}

export async function getServerCart() {
  const response = await axiosInstance.get("/cart/get-cart");
  return response.data;
}

export async function addItemToServerCart({ productId, variantId, quantity }) {
  const response = await axiosInstance.post("/cart/add-to-cart", {
    productId,
    variantId,
    quantity,
  });
  return response.data;
}
