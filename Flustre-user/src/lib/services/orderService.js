import axiosInstance from "../axios/axiosInstance";

export async function placeOrder({ address, paymentMethod, quantities }) {
  const response = await axiosInstance.post("/order/placeorder", {
    address: address ?? null,
    paymentMethod,
    quantities: quantities ?? null,
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

// ---------- Online payment helpers (Razorpay) ----------

// Creates a Razorpay order on the backend based on the user's cart
export async function createPaymentIntent() {
  const response = await axiosInstance.post("/order/paymentIntent");
  return response.data;
}

// Verifies Razorpay payment and creates the order on the backend
export async function verifyPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  amount,
  address,
}) {
  const response = await axiosInstance.post("/order/paymentVerify", {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    address,
  });
  return response.data;
}