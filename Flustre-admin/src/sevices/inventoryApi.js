import { axiosInstance } from "../axios/axiosInstance";

export const getInventory = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.storeId ? { storeId: params.storeId } : {}),
      ...(params.brandId ? { brandId: params.brandId } : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    });

    const response = await axiosInstance.get(`/inventory?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
