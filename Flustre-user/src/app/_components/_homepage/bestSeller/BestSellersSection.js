"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
// import useCart from "@/lib/hooks/useCart"; // Removed API integration
// Note: Using static products for the Best Sellers section

// Product Card Component
const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: product.category,
      plug: "Default",
    });
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden cursor-pointer shadow-none flex flex-col min-w-0 lg:min-h-[400px]"
      onClick={() => onProductClick(product.id)}
    >
      <div className="relative">
        {product.image?.includes("marketlube") ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-36 md:h-40 lg:h-56 xl:h-44 object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x180?text=Product+Image";
            }}
          />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={180}
            className="w-full h-36 md:h-40 lg:h-56 xl:h-44 object-cover transition-transform duration-300 group-hover:scale-110"
            priority={product.id <= 3}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x180?text=Product+Image";
            }}
          />
        )}

        {/* Badge for top 3 products */}
        {product.badge && (
          <div className="absolute top-1 md:top-2 left-[-16px]">
            <div className="relative">
              <Image
                src="/badge.svg"
                alt="Badge"
                width={64}
                height={40}
                className="w-12 h-8 md:w-16 md:h-10"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-xs font-bold">
                  {product.badge}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 px-1 flex-1 flex flex-col">
        <h3
          className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2 line-clamp-2"
          style={{ lineHeight: "1.1" }}
        >
          {product.name}
        </h3>
        <p
          className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 lg:mb-4"
          style={{ lineHeight: "1.1" }}
        >
          {product.category}
        </p>

        <div className="flex items-center gap-1 md:gap-2 lg:gap-3 mb-0 whitespace-nowrap">
          <span
            className="text-xs md:text-sm lg:text-base font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            <span className="align-baseline text-[9px] md:text-[10px] lg:text-xs" style={{ color: "#2B73B8" }}>
              ₹
            </span>
            <span className="ml-1">{product.price.toLocaleString()}</span>
          </span>
          <span className="relative inline-flex items-center text-gray-500">
            <span className="align-baseline text-[9px] md:text-[10px] lg:text-xs" style={{ color: "#2B73B8" }}>
              ₹
            </span>
            <span className="text-[10px] md:text-xs lg:text-sm ml-1">
              {product.originalPrice.toLocaleString()}
            </span>
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform h-px bg-gray-700"
            ></span>
          </span>
        </div>

        <div className="flex justify-start mt-8">
          <Button
            variant="cart"
            size="small"
            onClick={handleAddToCart}
            className="text-xs md:text-sm lg:text-base"
            style={{
              display: "flex",
              height: "32px",
              padding: "8px 12px",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function BestSellersSection() {
  const router = useRouter();
  const scrollerRef = useRef(null);
  const isPausedRef = useRef(false);
  // Static cart function - no API integration
  const addToCart = (item) => {
    console.log('Added to cart (static):', item);
    // You can add localStorage functionality here if needed
  };
  // Static furniture products using local bestseller images
  const products = useMemo(
    () => [
      {
        id: 1,
        name: "Modern Fabric Sofa",
        category: "Furniture",
        price: 899,
        originalPrice: 1199,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller1+(re).jpg",
        badge: "#1",
      },
      {
        id: 2,
        name: "Walnut Coffee Table",
        category: "Furniture",
        price: 329,
        originalPrice: 429,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller2(re).jpg",
        badge: "#2",
      },
      {
        id: 3,
        name: "Ergonomic Desk Chair",
        category: "Furniture",
        price: 299,
        originalPrice: 399,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller3+(re).jpg",
        badge: "#3",
      },
      {
        id: 4,
        name: "Solid Wood Sideboard",
        category: "Furniture",
        price: 749,
        originalPrice: 949,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller4(re).jpg",
      },
      {
        id: 5,
        name: "Minimalist Bookshelf",
        category: "Furniture",
        price: 259,
        originalPrice: 329,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller5+(re).jpg",
      },
      {
        id: 6,
        name: "Accent Lounge Chair",
        category: "Furniture",
        price: 389,
        originalPrice: 499,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller6+(re).jpg",
      },
      {
        id: 7,
        name: "Round Dining Table",
        category: "Furniture",
        price: 679,
        originalPrice: 849,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller7(re).jpg",
      },
      {
        id: 8,
        name: "Velvet Ottoman",
        category: "Furniture",
        price: 189,
        originalPrice: 249,
        image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/bestsellers/bestseller8+(re).jpg",
      },
    ],
    []
  );
  const isLoading = false;

  // Duplicate products for infinite scroll effect
  const duplicatedProducts = useMemo(() => {
    // Triple the array for seamless infinite scrolling
    return [...products, ...products, ...products];
  }, [products]);

  // Initialize scroll position to middle set for seamless infinite scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = scrollerRef.current;
    if (!el || products.length === 0) return;

    // Wait for layout to complete
    const timer = setTimeout(() => {
      const cardWidth = el.querySelector('.product-card')?.offsetWidth || 0;
      const gap = 16;
      // Start at the beginning of the second set (middle)
      const initialScroll = (cardWidth + gap) * products.length;
      el.scrollLeft = initialScroll;
    }, 100);

    return () => clearTimeout(timer);
  }, [products.length]);

  // Handle infinite scroll loop - seamlessly jump when reaching boundaries
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = scrollerRef.current;
    if (!el || products.length === 0) return;

    let scrollTimer;
    const handleScroll = () => {
      el.classList.add("scrolling");
      if (scrollTimer) clearTimeout(scrollTimer);
      
      scrollTimer = setTimeout(() => {
        el.classList.remove("scrolling");
        
        const cardWidth = el.querySelector('.product-card')?.offsetWidth || 0;
        const gap = 16;
        const oneSetWidth = (cardWidth + gap) * products.length;
        
        // If we've scrolled past the second set, jump back to the first set
        if (el.scrollLeft >= oneSetWidth * 2) {
          el.scrollLeft = el.scrollLeft - oneSetWidth;
        }
        // If we've scrolled before the first set, jump to the second set
        else if (el.scrollLeft < oneSetWidth * 0.5) {
          el.scrollLeft = el.scrollLeft + oneSetWidth;
        }
      }, 150);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [products.length]);

  // Auto-scroll with pause on hover/touch - continuous scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = scrollerRef.current;
    if (!el || products.length === 0) return;

    const intervalMs = 3500;
    let timerId = null;
    
    const scrollToNext = () => {
      if (!isPausedRef.current) {
        const cardWidth = el.querySelector('.product-card')?.offsetWidth || 0;
        const gap = 16; // gap-4 = 16px
        
        // Determine number of cards to scroll based on screen width
        const screenWidth = window.innerWidth;
        let cardsToScroll = 2; // default for mobile
        
        if (screenWidth >= 1280) { // xl and above
          cardsToScroll = 4;
        } else if (screenWidth >= 1024) { // lg
          cardsToScroll = 3;
        } else if (screenWidth >= 768) { // md
          cardsToScroll = 3;
        }
        
        const scrollAmount = (cardWidth + gap) * cardsToScroll;
        
        // Just scroll forward - the boundary detection will handle looping
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
    
    const start = () => {
      if (timerId) return;
      timerId = setInterval(scrollToNext, intervalMs);
    };
    
    const stop = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    // Start the auto-scroll
    start();

    const handleEnter = () => {
      isPausedRef.current = true;
    };
    
    const handleLeave = () => {
      isPausedRef.current = false;
    };

    // Pause on hover or touch
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchstart", handleEnter, { passive: true });
    el.addEventListener("touchend", handleLeave, { passive: true });

    return () => {
      stop();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchstart", handleEnter);
      el.removeEventListener("touchend", handleLeave);
    };
  }, [products.length]);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  const handleViewAll = () => {
    router.push("/products");
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 2xl:px-10 py-4 md:py-6 xl:pb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-800">
            Best Sellers
          </h2>

          <button
            className="flex items-center gap-2 font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            style={{ color: "var(--color-primary)" }}
            onClick={handleViewAll}
            aria-label="View all best sellers"
          >
            <span className="text-sm md:text-base">
              View all
            </span>
            <span
              className="inline-flex"
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label="View all best sellers"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAll();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleViewAll();
                }
              }}
            >
              <Image
                src="/nextarrow.svg"
                alt="Next arrow"
                width={28}
                height={28}
                className="w-5 h-5 md:w-7 md:h-7"
              />
            </span>
          </button>
        </div>

        {/* Products Display - horizontal scroll on all screen sizes */}
        <div
          id="best-sellers-scroller"
          ref={scrollerRef}
          className="overflow-x-auto pb-2 md:pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {isLoading && (
            <div className="py-6 text-sm text-gray-600">Loading...</div>
          )}
          {!isLoading && products.length === 0 && (
            <div className="py-6 text-sm text-gray-600">No products found.</div>
          )}

          {!isLoading && (
            <div className="flex gap-4 md:gap-5">
              {duplicatedProducts.map((product, idx) => (
                <div 
                  key={`${product.id}-${idx}`} 
                  className="product-card flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(33.333%-13.33px)] lg:w-[calc(25%-12px)] xl:w-[calc(25%-12px)] 2xl:w-[calc(25%-12px)]"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={(p) => addToCart(p, undefined, 1)}
                    onProductClick={handleProductClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hide scrollbar for the scroller (scoped) */}
        <style jsx>{`
          #best-sellers-scroller { -ms-overflow-style: none; scrollbar-width: none; }
          #best-sellers-scroller::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Separator */}
        <div className="border-b border-gray-200 w-full mt-6" />
      </div>
    </section>
  );
}
