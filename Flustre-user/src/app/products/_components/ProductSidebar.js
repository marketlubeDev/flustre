"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import useCategories from "@/lib/hooks/useCategories";

export default function ProductSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedDiscount,
  setSelectedDiscount,
  priceRange,
  setPriceRange,
}) {
  const router = useRouter();
  const [sessionData, setSessionData] = useState({});

  // Live categories
  const { categories: apiCategories, loading: categoriesLoading } =
    useCategories();

  const discountOptions = [
    "Discount 10",
    "Discount 20",
    "Discount 30",
    "Discount 40",
    "Discount 50",
  ];

  const priceRanges = [
    "Under 1000",
    "Range 1000 to 2000",
    "Range 2000 to 3000",
    "Range 3000 to 4000",
    "Over 4000",
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Store in component state instead of localStorage
    setSessionData({ selectedCategory: category });
  };

  return (
    <div
      className="bg-white p-4 rounded-lg w-full"
      style={{
        overscrollBehavior: "contain",
        minWidth: "320px",
        maxWidth: "100%",
      }}
      onWheel={(e) => {
        // Prevent scroll propagation to parent elements
        e.stopPropagation();
      }}
    >
      {/* Categories */}
      <div className="mb-4">
        <h3
          className="mb-2"
          style={{
            color: "#333",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "normal",
            letterSpacing: "-0.18px",
          }}
        >
          Categories
        </h3>
        <div className="space-y-0">
          {(categoriesLoading ? [] : apiCategories).map((cat) => (
            <button
              key={cat?.id || cat?.name}
              onClick={() => handleCategoryClick(cat?.name)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat?.name
                  ? "bg-[#f7f3f4]"
                  : "hover:bg-gray-50"
              }`}
              style={{
                color:
                  selectedCategory === cat?.name
                    ? "var(--color-primary)"
                    : "rgba(51, 51, 51, 0.70)",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "normal",
                letterSpacing: "-0.16px",
              }}
            >
              {cat?.name}
            </button>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div className="mb-4">
        <h3
          className="mb-2"
          style={{
            color: "#333",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "normal",
            letterSpacing: "-0.18px",
          }}
        >
          Discount
        </h3>
        <div className="space-y-0">
          {discountOptions.map((discount) => (
            <button
              key={discount}
              onClick={() => setSelectedDiscount(discount)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer ${
                selectedDiscount === discount
                  ? "bg-[#f7f3f4]"
                  : "hover:bg-gray-50"
              }`}
              style={{
                color:
                  selectedDiscount === discount
                    ? "var(--color-primary)"
                    : "rgba(51, 51, 51, 0.70)",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "normal",
                letterSpacing: "-0.16px",
              }}
            >
              {discount}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h3
          className="mb-4"
          style={{
            color: "#333",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "normal",
            letterSpacing: "-0.18px",
          }}
        >
          Price Range
        </h3>

        {/* Price Range Slider */}
        <div className="mb-4 px-4">
          <div
            className="relative max-w-[200px] overflow-visible"
            style={{ margin: "0 auto 0 0" }}
          >
            {/* Background track */}
            <div className="w-full h-1 bg-gray-300 rounded-lg relative overflow-visible">
              {/* Green selected portion */}
              <div
                className="h-1 bg-[var(--color-primary)] absolute top-0"
                style={{
                  width: `${
                    ((priceRange.max - priceRange.min) / (100000 - 0)) * 100
                  }%`,
                  left: `${(priceRange.min / 100000) * 100}%`,
                  right: "auto",
                  borderRadius:
                    priceRange.min === 0
                      ? "4px 0 0 4px"
                      : priceRange.max === 100000   
                      ? "0 4px 4px 0"
                      : "0",
                }}
              />

              {/* Min circle */}
              <div
                className="absolute z-10"
                style={{
                  top: "50%",
                  left: priceRange.min === 0 
                    ? "0" 
                    : `${(priceRange.min / 100000) * 100}%`,
                  right: "auto",
                  transform: priceRange.min === 0 
                    ? "translate(0, -50%)" 
                    : "translate(-50%, -50%)",
                }}
              >
                <Image
                  src="/pricecircle.svg"
                  alt="min"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </div>

              {/* Max circle */}
              <div
                className="absolute z-10"
                style={{
                  top: "50%",
                  left: priceRange.max === 100000 
                    ? "auto" 
                    : `${(priceRange.max / 100000) * 100}%`,
                  right: priceRange.max === 100000 
                    ? "0" 
                    : "auto",
                  transform: priceRange.max === 100000 
                    ? "translate(50%, -50%)" 
                    : "translate(-50%, -50%)",
                }}
              >
                <Image
                  src="/pricecircle.svg"
                  alt="max"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </div>
            </div>

            {/* Full width range inputs for complete control */}
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange.min}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= priceRange.max) {
                  setPriceRange((prev) => ({
                    ...prev,
                    min: value,
                  }));
                }
              }}
              className="absolute top-0 w-full h-1 opacity-0 cursor-pointer z-20"
              style={{
                pointerEvents: "auto",
              }}
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange.max}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= priceRange.min) {
                  setPriceRange((prev) => ({
                    ...prev,
                    max: value,
                  }));
                }
              }}
              className="absolute top-0 w-full h-1 opacity-0 cursor-pointer z-30"
              style={{
                pointerEvents: "auto",
              }}
            />
          </div>

          <div className="flex justify-start items-center gap-1 mt-2">
            <div
              style={{
                display: "flex",
                padding: "6px 6px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                minWidth: "80px",
                borderRadius: "4px",
                background: "rgba(0, 0, 0, 0.06)",
                color: "rgba(51, 51, 51, 0.70)",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "normal",
                letterSpacing: "-0.14px",
              }}
            >
              <span style={{ color: "rgba(51, 51, 51, 0.70)" }}>₹</span>{" "}
              {priceRange.min.toLocaleString()}
            </div>
            <Image
              src="/doublearrow.svg"
              alt="range"
              width={20}
              height={8}
              className="w-5 h-2 mx-1 flex-shrink-0"
            />
            <div
              style={{
                display: "flex",
                padding: "6px 6px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                minWidth: "80px",
                borderRadius: "4px",
                background: "rgba(0, 0, 0, 0.06)",
                color: "rgba(51, 51, 51, 0.70)",
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "normal",
                letterSpacing: "-0.14px",
              }}
            >
              <span style={{ color: "rgba(51, 51, 51, 0.70)" }}>₹</span>{" "}
              {priceRange.max.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Predefined Price Ranges */}
        <div className="space-y-0 px-0">
          <div className="max-w-[200px]" style={{ margin: "0 auto 0 0" }}>
            {priceRanges.map((range) => (
              <button
                key={range}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                style={{
                  color: "rgba(51, 51, 51, 0.70)",
                  fontSize: "15px",
                  fontWeight: "600",
                  lineHeight: "normal",
                  letterSpacing: "-0.16px",
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          width: 12px;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          height: 12px;
          width: 12px;
          background: transparent;
          cursor: pointer;
          border: none;
        }

        /* Hide scrollbar for the sidebar */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }

        .overflow-y-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Enhanced scroll isolation */
        div[style*="overscroll-behavior"] {
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}
