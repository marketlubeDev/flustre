import { axiosInstance } from "../axios/axiosInstance";

export const addOfferBanner = async (bannerData) => {
  const response = await axiosInstance.post("/offerBanner", bannerData);
  return response.data;
};

export const editOfferBanner = async (bannerId, bannerData) => {
  const response = await axiosInstance.patch(`/offerBanner/${bannerId}`, bannerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteOfferBanner = async (bannerId) => {
  const response = await axiosInstance.delete(`/offerBanner/${bannerId}`);
  return response.data;
};

export const getOfferBanners = async () => {
  const response = await axiosInstance.get("/offerBanner");
  return response.data;
};