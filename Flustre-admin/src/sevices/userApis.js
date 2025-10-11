import { axiosInstance } from "../axios/axiosInstance";

export const listUsers = (page, limit) => {
  return axiosInstance.get(`/user/list?page=${page}&limit=${limit}`);
};

export const searchUser = (search) => {
  return axiosInstance.get(`/user/search?search=${search}`);
};

export const updateUserStatus = (userId, isBlocked) => {
  return axiosInstance.patch(`/admin/update-user-status`, {
    userId,
    isBlocked
  });
};