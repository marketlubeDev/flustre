import { toast } from "react-toastify";
import { axiosInstance } from "../axios/axiosInstance";

export const getOrders = async (queryParams = "") => {
  return axiosInstance
    .get(`/order/get-orders${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    });
};

export const getOrderStats = () => {
  return axiosInstance
    .get("/order/get-order-stats")
    .then((res) => res.data)
    .catch((err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    });
};

export const updateOrderStatus = async (orderId, status, type) => {
  return axiosInstance
    .patch(`/order/change-status/${orderId}`, { status, type })
    // .then((res) => res.data)
    // .catch((err) => {
    //   toast.error(err?.response?.data?.message || "Something went wrong");
    // });
};

export const updateOrder = async (orderId, data) => {
  return axiosInstance
    .patch(`/order/update-order/${orderId}`, data)
    .then((res) => res.data)
    .catch((err) => {
      toast.error(err?.response?.data?.message || "Failed to update Contact details");
    });
};


export const deleteEnquiry = async (enquiryId) => {
  return axiosInstance
    .delete(`/order/delete-enquiry/${enquiryId}`)
    .then((res) => res.data)
    .catch((err) => {
      toast.error(err?.response?.data?.message || "Failed to delete enquiry");
    });
};
