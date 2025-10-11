import { axiosInstance } from "../axios/axiosInstance";

const getFeedbacks = async (page) => {
  const response = await axiosInstance.get(`/feedback/get-feedbacks?page=${page}`);
  return response.data;
};

const deleteFeedback = async (feedbackId) => {  
  const response = await axiosInstance.delete(`/feedback/delete-feedback/${feedbackId}`);
  return response.data;
};

export { getFeedbacks , deleteFeedback };
