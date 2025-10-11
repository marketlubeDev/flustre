import axiosInstance from "../axios/axiosInstance";

export const getBanners = async (bannerFor = null) => {
  const params = {};
  if (bannerFor) {
    params.bannerFor = bannerFor;
  }

  const response = await axiosInstance.get("/banner", { params });
  return response.data;
};

export const getProductBanners = async () => {
  return getBanners("product");
};

export const getFeaturedPromotionBanners = async () => {
  return getBanners("singleOffer");
};

export const getHeroBanners = async () => {
  return getBanners("hero");
};
