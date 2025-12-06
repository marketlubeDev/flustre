"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/hooks/useWishlist";

import Image from "next/image";
import { FaHeart } from "react-icons/fa6";

function WishlistCard({ item, onRemove }) {
  const router = useRouter();

  // Handle both server response structure and localStorage structure
  // Server structure: { product: {...}, variant: {...}, addedAt, mainImage, images }
  // LocalStorage structure: { productId, variantId, id, ...productData }
  
  let product, variant, productId, variantId;
  
  if (item.product) {
    // Server response structure
    product = item.product;
    variant = item.variant;
    productId = product?._id || product?.id;
    variantId = variant?._id || variant?.id || null;
  } else {
    // LocalStorage structure or legacy structure
    product = item;
    variant = null;
    productId = item.productId || item.id?.split("_")[0] || item._id || item.id;
    variantId = item.variantId || (item.id?.includes("_") ? item.id.split("_")[1] : null);
  }
  
  // Get image - prefer variant image, then product mainImage, then first image
  const productImage = 
    variant?.images?.[0] || 
    item.mainImage || 
    product?.mainImage || 
    product?.featureImages?.[0] || 
    product?.primaryImage || 
    product?.images?.[0] ||
    product?.image ||
    "/placeholder.png";
  
  // Get price - prefer variant price, then product price
  const price = variant?.offerPrice || variant?.price || product?.offerPrice || product?.price || 0;
  const originalPrice = variant?.price || product?.price || product?.originalPrice || null;
  
  // Get product name
  const productName = product?.name || "Product";
  
  // Get category/subcategory for type
  const productType = product?.category?.name || product?.subcategory?.name || product?.type || "";

  const handleCardClick = () => {
    if (!productId) return;
    router.push(`/products/${productId}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(productId, variantId);
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 flex items-center justify-center overflow-hidden">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=Product+Image";
            }}
            unoptimized={productImage?.includes("amazonaws.com")}
          />
        </div>
        {/* Heart overlay */}
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 sm:p-2 hover:scale-105 transition-transform cursor-pointer z-10"
        >
          <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
        </button>
      </div>
      <div className="p-2">
        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
          {productName}
        </h3>
        {productType && (
          <p className="text-[10px] text-gray-600 mb-2">{productType}</p>
        )}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="font-bold tracking-tight text-xs sm:text-sm md:text-base lg:text-base"
            style={{ color: "var(--color-primary)" }}
          >
            <span className="align-baseline text-[9px] md:text-[10px] lg:text-xs">
              ₹
            </span>
            <span className="ml-1">
              {Number(price).toLocaleString()}
            </span>
          </span>
          {originalPrice && originalPrice > price ? (
            <span className="text-gray-500 tracking-tight line-through decoration-from-font decoration-gray-400 leading-none text-[10px] sm:text-xs md:text-sm lg:text-sm">
              ₹ {Number(originalPrice).toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { wishlistItems, removeItem, isLoading, totalItems } = useWishlist();

  const products = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return [];
    return wishlistItems;
  }, [wishlistItems]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white mx-auto w-full max-w-screen-xl px-4 md:px-10 py-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800">
              Wishlist
            </h1>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600 py-16">
            Loading wishlist...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            Your wishlist is empty
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {products.map((item, index) => {
              // Create a unique key from product and variant IDs
              const productId = item.product?._id || item.product?.id || item._id;
              const variantId = item.variant?._id || item.variant?.id;
              const key = variantId ? `${productId}_${variantId}` : productId || `wishlist-item-${index}`;
              
              return (
                <WishlistCard
                  key={key}
                  item={item}
                  onRemove={removeItem}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
