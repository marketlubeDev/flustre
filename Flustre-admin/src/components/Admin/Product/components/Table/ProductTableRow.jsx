import React from "react";
import { useNavigate } from "react-router-dom";

const ProductTableRow = ({
  product,
  selectedProducts,
  setSelectedProducts,
  role,
  refetchProducts,
  index,
}) => {
  const navigate = useNavigate();


  const handleEdit = (id) => {
    const query = `?productId=${encodeURIComponent(id)}`;
    if (role === "store") {
      navigate(`/store/product/addproduct${query}`, {
        state: { productId: id },
      });
    } else {
      navigate(`/admin/product/addproduct${query}`, {
        state: { productId: id },
      });
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, product._id]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== product._id));
    }
  };

  const getStatusBadge = () => {
    if (product?.isDraft) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Draft
        </span>
      );
    }

    if (product?.activeStatus) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600"
          style={{
            borderRadius: "999px",
            background: "#E1E4EA",
          }}
        >
          Inactive
        </span>
      );
    }
  };

  // Helper function to format image URL
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // If it's already a complete URL (starts with http/https), return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's a relative path, add the backend URL
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}/${
      imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
    }`;
  };

  // Get product image
  const getProductImage = () => {
    let imageUrl = null;

    // Check for mainImage (from backend formatter)
    if (product?.mainImage) {
      imageUrl = product.mainImage;
    }
    // Check for images array
    else if (product?.images && product.images.length > 0) {
      imageUrl = product.images[0];
    }
    // Check for single image property
    else if (product?.image) {
      imageUrl = product.image;
    }
    // Check for variants images
    else if (
      product?.variants &&
      product.variants.length > 0 &&
      product.variants[0]?.images &&
      product.variants[0].images.length > 0
    ) {
      imageUrl = product.variants[0].images[0];
    }

    return formatImageUrl(imageUrl);
  };

  const productImage = getProductImage();

  return (
    <>
      <tr
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-[#FDFDFD]"
        } border-b border-gray-200 hover:bg-gray-50 transition-colors`}
      >
        {/* Checkbox */}
        <td className="px-6 py-2 border-r border-[#F0F0F0]">
          <input
            type="checkbox"
            checked={selectedProducts?.includes(product._id)}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>

        {/* Product Image and Name */}
        <td className="px-6 py-2 border-r border-[#F0F0F0]">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 relative">
              {productImage ? (
                <>
                  <img
                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    src={productImage}
                    alt={product?.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".placeholder-image"
                      ).style.display = "flex";
                    }}
                  />
                  <div className="placeholder-image h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 absolute top-0 left-0 hidden">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">
                  {product?.name?.length > 40
                    ? product?.name?.substring(0, 40) + "..."
                    : product?.name}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {(() => {
                  const variantCount = product?.variants?.length;

                  return variantCount > 0
                    ? `${variantCount} variants`
                    : "No variants";
                })()}
              </div>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-2 border-r border-[#F0F0F0]">
          {getStatusBadge()}
        </td>

        {/* Category */}
        <td className="px-6 py-2 text-sm text-gray-900 border-r border-[#F0F0F0]">
          {product?.category?.name || "N/A"}
        </td>

        {/* Sub Category */}
        <td className="px-6 py-2 text-sm text-gray-900 border-r border-[#F0F0F0]">
          {product?.subcategory?.name || "N/A"}
        </td>

        {/* Last Updated */}
        <td className="px-6 py-2 text-sm text-gray-500 border-r border-[#F0F0F0]">
          {new Date(product?.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </td>

        {/* Actions */}
        <td className="px-6 py-2 text-right text-sm font-medium">
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleEdit(product?._id)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
              title="Edit Product"
            >
              <img src="/icons/edit-icon.svg" alt="Edit" className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductTableRow;
