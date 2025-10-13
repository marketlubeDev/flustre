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
import ProductVideoSection from "./_components/ProductVideoSection";
import ProductFeaturesSection from "./_components/ProductFeaturesSection";
import ProductFeaturesBanner from "./_components/ProductFeaturesBanner";
import ProductImagesSection from "./_components/ProductImagesSection";
import ProductInfoSection from "./_components/ProductInfoSection";
import ProductFeaturesSection2 from "./_components/ProductFeaturesSection2";
import ProductFeaturesSection3 from "./_components/ProductFeaturesSection3";
import CartSidebar from "../../_components/cart/CartSidebar";
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

  // Static mock product data
  const product = {
    id: productId || "1",
    name: "Premium Organic Face Serum",
    price: 299,
    originalPrice: 399,
    description: "A luxurious organic face serum enriched with vitamin C and hyaluronic acid. This premium formula helps reduce fine lines, brightens skin tone, and provides deep hydration for a radiant complexion.",
    images: [
      "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/product/product1+(1).jpg",
      "/products/product2.jpg", 
      "/products/product3.jpg",
      "/products/product4.jpg"
    ],
    featureImages: [
      "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/product/product1+(1).jpg",
      "/products/product2.jpg", 
      "/products/product3.jpg",
      "/products/product4.jpg"
    ],
    primaryImage: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/product/product1+(1).jpg",
    category: "Skincare",
    label: "Premium",
    specifications: {
      Volume: "30ml",
      SkinType: "All Skin Types",
      Ingredients: "Vitamin C, Hyaluronic Acid, Organic Extracts",
      Formulation: "Serum",
      Packaging: "Glass Bottle with Dropper"
    },
    featuresSections: [
      {
        title: "Key Benefits",
        features: [
          "Reduces fine lines and wrinkles",
          "Brightens and evens skin tone", 
          "Provides deep hydration",
          "Improves skin texture",
          "Antioxidant protection"
        ]
      },
      {
        title: "How to Use",
        features: [
          "Apply 2-3 drops to clean face",
          "Gently massage in upward motions",
          "Use morning and evening",
          "Follow with moisturizer",
          "Use sunscreen during day"
        ]
      }
    ],
    variants: [
      {
        _id: "variant1",
        name: "30ml",
        price: 299,
        compareAtPrice: 399,
        images: ["https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/product/product1+(1).jpg"]
      },
      {
        _id: "variant2", 
        name: "50ml",
        price: 449,
        compareAtPrice: 599,
        images: ["/products/product2.jpg"]
      }
    ],
    ratingStats: {
      average: 4.5,
      total: 128,
      distribution: {
        5: 45,
        4: 38,
        3: 25,
        2: 12,
        1: 8
      }
    },
    returnPolicyDays: 30,
    returnPolicyText: "30-day return policy for unopened products",
    profit: 150,
    costPerItem: 149
  };

  const loading = false;
  const error = null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  // Volume options
  const defaultVolumes = ["30ml", "50ml", "100ml"];
  const initialVolume = product?.specifications?.Volume || defaultVolumes[0];
  const volumes = Array.from(new Set([initialVolume, ...defaultVolumes]));
  const [selectedVolume, setSelectedVolume] = useState(initialVolume);

  // Static wishlist functions
  const toggleWishlistItem = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, product]);
    }
  };

  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the selected variant ID if available
      const variantId =
        product?.variants && product.variants.length > 0
          ? product.variants[selectedVariant]?._id
          : null;

      // Add to localStorage cart
      const cartItem = {
        id: variantId ? `${product.id}_${variantId}` : product.id,
        productId: product.id,
        variantId,
        name: product.name,
        image: product.primaryImage || product.featureImages[0],
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: quantity,
        category: product.category
      };

      // Get existing cart items
      const existingCart = typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem("cartItems") || "[]") 
        : [];
      
      // Check if item already exists
      const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
      
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

    // Static authentication check - always redirect to checkout for demo
    try {
      const checkoutItems = [
        {
          id: product?.id,
          name: product?.name,
          color: product?.category,
          plug: selectedVolume || "Default",
          price: product?.price,
          originalPrice: product?.originalPrice,
          image:
            product?.primaryImage ||
            (product?.featureImages && product?.featureImages[0]) ||
            "/banner1.png",
          quantity,
        },
      ];
      if (typeof window !== "undefined") {
        localStorage.setItem("checkout_items", JSON.stringify(checkoutItems));
      }
      alert("Redirecting to checkout...");
      // router.push("/checkout"); // Uncomment if you have a checkout page
    } catch (err) {
      console.error("Error preparing checkout:", err);
    }
  };

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
            volumes={volumes}
            selectedVolume={selectedVolume}
            setSelectedVolume={setSelectedVolume}
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
        <ProductFeaturesBanner product={product} />
        <ProductFeaturesSection product={product} />
        <ProductFeaturesSection2 product={product} />
        <ProductVideoSection product={product} />
        {/* <ProductFeaturesSection3 productType={product?.type} /> */}
        <FeaturedProductsSection isProductPage={true} />
        <ReviewsSection product={product} selectedImage={selectedImage} />
        <RecommendedSection />
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
