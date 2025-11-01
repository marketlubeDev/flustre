"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { Modal, Rate, Input, Button } from "antd";
import ProductServiceBenefits from "./_components/ProductServiceBenefits";
import ProductImageSection from "./_components/ProductImageSection";
import ProductFeaturesText from "./_components/ProductFeaturesText";
import FeaturedProductsSection from "../../_components/_homepage/featuredproduct/FeaturedProductsSection";
import BestSellersSection from "../../_components/_homepage/bestSeller/BestSellersSection";
import RecommendedSection from "./_components/RecommendedSection";
import ReviewsSection from "./_components/ReviewsSection";
import CategoryFeaturesSection from "./_components/CategoryFeaturesSection";
import ProductImagesSection from "./_components/ProductImagesSection";
import ProductInfoSection from "./_components/ProductInfoSection";
import DynamicFeaturesSection from "./_components/DynamicFeaturesSection";
import CartSidebar from "../../_components/cart/CartSidebar";
import useProductDetails from "@/lib/hooks/useProductDetails";
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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch product details from API
  const { product: apiProduct, loading, error } = useProductDetails(productId);
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
      }
    : null;

  const product = mappedFromApi;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  // Static wishlist functions
  const toggleWishlistItem = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id);
    if (isInWishlist) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setWishlistItems((prev) => [...prev, product]);
    }
  };

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };
  const coupons = [
    {
      code: "FLAT20",
      description: "Get 20% discount on products above Rs 1,999",
    },
    {
      code: "SAVE100",
      description: "Flat Rs 100 OFF on orders above Rs 999",
    },
    {
      code: "GET250",
      description: "Rs 250 OFF when you spend Rs 2,499 or more",
    },
  ];
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the selected variant if available
      const selectedVariantData =
        product?.variants && product.variants.length > 0
          ? product.variants[selectedVariant]
          : null;

      const variantId = selectedVariantData?._id;

      // Use variant-specific price and image if available
      const price = selectedVariantData?.price || product.price;
      const originalPrice =
        selectedVariantData?.compareAtPrice || product.originalPrice;
      const image =
        (selectedVariantData?.images && selectedVariantData.images[0]) ||
        product.primaryImage ||
        product.featureImages[0];

      // Get variant options (attributes)
      // Handle both options and attributes fields
      let variantOptions =
        selectedVariantData?.options || selectedVariantData?.attributes || {};

      // HOTFIX: If variant doesn't have options but product has options config, infer from position
      if (
        (!variantOptions || Object.keys(variantOptions).length === 0) &&
        product?.options &&
        selectedVariant >= 0
      ) {
        const inferredOptions = {};
        product.options.forEach((opt) => {
          if (opt.values && opt.values[selectedVariant]) {
            inferredOptions[opt.name] = opt.values[selectedVariant];
          }
        });
        variantOptions = inferredOptions;
      }

      // Add to localStorage cart
      const cartItem = {
        id: variantId ? `${product.id}_${variantId}` : product.id,
        productId: product.id,
        variantId,
        name: product.name,
        image,
        price,
        originalPrice,
        quantity: quantity,
        category: product.category,
        variantOptions: variantOptions, // Store variant options/attributes
      };

      // Get existing cart items
      const existingCart =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("cartItems") || "[]")
          : [];

      // Check if item already exists
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === cartItem.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.push(cartItem);
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        // Dispatch cart update event
        window.dispatchEvent(new Event("cart-updated"));
      }

      console.log("Added to cart:", cartItem);

      // Open cart sidebar
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
      const itemVariantId = variant?._id || rawVariant?._id || variant?.id || rawVariant?.id || null;

      // Create ID for cart item (productId_variantId or just productId)
      const itemId = itemVariantId ? `${itemProductId}_${itemVariantId}` : itemProductId;

      // Get price - prefer variant price, then product price
      const itemPrice =
        rawVariant?.price ||
        variant?.price ||
        product?.price ||
        0;

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

      // Debug log
      console.log("Buy Now - Checkout items:", checkoutItems);

      if (typeof window !== "undefined") {
        // Store checkout items in localStorage
        localStorage.setItem("checkout_items", JSON.stringify(checkoutItems));

        // Verify it was stored
        const stored = localStorage.getItem("checkout_items");
        console.log("Buy Now - Stored in localStorage:", stored);

        // Parse to verify it's valid JSON
        try {
          const parsed = JSON.parse(stored);
          console.log("Buy Now - Parsed checkout items:", parsed);
        } catch (e) {
          console.error("Buy Now - Failed to parse stored items:", e);
        }

        // Use window.location.href to ensure full page navigation
        // This ensures localStorage is fully written before page loads
        setTimeout(() => {
          window.location.href = "/checkout";
        }, 100);
      } else {
        // Fallback to router.push if window is not available
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
              toggleWishlistItem={toggleWishlistItem}
              isInWishlist={isInWishlist}
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
        <RecommendedSection />
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
