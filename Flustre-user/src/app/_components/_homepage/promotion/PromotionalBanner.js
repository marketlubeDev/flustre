"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/app/_components/common/Button";

import useBanner from "@/lib/hooks/useBanner";

export default function PromotionalBanner({ fullWidth = false }) {
  const router = useRouter();
  const isRTL = false;
  const [currentBanner, setCurrentBanner] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bannerRef = useRef(null);

  // Load banners filtered by bannerFor === "product"
  const { banners: fetchedBanners, loading: isLoading } = useBanner({
    bannerFor: "product",
  });

  // Generate gradient colors based on index
  function getGradientColor(index, isSecondary = false) {
    const gradients = [
      ["#FFE5F1", "#FFF0F5"],
      ["#FFF8DC", "#FFF5E6"],
      ["#E6F3FF", "#F0F8FF"],
      ["#F0FFF0", "#F5FFF5"],
      ["#FFF0F5", "#FFF5F5"],
    ];
    const gradient = gradients[index % gradients.length];
    return isSecondary ? gradient[1] : gradient[0];
  }

  // Normalize fetched data to component structure
  const banners = (fetchedBanners || []).map((banner, index) => ({
    id: banner.id,
    productId: banner.productLink || undefined,
    title: banner.title,
    description: banner.description || "",
    image: banner.image,
    mobileImage: banner.mobileImage,
    alt: banner.title,
    background: `linear-gradient(90deg, ${getGradientColor(
      index
    )}, ${getGradientColor(index, true)})`,
    buttonText: "Shop Now",
    productLink: banner.productLink,
  }));

  const handleShopNowClick = (banner) => {
    if (banner.productLink) {
      // If it's a full URL, open in new tab
      if (banner.productLink.startsWith("http")) {
        window.open(banner.productLink, "_blank");
      } else {
        // If it's a relative path, navigate to it
        router.push(banner.productLink);
      }
    } else {
      // Navigate to product page if productId is available
      if (banner.productId) {
        router.push(`/products/${banner.productId}`);
      }
    }
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentBanner < banners.length - 2) {
      nextBanner();
    }
    if (isRightSwipe && currentBanner > 0) {
      prevBanner();
    }
  };

  // Navigation functions for dual banner display
  const nextBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const maxIndex = Math.max(0, banners.length - 2);
    setCurrentBanner((prev) => Math.min(prev + 2, maxIndex));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevBanner = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentBanner((prev) => Math.max(prev - 2, 0));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToBanner = (index) => {
    if (isTransitioning || index === currentBanner) return;
    setIsTransitioning(true);
    setCurrentBanner(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Calculate visible banners for dual display
  const getVisibleBanners = () => {
    const visibleBanners = [];
    for (
      let i = currentBanner;
      i < Math.min(currentBanner + 2, banners.length);
      i++
    ) {
      visibleBanners.push(banners[i]);
    }
    return visibleBanners;
  };

  // Calculate total pages for dots indicator
  const totalPages = Math.ceil(banners.length / 2);
  const currentPage = Math.floor(currentBanner / 2);

  // Auto-rotate banners every 5 seconds for mobile/tablet only (when more than 2 banners)
  useEffect(() => {
    if (banners.length <= 2) return; // Don't auto-rotate if 2 or fewer banners

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const containerClasses = fullWidth
    ? "px-0 sm:px-0 md:px-0 lg:px-0 2xl:px-0"
    : "px-4 sm:px-10 md:px-8 lg:px-10 2xl:px-10";

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`${containerClasses} container mx-auto pt-4 pb-0 md:py-8 lg:py-10`}
      >
        <div className="flex items-center justify-center h-[200px] md:h-[250px] lg:h-[240px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Don't render if no banners available
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div
      className={`${containerClasses} container mx-auto pt-4 pb-0 md:py-8 lg:py-10 overflow-hidden`}
    >
      {/* Mobile to Large screens: Auto-rotating single banner */}
      <div className="xl:hidden">
        <div
          className="relative overflow-hidden rounded-lg md:p-4 h-[200px] md:h-[250px] lg:h-[240px]"
          style={{ background: banners[currentBanner].background }}
        >
          {/* Product Image - Positioned based on language direction */}
          <div
            className={`absolute ${
              isRTL
                ? "left-3 sm:left-4 md:left-6 lg:left-4"
                : "right-3 sm:right-4 md:right-6 lg:right-4"
            } top-1/2 transform -translate-y-1/2`}
          >
            <Image
              src={banners[currentBanner].image}
              alt={banners[currentBanner].alt}
              width={224}
              height={224}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain"
            />
          </div>

          {/* Content - Positioned based on language direction */}
          <div
            className={`absolute ${
              isRTL
                ? "right-4 sm:right-6 md:right-8 lg:right-6"
                : "left-4 sm:left-6 md:left-8 lg:left-6"
            } top-1/2 transform -translate-y-1/2 max-w-[200px] sm:max-w-xs lg:max-w-xs`}
          >
            <h3
              className={`text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-3 text-[#333333] ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {banners[currentBanner].title}
            </h3>
            <p
              className={`text-xs sm:text-sm md:text-base lg:text-base mb-3 sm:mb-4 lg:mb-4 text-[#333333] ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {banners[currentBanner].description}
            </p>
            <Button
              variant="secondary"
              size="large"
              onClick={() => handleShopNowClick(banners[currentBanner])}
              className="text-xs sm:text-sm md:text-base lg:text-base rounded-md"
            >
              {banners[currentBanner].buttonText}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-3 lg:mt-6">
          <div className="w-20 h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-[var(--color-primary,#007bff)] rounded-full transition-all duration-300"
              style={{
                width: `${(currentBanner + 1) * (100 / banners.length)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* XL screens and above: Always show dual banner layout with scrolling */}
      <div className="hidden xl:block">
        <div className="relative">
          {/* Navigation Arrows - Only show if more than 2 banners */}
          {banners.length > 2 && (
            <>
              <button
                onClick={prevBanner}
                disabled={isTransitioning || currentBanner === 0}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  isTransitioning || currentBanner === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
              >
                <svg
                  className={`w-5 h-5 text-gray-700 ${
                    isRTL ? "rotate-180" : ""
                  }`}
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
                onClick={nextBanner}
                disabled={
                  isTransitioning || currentBanner >= banners.length - 2
                }
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  isTransitioning || currentBanner >= banners.length - 2
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
              >
                <svg
                  className={`w-5 h-5 text-gray-700 ${
                    isRTL ? "rotate-180" : ""
                  }`}
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
            </>
          )}

          {/* Banner Container */}
          <div
            ref={bannerRef}
            className="relative overflow-hidden rounded-lg h-[240px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentBanner * 50}%)`,
              }}
            >
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="w-1/2 flex-shrink-0 relative overflow-hidden h-[240px]"
                  style={{ background: banner.background }}
                >
                  {/* Product Image - Positioned based on language direction */}
                  <div
                    className={`absolute ${
                      isRTL ? "left-4" : "right-4"
                    } top-1/2 transform -translate-y-1/2`}
                  >
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      width={224}
                      height={224}
                      className="w-56 h-56 object-contain"
                    />
                  </div>

                  {/* Content - Positioned based on language direction */}
                  <div
                    className={`absolute ${
                      isRTL ? "right-6" : "left-6"
                    } top-1/2 transform -translate-y-1/2 max-w-xs`}
                  >
                    <h3
                      className={`text-2xl font-bold mb-3 text-[#333333] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {banner.title}
                    </h3>
                    <p
                      className={`text-base mb-4 text-[#333333] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {banner.description}
                    </p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleShopNowClick(banner)}
                      className="text-xs sm:text-sm md:text-base lg:text-base rounded-md"
                    >
                      {banner.buttonText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Only show if more than 2 banners */}
          {banners.length > 2 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index * 2)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentPage
                      ? "bg-[var(--color-primary,#007bff)] scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  } ${
                    isTransitioning ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-b border-black/10 w-full mt-6" />
    </div>
  );
}
