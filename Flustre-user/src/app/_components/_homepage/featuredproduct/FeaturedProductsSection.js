"use client";
import FeaturedProductCard from "./FeaturedProductCard";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useProductsByLabelName from "@/lib/hooks/useProductsByLabelName";

export default function FeaturedProductsSection({ isProductPage = false }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);

  // Fetch products labeled "Finest Furniture" and show only two
  const { products, loading } = useProductsByLabelName("Finest Furniture", {
    page: 1,
    limit: 24,
  });
  const productsForDisplay = (products || []).slice(0, 2);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextSlide = useCallback(() => {
    if (!productsForDisplay.length) return;
    setCurrentSlide((prev) => (prev + 1) % productsForDisplay.length);
  }, [productsForDisplay.length]);

  const prevSlide = useCallback(() => {
    if (!productsForDisplay.length) return;
    setCurrentSlide(
      (prev) =>
        (prev - 1 + productsForDisplay.length) % productsForDisplay.length
    );
  }, [productsForDisplay.length]);

  const clearAutoSlide = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    clearAutoSlide();
    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  }, [nextSlide, clearAutoSlide]);

  // Touch/Mouse handlers
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    clearAutoSlide();
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);

    // Restart auto-slide after interaction
    setTimeout(startAutoSlide, 1000);
  };

  // Touch events
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  // Mouse events for better desktop experience
  const handleMouseDown = (e) => handleStart(e.clientX);
  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  // Auto-slide functionality
  useEffect(() => {
    if (!isClient || !productsForDisplay.length) return;

    startAutoSlide();

    return () => clearAutoSlide();
  }, [isClient, productsForDisplay.length, startAutoSlide, clearAutoSlide]);

  // Scroll to current slide
  useEffect(() => {
    if (!containerRef.current || !isClient || !productsForDisplay.length)
      return;

    const container = containerRef.current;
    const cardWidth = container.offsetWidth;
    container.scrollLeft = cardWidth * currentSlide;
  }, [currentSlide, isClient, productsForDisplay.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    clearAutoSlide();
    setTimeout(startAutoSlide, 2000);
  };

  if (!isClient) {
    // Server-side render fallback
    return (
      <div
        className={
          isProductPage
            ? "py-6 md:py-8 lg:py-10 overflow-hidden container mx-auto px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 2xl:px-0"
            : "py-6 md:py-8 lg:py-10 overflow-hidden container mx-auto px-4 sm:px-0 md:px-8 lg:px-10 xl:px-10 2xl:px-10"
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-2 items-center justify-between w-full">
            <h2 className="text-[20px] sm:text-[22px] md:text-[24px] xl:text-[28px] font-bold text-[#333333]">
              Finest Furniture
            </h2>
          </div>
          <div className="hidden md:flex flex-row gap-6 w-full">
            {productsForDisplay.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isProductPage
          ? "py-6 md:py-8 lg:py-10 overflow-hidden container mx-auto px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 2xl:px-0"
          : "py-6 md:py-8 lg:py-10 overflow-hidden container mx-auto px-4 sm:px-0 md:px-8 lg:px-10 xl:px-10 2xl:px-10"
      }
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <h2
            className="text-[20px] sm:text-[22px] md:text-[24px] xl:text-[28px] font-bold"
            style={{
              color: "#333333",
              letterSpacing: "-0.22px",
            }}
          >
            Finest Furniture
          </h2>
          <button
            className="flex items-center gap-2 font-medium transition-colors cursor-pointer hover:opacity-80"
            style={{ color: "var(--color-primary)" }}
            onClick={() => router.push("/products")}
          >
            <span className="text-sm sm:text-base">View All</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                router.push("/products");
              }}
              className="inline-flex"
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label="View all products"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/products");
                }
              }}
            >
              <Image
                src="/nextarrow.svg"
                alt="Next arrow"
                width={28}
                height={28}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </span>
          </button>
        </div>

        {/* Unified Responsive Carousel */}
        <div className="w-full relative">
          {/* Mobile & Tablet: Carousel */}
          <div className="md:hidden">
            <div
              ref={containerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollBehavior: "smooth" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={isDragging ? handleMouseMove : undefined}
              onMouseUp={isDragging ? handleMouseUp : undefined}
              onMouseLeave={isDragging ? handleMouseUp : undefined}
            >
              {!loading &&
                productsForDisplay.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-full snap-start"
                  >
                    <FeaturedProductCard product={product} />
                  </div>
                ))}
            </div>

            {/* Navigation Arrows - Only for tablets */}
            <button
              onClick={prevSlide}
              className="hidden sm:flex md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous product"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="hidden sm:flex md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Next product"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:flex flex-row gap-6 w-full">
            {!loading &&
              productsForDisplay.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="md:hidden">
          {/* Mobile: Progress Bar */}
          <div className="sm:hidden flex justify-center">
            <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-1 bg-[var(--color-primary)] rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (currentSlide + 1) * (100 / productsForDisplay.length)
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Tablet: Dots */}
          <div className="hidden sm:flex md:hidden justify-center gap-3">
            {productsForDisplay.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-[var(--color-primary)]"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-black/10 w-full mt-6" />
    </div>
  );
}
