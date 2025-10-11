import axiosInstance from "../axios/axiosInstance";

// GET /label/group-labels -> { status, data: [{ label: { name, id }, products: [...] }] }
export async function fetchGroupedProductsByLabel(signal) {
  const response = await axiosInstance.get("/label/group-labels", { signal });
  // Normalize to always return an array of groups
  return response?.data?.data || [];
}
