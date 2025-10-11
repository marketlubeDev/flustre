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
  const rafRef = useRef(null);
  const pageIndexRef = useRef(0);
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
        image: "/bestseller/bestseller1.jpg",
        badge: "#1",
      },
      {
        id: 2,
        name: "Walnut Coffee Table",
        category: "Furniture",
        price: 329,
        originalPrice: 429,
        image: "/bestseller/bestseller2.jpg",
        badge: "#2",
      },
      {
        id: 3,
        name: "Ergonomic Desk Chair",
        category: "Furniture",
        price: 299,
        originalPrice: 399,
        image: "/bestseller/bestseller3.jpg",
        badge: "#3",
      },
      {
        id: 4,
        name: "Solid Wood Sideboard",
        category: "Furniture",
        price: 749,
        originalPrice: 949,
        image: "/bestseller/bestseller4.jpg",
      },
      {
        id: 5,
        name: "Minimalist Bookshelf",
        category: "Furniture",
        price: 259,
        originalPrice: 329,
        image: "/bestseller/bestseller5.jpg",
      },
      {
        id: 6,
        name: "Accent Lounge Chair",
        category: "Furniture",
        price: 389,
        originalPrice: 499,
        image: "/bestseller/bestseller6.jpg",
      },
      {
        id: 7,
        name: "Round Dining Table",
        category: "Furniture",
        price: 679,
        originalPrice: 849,
        image: "/bestseller/bestseller7.jpg",
      },
      {
        id: 8,
        name: "Velvet Ottoman",
        category: "Furniture",
        price: 189,
        originalPrice: 249,
        image: "/bestseller/bestseller8.jpg",
      },
    ],
    []
  );
  const isLoading = false;

  // Group products into pages of 4 and add duplicates for infinite scroll
  const productPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < products.length; i += 4) {
      pages.push(products.slice(i, i + 4));
    }
    
    // For infinite scroll: duplicate first page at end and last page at start
    if (pages.length > 1) {
      return [pages[pages.length - 1], ...pages, pages[0]];
    }
    return pages;
  }, [products]);
  
  // Actual number of real pages (excluding duplicates)
  const realPageCount = useMemo(() => {
    return Math.ceil(products.length / 4);
  }, [products.length]);

  // Scroll behavior effect (simplified and optimized)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = scrollerRef.current;
    if (!el) return;

    let timerId;
    const handleScroll = () => {
      el.classList.add("scrolling");
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        el.classList.remove("scrolling");
      }, 700);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // Auto-scroll pages of 4 with infinite cyclic loop and pause on hover/touch
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = scrollerRef.current;
    if (!el || productPages.length === 0 || realPageCount <= 1) return;

    // Start at page 1 (first real page, since page 0 is the duplicate last page)
    if (pageIndexRef.current === 0) {
      pageIndexRef.current = 1;
      el.scrollTo({ left: el.clientWidth, behavior: "auto" });
    }

    const goToPage = (pageIndex, smooth = true) => {
      pageIndexRef.current = pageIndex;
      const targetLeft = pageIndex * el.clientWidth;
      el.scrollTo({ left: targetLeft, behavior: smooth ? "smooth" : "auto" });
    };

    const handleTransitionEnd = () => {
      // If we're at the duplicate last page (index 0), jump to real last page
      if (pageIndexRef.current === 0) {
        goToPage(realPageCount, false);
      }
      // If we're at the duplicate first page (last index), jump to real first page
      else if (pageIndexRef.current === productPages.length - 1) {
        goToPage(1, false);
      }
    };

    const intervalMs = 3500;
    let timerId = null;
    
    const start = () => {
      if (timerId) return;
      timerId = setInterval(() => {
        if (!isPausedRef.current) {
          // Always move forward, will handle wrap-around via handleTransitionEnd
          goToPage(pageIndexRef.current + 1, true);
          // Check after animation completes
          setTimeout(handleTransitionEnd, 600);
        }
      }, intervalMs);
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
    
    const handleResize = () => {
      // Realign to current page on resize
      const current = pageIndexRef.current;
      el.scrollTo({ left: current * el.clientWidth, behavior: "auto" });
    };

    // Pause on hover or touch
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchstart", handleEnter, { passive: true });
    el.addEventListener("touchend", handleLeave, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      stop();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchstart", handleEnter);
      el.removeEventListener("touchend", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [productPages.length, realPageCount]);

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

        {/* Products Grid - pages of 4 with snap */}
        <div
          id="best-sellers-scroller"
          ref={scrollerRef}
          className="flex overflow-x-auto pb-2 md:pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {isLoading && (
            <div className="py-6 text-sm text-gray-600">Loading...</div>
          )}
          {!isLoading && products.length === 0 && (
            <div className="py-6 text-sm text-gray-600">No products found.</div>
          )}

          {!isLoading && productPages.map((page, pageIdx) => (
            <div key={`page-${pageIdx}`} className="min-w-full snap-start px-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {page.map((product, idx) => (
                  <ProductCard
                    key={`${pageIdx}-${product.id || idx}`}
                    product={product}
                    onAddToCart={(p) => addToCart(p, undefined, 1)}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </div>
          ))}
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
