import { axiosInstance } from "../axios/axiosInstance";

export const getSalesReport = async (page = 1, limit = 10, filters = {}) => {
  const { storeId, brandId, startDate, endDate, search } = filters;
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(storeId && storeId !== "All Stores" ? { storeId } : {}),
    ...(brandId && brandId !== "All Brands" ? { brandId } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(search ? { search } : {}),
  });

  const response = await axiosInstance.get(`/sales/report?${queryParams}`);
  return response.data;
};
