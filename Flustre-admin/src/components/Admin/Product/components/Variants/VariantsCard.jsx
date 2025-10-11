import React from "react";
import { FaTrash } from "react-icons/fa";

const VariantCard = ({
  variant,
  handleDeleteVariant,
  setCurrentVariant,
  isSelected,
  currentVariant,
}) => {
  const {
    variantNumber,
    title,
    attributes,
    price,
    offerPrice,
    stock,
    images,
    editMode,
  } = variant;

  // Function to safely get image URL
  const getImageUrl = (image) => {
    if (!image) return null;

    // If image is already a URL string (from existing product)
    if (typeof image === "string") return image;

    // If image is a File object (from new upload)
    if (image instanceof File) {
      try {
        return URL.createObjectURL(image);
      } catch (error) {
        console.error("Error creating object URL:", error);
        return null;
      }
    }

    return null;
  };

  return (
    <div
      className={`relative bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition-all duration-200 max-w-64
        ${
          isSelected
            ? "border-2 border-blue-600"
            : "border-gray-200 hover:border-gray-300"
        }`}
      onClick={() => setCurrentVariant(variant)}
    >
      {/* Delete Button - Show only if not in edit mode */}
      {!editMode && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when deleting
            handleDeleteVariant();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        </div>
      )}

      {/* Variant Number */}
      <div className="mb-2">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded ${
            isSelected ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
          }`}
        >
          Variant {variantNumber}
        </span>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {images &&
          images.slice(0, 2).map((image, index) => {
            const imageUrl = getImageUrl(image);
            return imageUrl ? (
              <div key={index} className="aspect-square">
                <img
                  src={imageUrl}
                  alt={`Variant ${variantNumber} - Image ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ) : null;
          })}
      </div>

      {/* Variant Details */}
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">
          {attributes?.description.split(" ").length > 5
            ? attributes?.description.split(" ").slice(0, 5).join(" ") +
              "..."
            : attributes?.description || "No description"}
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-medium">₹{price}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Offer Price:</span>
          <span className="font-medium">₹{offerPrice}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Stock:</span>
          <span className="font-medium">{stock}</span>
        </div>
      </div>
    </div>
  );
};

export default VariantCard;
