import { axiosInstance } from "../axios/axiosInstance";

export const adminLogin = (data) => {
  return axiosInstance.post("/admin/login", data);
};
export const adminDashdoard = () => {
  return axiosInstance.get("/admin/dashboard");
};
export const adminLogout = () => {
  return axiosInstance.post("/admin/logout");
};
export const getcategoriesbrands = () => {
  return axiosInstance.get("/admin/getcategoriesbrands");
};
export const checkAdmin = () => {
  return axiosInstance.get("/admin/checkadmin");
};

export const adminUtilities = () => {
  return axiosInstance.get("/admin/adminutilities");
};

