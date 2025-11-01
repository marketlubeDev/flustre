import axiosInstance from "../axios/axiosInstance";

export async function getAllCoupons() {
  const res = await axiosInstance.get("/coupon");
  return res.data?.coupons || [];
}

export async function searchCoupons(query) {
  const res = await axiosInstance.get(`/coupon/search`, {
    params: { q: query },
  });
  return res.data?.data?.coupons || [];
}

export async function applyCouponById(couponId, cartItems = null) {
  const res = await axiosInstance.post("/coupon/apply", {
    couponId,
    cartItems // Include cart items for non-logged-in users
  });
  return res.data;
}

export async function removeCouponFromCart() {
  const res = await axiosInstance.patch("/coupon");
  return res.data;
}
