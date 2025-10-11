import { axiosInstance } from "../axios/axiosInstance";
export const getAllBrands = async (page = 1, limit = 1000) => {
  try {
    const response = await axiosInstance.get(`/brand?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchBrand = async (query) => {
  try {
    const response = await axiosInstance.get(`/brand/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBrand = async (brandData) => {
  const response = await axiosInstance.post("/brand", brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editBrand = async (brandId, brandData) => {
  const response = await axiosInstance.patch(`/brand/${brandId}`, brandData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBrand = async (brandId) => {
  const response = await axiosInstance.delete(`/brand/${brandId}`);
  return response.data;
};
