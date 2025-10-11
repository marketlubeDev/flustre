"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

const PRICE_RANGES_CONFIG = {

  
  "Living": [
    {
      range: "Under ₹500",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
    },
    {
      range: "₹500 - ₹1000",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
    },
    {
      range: "₹1000 - ₹1500",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
    },
    {
      range: "₹1500 - ₹2000",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
    },
    {
      range: "₹2000 - ₹2500",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
    },
    {
      range: "Over ₹2500",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
    },
  ],
};

// Default price ranges
// Fix: prepend "/" so src is from public/ dir
const DEFAULT_PRICE_RANGES = [
  {
    range: "Under ₹500",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
  },
  {
    range: "₹500 - ₹1000",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
  },
  {
    range: "₹1000 - ₹1500",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
  },
  {
    range: "₹1500 - ₹2000",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
  },
  {
    range: "₹2000 - ₹2500",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended1+(1).jpg",
  },
  {
    range: "Over ₹2500",
    image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/recommended/recommended2+(1).jpg",
  },
];

export default function ShopByPriceSection({ selectedCategory }) {
  const router = useRouter();
  
  // Memoize price ranges to avoid recalculation on every render
  const priceRanges = useMemo(() => {
    return PRICE_RANGES_CONFIG[selectedCategory] || DEFAULT_PRICE_RANGES;
  }, [selectedCategory]);

  const handlePriceClick = (priceRange) => {
    // Don't navigate if Living category is selected (static category)
    if (selectedCategory === "Living") {
      return;
    }
    router.push(`/products?price=${encodeURIComponent(priceRange)}`);
  };

  return (
    <section className="py-8 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-10 2xl:px-10">
      <header className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-[28px] font-bold text-gray-800 mb-4">
          Shop by Price
        </h2>
      </header>
      
      {/* Unified Responsive Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mx-auto">
        {priceRanges.map((item, index) => (
          <div
            key={`${selectedCategory}-${item.range}-${index}`}
            className={`flex flex-col items-center justify-center bg-white rounded-lg p-2 sm:p-4 md:p-0 duration-200 group transition-transform ${
              selectedCategory === "Living" 
                ? "cursor-default" 
                : "cursor-pointer hover:scale-105"
            }`}
            onClick={() => handlePriceClick(item.range)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePriceClick(item.range);
              }
            }}
            aria-label={`Shop products ${item.range}`}
          >
            <div className="w-full aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg relative">
              <Image
                src={item.image}
                alt={`${item.range} products`}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                className={`object-cover transition-transform duration-200 ${
                  selectedCategory === "Living" ? "" : "group-hover:scale-110"
                }`}
                priority={index < 6} // Prioritize first 6 images
              />
            </div>
            <div className="text-center">
              <p className={`text-[#000000] font-medium text-center mt-2 leading-normal tracking-[-0.28px] transition-colors duration-200 
                   text-[10px] 
                   sm:text-xs 
                   md:text-[13px] 
                   lg:text-xs 
                   xl:text-sm ${
                     selectedCategory === "Living" ? "" : "group-hover:text-[var(--color-primary)]"
                   }`}>
                {item.range}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}