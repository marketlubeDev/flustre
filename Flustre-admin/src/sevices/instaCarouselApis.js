import { axiosInstance } from "../axios/axiosInstance";

export const createInstaCarouselVideo = async ({ title, file, thumbnail }) => {
  const formData = new FormData();
  formData.append("title", title);
  if (file) formData.append("video", file);
  if (thumbnail) formData.append("thumbnail", thumbnail);

  const response = await axiosInstance.post("/insta-carousel", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getInstaCarouselVideos = async ({
  search = "",
  sort = "recent",
  isActive,
} = {}) => {
  const params = {};
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (typeof isActive !== "undefined") params.isActive = isActive;
  const response = await axiosInstance.get("/insta-carousel", { params });
  return response.data;
};

export const updateInstaCarouselVideo = async (id, payload) => {
  const response = await axiosInstance.patch(`/insta-carousel/${id}`, payload);
  return response.data;
};

export const deleteInstaCarouselVideo = async (id) => {
  const response = await axiosInstance.delete(`/insta-carousel/${id}`);
  return response.data;
};
