import { axiosInstance } from "../axios/axiosInstance";

export const getAllLabels = async () => {
  try {
    const response = await axiosInstance.get("/label/getlabels");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchLabel = async (query) => {
  try {
    const response = await axiosInstance.get(`/label/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addLabel = async (labelData) => {
  try {
    const response = await axiosInstance.post("/label/addlabel", labelData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editLabel = async (labelId, labelData) => {
  try {
    const response = await axiosInstance.patch(
      `/label/editlabel/${labelId}`,
      labelData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLabel = async (labelId) => {
  try {
    const response = await axiosInstance.delete(
      `/label/deletelabel/${labelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByLabel = async (labelId) => {
  try {
    const response = await axiosInstance.get(
      `/product/get-product-bylabel/${labelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
