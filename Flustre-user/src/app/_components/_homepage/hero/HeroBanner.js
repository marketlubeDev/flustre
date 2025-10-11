"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/common/Button";

export default function HeroBanner() {
  const router = useRouter();

  const normalizeSlug = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // STATIC BANNERS: Using local images from public/banner
  const banners = [
    {
      id: 1,
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Banners/newbanner1(re).jpeg",
      title: "Living Room Furniture",
      subtitle: "Sofas, sectionals, coffee tables",
      description: "Design a cozy living space with modern, durable pieces.",
    },
    {
      id: 2,
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Banners/newbanner2+(re).jpg",
      title: "Bedroom Collections",
      subtitle: "Beds, wardrobes, nightstands",
      description: "Sleep better with thoughtfully crafted bedroom essentials.",
    },
    {
      id: 3,
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Banners/newbanner3(re).jpeg",
      title: "Dining & Kitchen",
      subtitle: "Dining sets, chairs, storage",
      description: "Gather in style with functional dining furniture.",
    },
    {
      id: 4,
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Banners/newbanner5+(re).jpg",
      title: "Office & Study",
      subtitle: "Desks, ergonomic chairs, shelves",
      description: "Work comfortably with smart, space‑saving designs.",
    },
  ];

  console.log(banners, "hero-banners-static");

  // Auto-slide functionality (unchanged from original implementation)
  useEffect(() => {
    if (isAutoPlaying && banners.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, banners.length]);

  const handleSlideChange = (newSlide) => {
    setIsAutoPlaying(false);
    setCurrentSlide(newSlide);

    // Resume auto-slide after 3 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % banners.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    handleSlideChange(index);
  };

  const currentBanner = banners[currentSlide];

  // Ensure there is at least one banner
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main banner container with responsive height */}
      <div className="relative h-[500px] md:h-[500px] lg:h-[640px] bg-white overflow-hidden">
        {/* Background image with responsive sizing */}
        {/* BACKEND INTERACTION: Previously used dynamic image URLs from database */}
        {/* Now uses static image paths from public folder */}
        <div
          className="absolute inset-0 transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: `url('${currentBanner.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f8f9fa",
          }}
        />

        {/* Responsive overlay gradients */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 30%, transparent 50%),
              linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 30%, transparent 50%)
            `,
          }}
        />

        {/* Navigation arrows - responsive positioning */}
        <div className="absolute inset-0 flex items-center justify-between z-20 md:top-1/2 md:-translate-y-1/2">
          <div className="container mx-auto flex justify-between items-center px-4 md:px-8 lg:px-10">
            {/* Previous button */}
            <button
              onClick={prevSlide}
              className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md ring-1 ring-black/5 transition cursor-pointer"
              aria-label="Previous slide"
            >
              <Image
                src="/previousicon.svg"
                alt="Previous"
                width={12}
                height={12}
                className="w-3 h-3 md:w-5 md:h-5"
              />
            </button>

            {/* Next button */}
            <button
              onClick={nextSlide}
              className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md ring-1 ring-black/5 transition cursor-pointer"
              aria-label="Next slide"
            >
              <Image
                src="/nexticon.svg"
                alt="Next"
                width={12}
                height={12}
                className="w-3 h-3 md:w-5 md:h-5"
              />
            </button>
          </div>
        </div>

        {/* Content - responsive positioning and sizing */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto pb-8 md:pb-12 lg:pb-16 px-4 md:px-8 lg:px-10">
            <div className="max-w-full md:max-w-xl lg:max-w-2xl">
              {/* Heading with responsive text sizes */}
              {/* BACKEND INTERACTION: Previously used dynamic title from database */}
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-white mb-3 md:mb-4 lg:mb-6 leading-tight transition-all duration-500">
                {currentBanner.title}
              </h1>

              {/* Subtitle - hidden on mobile, shown on tablet+ */}
              {/* BACKEND INTERACTION: Previously used dynamic subtitle from database */}
              {currentBanner.description && (
                <p className="hidden md:block text-base lg:text-xl text-gray-200 mb-2 lg:mb-0 leading-relaxed transition-all duration-500">
                  {currentBanner.description}
                </p>
              )}

              {/* Description with responsive text sizes */}
              {/* BACKEND INTERACTION: Previously used dynamic description from database */}
              <p className="text-xs md:text-base lg:text-xl text-gray-200 mb-6 md:mb-6 lg:mb-8 leading-relaxed transition-all duration-500">
                {/* Show both subtitle and description on mobile, just description on larger screens */}
                <span className="md:hidden">
                  {currentBanner.description}
                  {currentBanner.description && <br />}
                </span>
                {/* {currentBanner.description} */}
              </p>

              {/* Shop now button with responsive sizing */}
              {/* BACKEND INTERACTION: Previously used dynamic category slug from database */}
              <Button
                variant="primary"
                size="large"
                onClick={() =>
                  router.push(`/category/${normalizeSlug(currentBanner.title)}`)
                }
                className="self-start md:self-auto text-xs md:text-sm lg:text-base rounded-md"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Progress indicator with responsive sizing */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1 md:gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-0.5 md:h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide
                    ? "bg-[#2B73B8] md:bg-[#2B73B8] md:opacity-70"
                    : "bg-[rgba(51,51,51,0.2)] md:bg-gray-300"
                } ${
                  // Responsive widths
                  banners.length <= 4
                    ? "w-16 md:w-16 lg:w-20"
                    : "w-12 md:w-14 lg:w-16"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
