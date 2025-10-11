import axiosInstance from "../axios/axiosInstance";

export async function fetchAllCategories(signal) {
    const response = await axiosInstance.get("/category/allcategories", { signal });
    return response.data;
}

export async function searchCategories(query, signal) {
    const response = await axiosInstance.get("/category/search", { params: { query }, signal });
    return response.data;
}


