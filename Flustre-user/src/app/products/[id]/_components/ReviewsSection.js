"use client";

import { useMemo, useState } from "react";
import { Modal, Rate, Input, Button } from "antd";
import { MdAttachFile } from "react-icons/md";
import Image from "next/image";

export default function ReviewsSection({ product, selectedImage }) {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const productId = useMemo(() => product?._id || product?.id, [product]);
  
  // Static mock reviews data
  const reviewsData = {
    stats: {
      averageRating: product?.ratingStats?.average || 4.5,
      totalRatings: product?.ratingStats?.total || 128,
      ratingCounts: product?.ratingStats?.distribution || {
        5: 45,
        4: 38,
        3: 25,
        2: 12,
        1: 8
      }
    },
    reviews: [
      {
        _id: "review1",
        rating: 5,
        review: "Excellent product! The quality is outstanding and it works exactly as described. Highly recommended!",
        userId: { username: "Sarah M." },
        createdAt: "2024-01-15T10:30:00Z",
        images: []
      },
      {
        _id: "review2", 
        rating: 4,
        review: "Very good product, fast delivery. The packaging was secure and the product arrived in perfect condition.",
        userId: { username: "John D." },
        createdAt: "2024-01-10T14:20:00Z",
        images: []
      },
      {
        _id: "review3",
        rating: 5,
        review: "Amazing quality! I've been using this for a week now and I can already see the difference. Worth every penny!",
        userId: { username: "Emma L." },
        createdAt: "2024-01-08T09:15:00Z",
        images: []
      }
    ]
  };
  
  const isLoading = false;

  // Early return if product is not available
  if (!product) {
    return (
      <div className="my-12 w-full mx-auto md:px-0">
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <p className="text-gray-500">Loading product reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  const showReviewModal = () => {
    setIsReviewModalVisible(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const handleReviewModalCancel = () => {
    setIsReviewModalVisible(false);
    setRating(0);
    setReviewText("");
    setSelectedImages([]);
    document.body.style.overflow = "unset"; // Restore background scrolling
  };

  const handleReviewSubmit = () => {
    // Static review submission - just show success message
    alert("Thank you for your review! (This is a demo - review not actually submitted)");
    handleReviewModalCancel();
  };

  const clearRating = () => {
    setRating(0);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      const newImages = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  };

  return (
    <>
      <div className="my-12 w-full mx-auto md:px-0">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Ratings Summary */}
          <div className="md:w-1/3 w-full flex flex-col items-start md:items-start reviews-sticky-left lg:sticky lg:top-32">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#333" }}
            >
              Reviews & Rating
            </h3>
            <div className="flex items-center mb-2">
              <span
                className="text-3xl font-bold mr-2"
                style={{ color: "var(--color-primary)" }}
              >
                {Number(reviewsData?.stats?.averageRating || 0).toFixed(1)}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    key={star}
                    src={
                      star <= Math.round(reviewsData?.stats?.averageRating || 0)
                        ? "/filledstar.svg"
                        : "/star.svg"
                    }
                    alt="star"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                ))}
              </div>
            </div>
            <span className="text-gray-600 mb-4 text-sm">
              {`Based on ${reviewsData?.stats?.totalRatings || 0} reviews`}
            </span>
            {/* Ratings Bar */}
            <div className="w-full max-w-xs space-y-1 mb-4 md:max-w-none">
              {[5, 4, 3, 2, 1].map((star) => {
                const total = reviewsData?.stats?.totalRatings || 0;
                const count = reviewsData?.stats?.ratingCounts?.[star] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 w-4">{star}</span>
                    <Image
                      src="/filledstar.svg"
                      alt="star"
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-1.5 bg-[var(--color-primary)] rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-500 ml-2">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={showReviewModal}
              className="mt-2 px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded font-medium hover:bg-[var(--color-primary)] hover:text-white transition text-sm cursor-pointer"
            >
              Rate Product
            </button>
          </div>

          {/* Right: Review Images & Customer Reviews */}
          <div className="md:w-2/3 w-full">
            {/* Review Images */}
            <div className="mb-4">
              <div>
                <h5
                  className="mb-2"
                  style={{
                    color: "#333",
                    leadingTrim: "both",
                    textEdge: "cap",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Review Images
                </h5>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Image
                      key={idx}
                      src={
                        product?.featureImages &&
                        product.featureImages.length > 0
                          ? product.featureImages[selectedImage]
                          : product?.image || "/shop2.png"
                      }
                      alt="Selected product"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x64?text=Product";
                      }}
                      unoptimized={(product?.featureImages &&
                      product.featureImages.length > 0
                        ? product.featureImages[selectedImage]
                        : product?.image
                      )?.includes("amazonaws.com")}
                    />
                  ))}
                </div>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1.5px solid #E5E7EB",
                    backgroundColor: "#E5E7EB",
                    height: "1.5px",
                    margin: "16px 0",
                  }}
                />
              </div>
            </div>
            {/* Customer Reviews */}
            <div>
              <h4
                className="mb-3"
                style={{
                  color: "#333",
                  leadingTrim: "both",
                  textEdge: "cap",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  letterSpacing: "-0.2px",
                }}
              >
                Customer Reviews
              </h4>
              <div className="space-y-6">
                {(reviewsData?.reviews || []).map((r, idx) => (
                  <div key={r._id || idx}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#17632D] text-white text-xs font-semibold">
                        <span className="mr-0.5">{r.rating}</span>
                        <Image
                          src="/whitestar.svg"
                          alt="star"
                          width={12}
                          height={12}
                          className="w-3 h-3 inline"
                        />
                      </span>
                      <span className="text-gray-800 text-sm font-medium">
                        {r?.userId?.username || r?.userId?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {Array.isArray(r.images) && r.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {r.images.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`review-${i}`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                            unoptimized={String(img).includes("amazonaws.com")}
                          />
                        ))}
                      </div>
                    )}
                    {r.review && (
                      <p className="text-sm text-gray-700 mt-2">{r.review}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        title="Add Review"
        open={isReviewModalVisible}
        onCancel={handleReviewModalCancel}
        footer={null}
        width={500}
        centered
      >
        <div className="space-y-6">
          {/* Rating Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How was the item?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Rate your experience with this product
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors duration-200 ${
                      star <= rating ? "text-[#EF9C16]" : "text-transparent"
                    }`}
                    style={{
                      WebkitTextStroke: star <= rating ? "none" : "1px #EF9C16",
                      cursor: "pointer",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                onClick={clearRating}
                className="text-red-500 text-sm hover:text-red-700 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Review Text Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Write Your Review{" "}
              <span className="text-red-500">*</span>
            </h3>
            <div className="relative">
              <Input.TextArea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                style={{
                  resize: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.01)",
                  paddingRight: "40px", // Add padding to make room for the icon
                }}
              />
              {/* Attach File Icon */}
              <div className="absolute bottom-2 right-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <MdAttachFile
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontSize: "20px" }}
                  />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Border Separator */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Submit Button */}
          <div className="w-full">
            <Button
              type="primary"
              onClick={handleReviewSubmit}
              disabled={!rating || !reviewText.trim()}
              style={{
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                height: "40px",
                width: "100%",
                color: "#ffffff",
                fontWeight: "600",
              }}
            >
              Rate Product
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        /* Custom star rating styles */
        .custom-rate .ant-rate-star {
          color: #ef9c16 !important;
        }

        .custom-rate .ant-rate-star-first,
        .custom-rate .ant-rate-star-second {
          color: #ef9c16 !important;
        }

        .custom-rate .ant-rate-star-half .ant-rate-star-first,
        .custom-rate .ant-rate-star-half .ant-rate-star-second {
          color: #ef9c16 !important;
        }

        .custom-rate .ant-rate-star-full .ant-rate-star-first,
        .custom-rate .ant-rate-star-full .ant-rate-star-second {
          color: #ef9c16 !important;
        }

        /* Remove blue border on textarea focus/hover */
        .ant-input:focus,
        .ant-input:hover,
        .ant-input-focused,
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper-focused {
          border-color: #d9d9d9 !important;
          box-shadow: none !important;
        }

        .ant-input-textarea:focus,
        .ant-input-textarea:hover,
        .ant-input-textarea-focused,
        .ant-input-textarea .ant-input:focus,
        .ant-input-textarea .ant-input:hover,
        .ant-input-textarea .ant-input-focused {
          border-color: #d9d9d9 !important;
          box-shadow: none !important;
        }

        /* Override Ant Design's default focus styles */
        .ant-input:focus,
        .ant-input-focused {
          border: 1px solid #d9d9d9 !important;
          box-shadow: none !important;
        }

        .ant-input-textarea .ant-input:focus,
        .ant-input-textarea .ant-input-focused {
          border: 1px solid #d9d9d9 !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
}
