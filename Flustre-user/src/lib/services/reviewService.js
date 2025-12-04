import axiosInstance from "../axios/axiosInstance";

export async function fetchProductReviews(productId) {
  const res = await axiosInstance.get(`/review/get-reviews/${productId}`);
  return res.data;
}

export async function submitReview({ productId, rating, review, files }) {
  const form = new FormData();
  form.append("productId", productId);
  form.append("rating", String(rating));
  form.append("review", review);
  (files || []).forEach((f) => form.append("images", f));
  const res = await axiosInstance.post(`/review/add-review`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateUserAddress(payload) {
  const res = await axiosInstance.patch(`/user/update-user`, payload);
  return res.data;
}