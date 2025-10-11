import React from "react";
import ErrorMessage from "../../../../common/ErrorMessage";

const ImageUploaderContainer = ({
  images,
  handleClick,
  handleFileChange,
  fileInputs,
  error,
}) => {

  const getImageUrl = (image) => {
    if (!image) return null;

    if (typeof image === "string") return image;

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
    <div className="px-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Images <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`relative aspect-square rounded-lg border-2 border-dashed ${
              error ? "border-red-500" : "border-gray-300"
            } hover:border-gray-400 cursor-pointer flex items-center justify-center overflow-hidden`}
          >
            {images && images[index] ? (
              <>
                <img
                  src={getImageUrl(images[index])}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="mt-2 block text-sm text-gray-400">
                  Add Image
                </span>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              ref={(el) => (fileInputs.current[index] = el)}
            />
          </div>
        ))}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default ImageUploaderContainer;
