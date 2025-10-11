import { axiosInstance } from "../axios/axiosInstance";

// Get all reviews for admin
export const getAllReviews = async () => {
  const response = await axiosInstance.get("/review/get-all-reviews");
  return response.data;
};

// Get reviews for a specific product
export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/review/get-reviews/${productId}`);
  return response.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/review/delete-review/${reviewId}`);
  return response.data;
};

// Delete multiple reviews
export const deleteMultipleReviews = async (reviewIds) => {
  const deletePromises = reviewIds.map(id => deleteReview(id));
  const results = await Promise.allSettled(deletePromises);
  
  // Check if any deletions failed
  const failed = results.filter(result => result.status === 'rejected');
  if (failed.length > 0) {
    throw new Error(`Failed to delete ${failed.length} review(s)`);
  }
  
  return { message: `Successfully deleted ${reviewIds.length} review(s)` };
};