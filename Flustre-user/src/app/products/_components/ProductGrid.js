"use client";

import PromotionalBanner from "../../_components/_homepage/promotion/PromotionalBanner";
import ProductShowcaseBanner from "../../_components/_homepage/promotion/ProductShowcaseBanner";
import ProductCard from "../../_components/_homepage/ProductCard";
import { LuPackageSearch } from "react-icons/lu";
import Image from "next/image";
;

export default function ProductGrid({
  products,
  selectedCategory,
  sortBy,
  setSortBy,
}) {
  const sortOptions = [
    "Featured",
    "Price Low to High",
    "Price High to Low",
    "Newest",
    "Popular",
  ];

  // Use products from parent directly
  const modifiedProducts = Array.isArray(products) ? products : [];
  // Split products into chunks to interleave banners dynamically
  const FIRST_CHUNK_COUNT = 10;
  const SECOND_CHUNK_COUNT = 10;
  const firstChunk = modifiedProducts.slice(0, FIRST_CHUNK_COUNT);
  const secondChunk = modifiedProducts.slice(
    FIRST_CHUNK_COUNT,
    FIRST_CHUNK_COUNT + SECOND_CHUNK_COUNT
  );
  const remainingChunk = modifiedProducts.slice(
    FIRST_CHUNK_COUNT + SECOND_CHUNK_COUNT
  );

  return (
    <div className="bg-white px-4 sm:px-10 md:px-0 lg:px-4 2xl:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* md-only Filter/Sort triggers aligned to the end */}
        <div className="order-2 sm:order-2 self-end sm:self-auto hidden md:flex lg:hidden items-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new Event("open-filter"))}
            className="flex items-center gap-2 text-gray-900"
          >
            <Image
              src="/filtericon.svg"
              alt="Filter"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-semibold text-sm">Filter</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <button
            onClick={() => window.dispatchEvent(new Event("open-sort"))}
            className="flex items-center gap-2 text-gray-900"
          >
            <Image
              src="/sorticon.svg"
              alt="Sort"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-semibold text-sm">Sort</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-600">
            Showing results for{" "}
            <span className="font-semibold text-gray-900">
              &quot;
              {selectedCategory || "All Products"}
              &quot;
            </span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {/* Sort Dropdown visible from sm+; hidden on mobile */}
          <div className="flex items-center gap-1 relative">
            <span className="text-sm text-gray-600">Sort by</span>
            <div
              className="relative flex items-center"
              style={{ marginRight: "0px" }}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-0 pr-4 py-0 text-sm bg-white appearance-none focus:outline-none font-semibold text-gray-800"
                style={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingLeft: "0rem",
                  paddingRight: "18px",
                  height: "24px",
                  lineHeight: "24px",
                  minWidth: "fit-content",
                  cursor: "pointer",
                  direction: "ltr",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="font-normal"
                    style={{ textAlign: "left" }}
                  >
                    {option}
                  </option>
                ))}
              </select>
              <Image
                src="/dropdownicon.svg"
                alt="dropdown"
                width={12}
                height={12}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                style={{
                  minWidth: "12px",
                  minHeight: "12px",
                  right: "2px",
                }}
              />
            </div>
            <div
              className="h-5 border-l border-gray-200 ml-1"
              style={{ height: "20px" }}
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {modifiedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <LuPackageSearch className="text-gray-400" size={64} />
          <p className="mt-3 text-gray-600 font-medium">No products found</p>
        </div>
      )}

      {/* First chunk of products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {firstChunk.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Promotional Banner after first products */}
      {firstChunk.length > 0 && (
        <div className="mt-8 w-full">
          <PromotionalBanner fullWidth={true} />
        </div>
      )}

      {/* Second chunk of products */}
      {secondChunk.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {secondChunk.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Product Showcase Banner after second products */}
      {secondChunk.length > 0 && (
        <div className="mt-8 w-full">
          <ProductShowcaseBanner fullWidth={true} category={selectedCategory} />
        </div>
      )}

      {/* Remaining products */}
      {remainingChunk.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {remainingChunk.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
