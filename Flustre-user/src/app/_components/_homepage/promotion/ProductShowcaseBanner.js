"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductShowcaseBanner({ fullWidth = false }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const containerRef = useRef(null);

  const showcaseItems = [
    {
      image: "/showcase/showbanner1.jpg",
    },
    {
      image: "/showcase/showbanner2.jpg",
    },
    {
      image: "/showcase/showbanner3.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(); // swipe left
      } else {
        prevSlide(); // swipe right
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div
      className={`py-0 md:py-8 lg:py-10 ${
        fullWidth ? "px-0 sm:px-10 md:px-0 lg:px-4" : "px-0 sm:px-6 md:px-12 lg:px-8 xl:px-[200px]"
      }`}
    >
      {/* Mobile: Single banner swiper */}
      <div className="lg:hidden">
        <div 
          ref={containerRef}
          className="relative w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current Banner */}
          <div className="w-full">
            <div
              className="relative overflow-hidden rounded-lg showcase-banner-item"
              style={{
                height: "200px",
                background: showcaseItems[currentSlide].background,
              }}
            >
              {/* Full-width image */}
              <Image
                src={showcaseItems[currentSlide].image}
                alt={`Haircare Banner ${currentSlide + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          

        </div>
        
        {/* Line Indicator */}
        <div className="w-full mt-4">
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-1 bg-[var(--color-primary)] rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / showcaseItems.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Custom layout - Left card full height, right cards stacked */}
      <div className="hidden lg:flex lg:gap-4 lg:h-[426px]">
        {/* First Card - Full Image */}
        <div
          className="relative overflow-hidden flex-1"
          style={{
            height: "100%",
            borderRadius: "3.324px",
          }}
        >
          <Image
            src="/showcase/showbanner1.jpg"
            alt="Haircare Banner 1"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right Column - Stacked cards with gap */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Second Card - Full Image */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "calc(50% - 8px)", // Half height minus gap
              borderRadius: "3.324px",
            }}
          >
            <Image
              src="/showcase/showbanner2.jpg"
              alt="Haircare Banner 2"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          </div>

          {/* Third Card - Full Image */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "calc(50% - 8px)", // Half height minus gap
              borderRadius: "3.324px",
            }}
          >
            <Image
              src="/showcase/showbanner3.jpg"
              alt="Haircare Banner 3"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 25vw"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 640px) and (max-width: 819px) {
          .showcase-banner-item {
            height: 320px !important;
          }
        }
        @media (min-width: 820px) and (max-width: 1023px) {
          .showcase-banner-item {
            height: 350px !important;
          }
        }
      `}</style>
    </div>
  );
}
