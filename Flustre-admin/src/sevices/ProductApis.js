import { axiosInstance } from "../axios/axiosInstance";

export const listProducts = (page, limit = 10, filter = {}) => {
  return axiosInstance.get(
    `product/get-products-by-role?page=${page}&limit=${limit}`,
    {
      params: filter,
    }
  );
};

export const addProduct = (formData) => {
  return axiosInstance.post("product/addproduct", formData);
};

export const getProductById = (id) => {
  return axiosInstance.get(`product/get-product/${id}`);
};

export const searchProducts = async ({ keyword, page = 1, limit = 3 }) => {
  try {
    const response = await axiosInstance.get(`admin/product/search`, {
      params: {
        keyword,
        page,
        limit,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, formData) => {
  const response = await axiosInstance.patch(
    `product/update-product?productId=${productId}`,
    formData
  );
  return response;
};

export const deleteProduct = async (productId) => {
  const response = await axiosInstance.patch(
    `product/soft-delete?productId=${productId}`
  );
  return response;
};

export const deleteVariant = async (variantId) => {
  // Adjust the endpoint as per your backend
  const response = await axiosInstance.patch(
    `product/update-variant/${variantId}`,
    { isDeleted: true }
  );
  return response;
};

export const bulkUpdateProductStatus = async (productIds, activeStatus) => {
  const response = await axiosInstance.patch(`product/bulk-update-status`, {
    productIds,
    activeStatus,
  });
  return response;
};
