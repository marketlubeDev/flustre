"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
// import { useTranslation } from "@/lib/hooks/useTranslation"; // Removed API integration
import { useFeaturedPromotionBanners } from "@/lib/hooks/useBanners";

export default function CrystalClearBanner() {
  // Static translation function - no API integration
  const t = (key) => key; // Simple fallback
  const language = "EN";
  const router = useRouter();

  // Fetch featured promotion banners (singleOffer)
  const { data: bannersData, isLoading, error } = useFeaturedPromotionBanners();

  // No fallback banner: render nothing if no API data

  // Normalize and filter to singleOffer banners
  const items = Array.isArray(bannersData?.data)
    ? bannersData.data
    : Array.isArray(bannersData)
    ? bannersData
    : [];

  const offers = useMemo(() => {
    return items.filter((it) => {
      const flag = it?.bannerfor ?? it?.bannerFor ?? it?.banner_for;
      return flag === "singleOffer";
    });
  }, [items]);

  // Carousel state (must be declared unconditionally before any returns)
  const [current, setCurrent] = useState(0);
  const total = offers.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => {
      setCurrent((idx) => (idx + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const goNext = useCallback(() => {
    setCurrent((idx) => (idx + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((idx) => (idx - 1 + total) % total);
  }, [total]);

  const active = offers[current] || offers[0];
  if (!offers || offers.length === 0 || !active) {
    return null;
  }
  const banner = {
    id: active._id || active.id,
    title: active.title || "",
    description:
      active.description ||
      (active.percentage ? `${active.percentage}% off` : ""),
    image: active.image,
    productLink: active.productLink || null,
    percentage: active.percentage,
  };

  const handleShopNowClick = () => {
    if (banner.productLink) {
      // If it's a full URL, open in new tab
      if (banner.productLink.startsWith("http")) {
        window.open(banner.productLink, "_blank");
      } else {
        // If it's a relative path, navigate to it
        router.push(banner.productLink);
      }
    } else {
      // Fallback to skin care category
      router.push("/category/skin-care");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-10 overflow-hidden">
        <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
        <div className="border-b border-gray-200 w-full mt-6" />
      </div>
    );
  }

  // Show error state (still render with fallback data)
  if (error) {
    console.warn(
      "Failed to fetch crystal clear banners, using fallback data:",
      error
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-10 overflow-hidden">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-lg">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={banner.image}
            alt={banner.title}
            className="object-cover absolute inset-0 w-full h-full"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x400?text=Banner+Image";
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div>
                <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-3 sm:mb-4">
                  {banner.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  {banner.description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="large"
                onClick={handleShopNowClick}
                className="bg-transparent hover:bg-white/10 text-white border-white hover:scale-105 focus:ring-white/50 focus:ring-offset-transparent text-sm sm:text-base rounded"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        {total > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 z-10">
            <button
              aria-label="Previous"
              onClick={goPrev}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={goNext}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
            >
              ›
            </button>
          </div>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {offers.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 w-full mt-6" />
    </div>
  );
}
