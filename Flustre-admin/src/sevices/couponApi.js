import { axiosInstance } from "../axios/axiosInstance";

export const createCoupon = async (couponData) => {
  const response = await axiosInstance.post("/coupon", couponData);
  return response.data;
};

export const editCoupon = async (id, couponData) => {
  const response = await axiosInstance.patch(`/coupon/${id}`, couponData);
  return response.data;
};

export const searchCoupon = async (code) => {
  const response = await axiosInstance.get(`/coupon/search?q=${code}`);
  return response.data;
};

export const removeCoupon = async (id) => {
  const response = await axiosInstance.delete(`/coupon/${id}`);
  return response.data;
};

export const getAllCoupons = async () => {
  const response = await axiosInstance.get("/coupon");
  return response.data;
};
