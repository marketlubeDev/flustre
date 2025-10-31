"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useProductsByLabelName from "@/lib/hooks/useProductsByLabelName";

export default function BeautyCollectionGrid() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const { products, loading } = useProductsByLabelName("Premium Comfort", {
    page: 1,
    limit: 24,
  });
  const visibleProducts = (products || []).slice(0, 3);

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  // Auto-advance carousel for mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;
    if (!visibleProducts.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % visibleProducts.length;
        const cardWidth = carousel.children[0]?.offsetWidth || 0;
        const gap = 8; // 8px gap between cards
        carousel.scrollTo({
          left: nextSlide * (cardWidth + gap),
          behavior: "smooth",
        });
        return nextSlide;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleProducts.length]);

  return (
    <div className="flex-1 w-full">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide lg:overflow-visible snap-x snap-mandatory gap-2 lg:gap-0"
      >
        {!loading &&
          visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-1/2 lg:w-1/3 snap-start"
            >
              <div
                className="bg-white rounded-lg p-0 lg:p-4 h-full flex flex-col cursor-pointer group"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-square flex items-center justify-center rounded-lg overflow-hidden mb-3 sm:mb-4">
                  {product.image?.includes("marketlube") ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-fit w-full h-full transition-transform duration-300 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=Product+Image";
                      }}
                    />
                  ) : (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 639px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      className="object-fit transition-transform duration-300 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=Product+Image";
                      }}
                    />
                  )}
                </div>
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 px-1">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 lg:mb-4 px-1">
                  {product.category}
                </p>
                <div className="flex items-center gap-1 md:gap-2 lg:gap-3 mt-auto px-1 pb-2 lg:pb-0">
                  <span className="font-bold text-[var(--color-primary)] tracking-tight text-xs md:text-sm lg:text-base">
                    <span
                      className="align-baseline text-[9px] md:text-[10px] lg:text-xs"
                      style={{ color: "#2B73B8" }}
                    >
                      ₹
                    </span>
                    <span className="ml-1">{product.price}</span>
                  </span>
                  <span className="relative inline-flex items-center text-gray-500 tracking-tight">
                    <span
                      className="align-baseline text-[9px] md:text-[10px] lg:text-xs"
                      style={{ color: "#2B73B8" }}
                    >
                      ₹
                    </span>
                    <span className="text-[10px] md:text-xs lg:text-sm ml-1">
                      {product.originalPrice}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform h-px bg-gray-700"
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Mobile scroll indicator */}
      <div className="lg:hidden w-full mt-4">
        <div className="flex justify-center">
          <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-1 bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{
                width: `${
                  (currentSlide + 1) * (100 / visibleProducts.length)
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
