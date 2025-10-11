import axiosInstance from "../axios/axiosInstance";

export async function fetchAllBanners(signal) {
    const response = await axiosInstance.get("/banner", { signal });
    return response.data;
}

export async function fetchBannersByType(bannerFor, signal) {
    const response = await axiosInstance.get(`/banner?bannerFor=${bannerFor}`, { signal });
    return response.data;
}


