import axiosInstance from "../axios/axiosInstance";

export async function fetchInstaCarouselVideos({
  signal,
  search = "",
  sort = "recent",
  isActive = true,
} = {}) {
  const params = {};
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (typeof isActive !== "undefined") params.isActive = isActive;
  const response = await axiosInstance.get("/insta-carousel", {
    params,
    signal,
  });
  return response.data;
}
