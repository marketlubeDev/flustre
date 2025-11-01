"use client";

import ProductServiceBenefits from "./ProductServiceBenefits";
import VariantOptions from "./VariantOptions";
import CouponsSection from "./CouponsSection";
import PurchaseActions from "./PurchaseActions";
import Button from "@/app/_components/common/Button";
import Image from "next/image";

// Fallback static data (only used if API data is missing)
const FALLBACK_ABOUT =
  "Experience the perfect blend of style and functionality with our premium collection. Crafted with the finest materials and attention to detail, this collection brings elegance and comfort to your space.";
const FALLBACK_SPECIFICATIONS = {
  Material: "High-quality materials",
  "Care Instructions": "Follow product care guidelines",
};
const FALLBACK_RETURN_POLICY =
  "Returns are accepted within 7 days for unused items in original packaging. Contact our support team with your order ID for returns.";

export default function ProductInfoSection({
  product,
  coupons,
  visibleCoupons,
  remainingCouponsCount,
  showMoreCoupons,
  setShowMoreCoupons,
  remainingCoupons,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  addToCart,
  buyNow,
  cartLoading,
  showMoreDetails,
  setShowMoreDetails,
}) {
  // Calculate discount percentage dynamically
  const calculateDiscountPercentage = () => {
    let currentPrice, originalPrice;

    // Handle variant products
    if (
      product?.variants &&
      product.variants.length > 0 &&
      selectedVariant !== undefined
    ) {
      const variant = product.variants[selectedVariant];
      currentPrice = variant?.price;
      originalPrice = variant?.compareAtPrice || variant?.price;
    } else {
      // Handle regular products
      currentPrice = product?.price;
      originalPrice = product?.originalPrice;
    }

    // Only calculate discount if we have both prices and original price is higher
    if (currentPrice && originalPrice && originalPrice > currentPrice) {
      const discountAmount = originalPrice - currentPrice;
      const discountPercentage = Math.round(
        (discountAmount / originalPrice) * 100
      );
      return discountPercentage;
    }

    return 0;
  };

  const discountPercentage = calculateDiscountPercentage();

  console.log(product, "kgsakdgskgksh");

  // Extract category name - handle both string and object
  const categoryName =
    typeof product?.category === "string"
      ? product.category
      : product?.category?.name || "Product";

  return (
    <div className="space-y-6">
      <div>
        <p
          className="text-gray-600 mb-1"
          style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
        >
          {categoryName}
        </p>
        <h1
          className="mb-2"
          style={{
            color: "#333333",
            fontSize: "clamp(23px, 5vw, 40px)",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            letterSpacing: "-0.8px",
            textTransform: "capitalize",
          }}
        >
          {product?.name || "Product Name"}
        </h1>

        {/* Rating Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Image
                key={star}
                src={
                  star <= Math.round(product?.ratingStats?.average || 0)
                    ? "/filledstar.svg"
                    : "/star.svg"
                }
                alt="star"
                width={16}
                height={16}
                className="w-3 h-3 sm:w-4 sm:h-4"
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm">
            <span className="text-black">
              {Number(product?.ratingStats?.average || 0).toFixed(1)}
            </span>
            <span className="text-gray-600">
              {" "}
              ({product?.ratingStats?.total || 0} reviews)
            </span>
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="font-bold text-xl sm:text-2xl md:text-3xl"
              style={{
                overflow: "hidden",
                color: "#333333",
                textOverflow: "ellipsis",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "100%",
                letterSpacing: "-0.48px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              ₹{" "}
              {(product?.variants &&
              product.variants.length > 0 &&
              selectedVariant !== undefined
                ? product.variants[selectedVariant]?.price
                : product?.price
              )?.toLocaleString()}
            </span>
            <span className="text-sm sm:text-lg text-gray-500 line-through">
              ₹{" "}
              {(product?.variants &&
              product.variants.length > 0 &&
              selectedVariant !== undefined
                ? product.variants[selectedVariant]?.compareAtPrice
                : product?.originalPrice
              )?.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span
                className="px-2 py-1 rounded text-xs sm:text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                -{discountPercentage}% OFF
              </span>
            )}
          </div>
          <span
            className="text-xs text-gray-400 block mt-1 text-left"
            style={{ lineHeight: "1.2" }}
          >
            Inclusive of all taxes
          </span>
        </div>

        <CouponsSection
          coupons={coupons}
          visibleCoupons={visibleCoupons}
          remainingCoupons={remainingCoupons}
          showMoreCoupons={showMoreCoupons}
          setShowMoreCoupons={setShowMoreCoupons}
        />

        {/* Variant Selection (Options-based, supports multiple groups) */}
        <VariantOptions
          product={product}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
        />
      </div>

      {/* Quantity and Add to Cart */}
      <PurchaseActions
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
        addToCart={addToCart}
        buyNow={buyNow}
        cartLoading={cartLoading}
      />

      <ProductServiceBenefits />

      {/* About product */}
      <div className="rounded-lg py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          About Product
        </h3>
        {(() => {
          // Use API data or fallback
          const currentDescription = product?.about || FALLBACK_ABOUT;

          // Split description into words to control preview length
          const words = currentDescription.split(" ");
          const previewWords = words.slice(0, 30); // Show first 30 words
          const remainingWords = words.slice(30);
          const hasMoreContent = remainingWords.length > 0;

          return (
            <>
              <p className="text-gray-700 leading-relaxed mb-2 text-sm sm:text-base">
                {showMoreDetails ? currentDescription : previewWords.join(" ")}
                {!showMoreDetails && hasMoreContent && "..."}
              </p>
              {hasMoreContent && (
                <button
                  onClick={() => setShowMoreDetails((v) => !v)}
                  className="text-[#2B73B8] text-sm font-medium underline hover:underline cursor-pointer"
                  style={{
                    display: "inline-block",
                    marginTop: "4px",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {showMoreDetails ? "Show less" : "Show more"}
                </button>
              )}
            </>
          );
        })()}
      </div>

      {/* Specification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Specifications
        </h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base">
          {(() => {
            // Handle specifications - can be array or object
            const specs = product?.specifications;

            if (Array.isArray(specs) && specs.length > 0) {
              // If it's an array of strings
              return specs.map((spec, index) => <li key={index}>{spec}</li>);
            } else if (
              specs &&
              typeof specs === "object" &&
              !Array.isArray(specs)
            ) {
              // If it's an object with key-value pairs
              return Object.entries(specs).map(([key, value], index) => (
                <li key={index}>
                  <strong>{key}:</strong> {value}
                </li>
              ));
            } else {
              // Fallback
              return Object.entries(FALLBACK_SPECIFICATIONS).map(
                ([key, value], index) => (
                  <li key={index}>
                    <strong>{key}:</strong> {value}
                  </li>
                )
              );
            }
          })()}
        </ul>
      </div>

      {/* Return & Refund Policy */}
      <div className="mt-8">
        <div className="border-t border-gray-200 mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Return & Refund Policy
        </h3>
        <p className="text-gray-700 mb-2 text-sm sm:text-base">
          {product?.returnPolicyText ||
            (product?.returnPolicyDays
              ? `Returns accepted within ${product.returnPolicyDays} days. ${FALLBACK_RETURN_POLICY}`
              : FALLBACK_RETURN_POLICY)}
        </p>
      </div>
    </div>
  );
}
