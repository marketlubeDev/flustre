import { axiosInstance } from "../axios/axiosInstance";

export const addBanner = async (bannerData) => {
  const response = await axiosInstance.post("/banner", bannerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editBanner = async (bannerId, bannerData) => {
  const response = await axiosInstance.patch(`/banner/${bannerId}`, bannerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBanner = async (bannerId) => {
  const response = await axiosInstance.delete(`/banner/${bannerId}`);
  return response.data;
};

export const getBanners = async () => {
  const response = await axiosInstance.get("/banner");
  return response.data;
};
