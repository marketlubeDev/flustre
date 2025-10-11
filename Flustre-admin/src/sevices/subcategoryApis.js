import { axiosInstance } from "../axios/axiosInstance";

export const createSubCategory = async (data) => {
  const response = await axiosInstance.post("/subcategory", data);
  return response.data;
};

export const getAllSubCategories = async () => {
  const response = await axiosInstance.get("/subcategory");
  return response.data;
};

export const updateSubCategory = async (id, data) => {
  const response = await axiosInstance.patch(`/subcategory/${id}`, data);
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await axiosInstance.delete(`/subcategory/${id}`);
  return response.data;
};

export const searchSubCategory = async (keyword) => {
  const response = await axiosInstance.get(
    `/subcategory/search?keyword=${keyword}`
  );
  return response.data;
};
