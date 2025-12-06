"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { Modal, Rate, Input, Button } from "antd";
import ProductServiceBenefits from "./_components/ProductServiceBenefits";
import ProductImageSection from "./_components/ProductImageSection";
import ProductFeaturesText from "./_components/ProductFeaturesText";
import FeaturedProductsSection from "../../_components/_homepage/featuredproduct/FeaturedProductsSection";
import BestSellersSection from "../../_components/_homepage/bestSeller/BestSellersSection";
import ReviewsSection from "./_components/ReviewsSection";
import CategoryFeaturesSection from "./_components/CategoryFeaturesSection";
import ProductImagesSection from "./_components/ProductImagesSection";
import ProductInfoSection from "./_components/ProductInfoSection";
import DynamicFeaturesSection from "./_components/DynamicFeaturesSection";
import CartSidebar from "../../_components/cart/CartSidebar";
import useProductDetails from "@/lib/hooks/useProductDetails";
import { useCoupons } from "@/lib/hooks/useCoupons";
import useCart from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const [mounted, setMounted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMoreCoupons, setShowMoreCoupons] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Wishlist hook
  const { toggleItem: toggleWishlistItem, isInWishlist } = useWishlist();

  // Fetch product details from API
  const { product: apiProduct, loading, error } = useProductDetails(productId);

  // Fetch all coupons from API
  const { data: allCoupons = [], isLoading: couponsLoading } = useCoupons();
  // Build a product object compatible with existing UI components
  const firstVariant =
    Array.isArray(apiProduct?.variants) && apiProduct.variants.length > 0
      ? apiProduct.variants[0]
      : null;

  // Helper to safely extract displayable text from possibly-object values
  const extractText = (value) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        value.value ||
        value.text ||
        ""
      );
    }
    return "";
  };

  // Normalize API response into displayable fields
  const mappedFromApi = apiProduct
    ? {
        id: apiProduct.id || apiProduct._id || productId,
        name: apiProduct.name,
        price: firstVariant?.price ?? apiProduct.price ?? 0,
        originalPrice:
          firstVariant?.compareAtPrice ??
          apiProduct.compareAtPrice ??
          firstVariant?.price ??
          apiProduct.price ??
          0,
        description: extractText(apiProduct.description),
        images: Array.isArray(firstVariant?.images)
          ? firstVariant.images
          : Array.isArray(apiProduct.featureImages)
          ? apiProduct.featureImages
          : [],
        featureImages: Array.isArray(apiProduct.featureImages)
          ? apiProduct.featureImages
          : Array.isArray(firstVariant?.images)
          ? firstVariant.images
          : [],
        primaryImage:
          (apiProduct.primaryImage && String(apiProduct.primaryImage)) ||
          (Array.isArray(apiProduct.featureImages) &&
            apiProduct.featureImages[0]) ||
          (Array.isArray(firstVariant?.images) && firstVariant.images[0]) ||
          "/placeholder.png",
        category: extractText(apiProduct.category),
        label: extractText(apiProduct.label),
        specifications: apiProduct.specifications || {},
        featuresSections: apiProduct.featuresSections || [],
        variants: Array.isArray(apiProduct.variants) ? apiProduct.variants : [],
        ratingStats: {
          average: apiProduct.averageRating || 0,
          total: apiProduct.totalRatings || 0,
          distribution: apiProduct.ratingDistribution || {},
        },
        returnPolicyDays: apiProduct.returnPolicyDays,
        returnPolicyText: apiProduct.returnPolicyText,
        profit: apiProduct.profit,
        costPerItem: apiProduct.costPerItem,
        options: apiProduct.options || [],
        // Preserve category and subcategory IDs for coupon filtering
        categoryId:
          apiProduct.categoryObject?._id ||
          apiProduct.categoryObject?.id ||
          null,
        subcategoryId:
          apiProduct.subcategoryObject?._id ||
          apiProduct.subcategoryObject?.id ||
          null,
      }
    : null;

  const product = mappedFromApi;
  const { addToCart: addToCartHook } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    const token =
      window.localStorage?.getItem("token") ||
      window.localStorage?.getItem("userToken");
    return !!token;
  };

  // Wishlist handler that works with product object
  const handleToggleWishlist = (product) => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    const prodId = product?.id || product?._id || params.id;
    const variantId = product?.variants?.[selectedVariant]?._id || 
                     product?.variants?.[selectedVariant]?.id || 
                     null;
    toggleWishlistItem(prodId, variantId);
  };

  // Check if product is in wishlist
  const checkIsInWishlist = (id) => {
    const prodId = id || product?.id || product?._id || params.id;
    const variantId = product?.variants?.[selectedVariant]?._id || 
                     product?.variants?.[selectedVariant]?.id || 
                     null;
    return isInWishlist(prodId, variantId);
  };

  // Filter coupons based on applyTo type and product eligibility
  const coupons = useMemo(() => {
    // Only filter after component is mounted to avoid hydration mismatch
    if (
      !mounted ||
      !product ||
      !Array.isArray(allCoupons) ||
      allCoupons.length === 0
    ) {
      return [];
    }

    // Get current product price (considering variant and quantity)
    const currentPrice =
      product?.variants &&
      product.variants.length > 0 &&
      selectedVariant !== undefined
        ? product.variants[selectedVariant]?.price || product.price || 0
        : product.price || 0;
    const totalPrice = currentPrice * quantity;

    // Get product IDs for comparison
    const productIdStr = String(product.id || productId);
    const categoryIdStr = product.categoryId
      ? String(product.categoryId)
      : null;
    const subcategoryIdStr = product.subcategoryId
      ? String(product.subcategoryId)
      : null;

    return allCoupons
      .filter((coupon) => {
        if (!coupon || !coupon.isActive) return false;

        // Check expiry date (only after mount to avoid hydration mismatch)
        const expiryDate = new Date(coupon.expiryDate);
        if (expiryDate.getTime() <= Date.now()) return false;

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
          return false;

        // Filter based on applyTo type
        switch (coupon.applyTo) {
          case "product":
            // Check if product ID is in the coupon's productIds array
            if (
              Array.isArray(coupon.productIds) &&
              coupon.productIds.length > 0
            ) {
              return coupon.productIds.some(
                (pid) => String(pid) === productIdStr
              );
            }
            return false;

          case "category":
            // Check if product's category matches coupon's categoryId
            if (categoryIdStr && coupon.categoryId) {
              return String(coupon.categoryId) === categoryIdStr;
            }
            return false;

          case "subcategory":
            // Check if product's subcategory matches coupon's categoryId
            // Note: For subcategory type, coupon uses categoryId field
            if (subcategoryIdStr && coupon.categoryId) {
              return String(coupon.categoryId) === subcategoryIdStr;
            }
            return false;

          case "above price":
            // Check if total price (price * quantity) is above minPurchase
            if (
              coupon.minPurchase !== undefined &&
              coupon.minPurchase !== null
            ) {
              return totalPrice >= coupon.minPurchase;
            }
            return false;

          default:
            return false;
        }
      })
      .map((coupon) => ({
        code: coupon.code,
        description: coupon.description || "",
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        applyTo: coupon.applyTo,
        _id: coupon._id,
      }));
  }, [mounted, product, allCoupons, selectedVariant, quantity, productId]);
  const visibleCoupons = coupons.slice(0, 2);
  const remainingCouponsCount = Math.max(
    coupons.length - visibleCoupons.length,
    0
  );
  const remainingCoupons = coupons.slice(2);

  const addToCart = async () => {
    if (!mounted || !product) return; // Don't allow cart operations during SSR

    setCartLoading(true);
    try {
      // Get the selected variant if available
      const selectedVariantData =
        product?.variants && product.variants.length > 0
          ? product.variants[selectedVariant]
          : null;

      const variantId = selectedVariantData?._id;

      // Delegate to shared cart hook – this will:
      // - For logged-in users: call /cart/add-to-cart on the backend
      // - For guests: manage cart in localStorage with availability checks
      await addToCartHook(product, variantId, quantity);

      // Open cart sidebar on this page as well
      setIsCartOpen(true);
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const buyNow = () => {
    if (!mounted) return; // Don't allow buy now operations during SSR

    // Check authentication first
    const isAuthenticated = () => {
      if (typeof window === "undefined") return false;
      const token =
        window.localStorage?.getItem("token") ||
        window.localStorage?.getItem("userToken");
      return !!token;
    };

    if (!isAuthenticated()) {
      // Store the intended checkout URL for redirect after login
      if (typeof window !== "undefined") {
        window.localStorage.setItem("intendedCheckoutUrl", "/checkout");
        window.localStorage.setItem("intendedProductId", productId);
      }
      router.push("/login");
      return;
    }

    // Get the selected variant if available
    const variant = product?.variants?.[selectedVariant];
    const variantOptions = variant?.options || variant?.attributes || {};

    try {
      // Ensure product and variant data are available
      if (!product) {
        console.error("Product data not available");
        alert("Product information is not loaded. Please try again.");
        return;
      }

      // Create checkout item with proper format
      // Use the normalized product ID (id from mappedFromApi)
      const itemProductId = product?.id || product?._id || productId;

      // Get variant ID - check both the normalized structure and raw API structure
      const rawVariant = apiProduct?.variants?.[selectedVariant];
      const itemVariantId =
        variant?._id ||
        rawVariant?._id ||
        variant?.id ||
        rawVariant?.id ||
        null;

      // Create ID for cart item (productId_variantId or just productId)
      const itemId = itemVariantId
        ? `${itemProductId}_${itemVariantId}`
        : itemProductId;

      // Get price - prefer variant price, then product price
      const itemPrice =
        rawVariant?.price || variant?.price || product?.price || 0;

      // Get original price - prefer variant compareAtPrice, then product originalPrice
      const itemOriginalPrice =
        rawVariant?.compareAtPrice ||
        variant?.compareAtPrice ||
        product?.originalPrice ||
        itemPrice ||
        0;

      // Get image - try multiple sources
      const itemImage =
        variant?.images?.[0] ||
        rawVariant?.images?.[0] ||
        product?.primaryImage ||
        product?.images?.[0] ||
        (product?.featureImages && product?.featureImages[0]) ||
        "/banner1.png";

      const checkoutItems = [
        {
          id: itemId,
          productId: itemProductId,
          variantId: itemVariantId,
          name: product?.name || "Product",
          variantOptions: variantOptions,
          price: itemPrice,
          originalPrice: itemOriginalPrice,
          image: itemImage,
          quantity: quantity || 1,
        },
      ];



      if (typeof window !== "undefined") {
        localStorage.setItem("checkout_items", JSON.stringify(checkoutItems));
       
        setTimeout(() => {
          window.location.href = "/checkout";
        }, 100);
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Error preparing checkout:", err);
      alert("Failed to proceed to checkout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Failed to load product.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images - Sticky */}
          <div className="product-images-sticky">
            <ProductImagesSection
              product={product}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              selectedVariant={selectedVariant}
              toggleWishlistItem={handleToggleWishlist}
              isInWishlist={checkIsInWishlist}
            />
          </div>
          {/* Product Info */}
          <ProductInfoSection
            product={product}
            coupons={coupons}
            visibleCoupons={visibleCoupons}
            remainingCouponsCount={remainingCouponsCount}
            showMoreCoupons={showMoreCoupons}
            setShowMoreCoupons={setShowMoreCoupons}
            remainingCoupons={remainingCoupons}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            addToCart={addToCart}
            buyNow={buyNow}
            cartLoading={cartLoading}
            showMoreDetails={showMoreDetails}
            setShowMoreDetails={setShowMoreDetails}
          />
        </div>
        <DynamicFeaturesSection product={product} />
        <FeaturedProductsSection isProductPage={true} />
        <ReviewsSection product={product} selectedImage={selectedImage} />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Login Modal for Wishlist */}
      <Modal
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        footer={null}
        centered
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Login Required</h3>
          <p className="text-gray-600 mb-6">
            Please login to add products to your wishlist.
          </p>
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowLoginModal(false);
                router.push("/login");
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
