"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { categories as staticCategories } from "../../../../lib/data";


const CategorySection = () => {
  const router = useRouter();


  // Use static categories defined in lib/data.js
  const categories = staticCategories;

  // Utility function to normalize slug
  const normalizeSlug = useCallback((value) => {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  // Handle category click
  const handleCategoryClick = useCallback(
    (categoryName) => {
      router.push(`/category/${normalizeSlug(categoryName)}`);
    },
    [router, normalizeSlug]
  );

  // Show loading state while categories are being fetched

  // Loading State:
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden container mx-auto py-10 px-4 md:px-10">
      <h2 className="text-[#333333] text-center text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold leading-normal tracking-[-0.28px] mb-6">Shop by Category</h2>
      <div className="flex justify-center items-center w-full h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    </div>
  );

  // Error State:
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden container mx-auto py-10 px-4 md:px-10">
      <h2 className="text-center text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold leading-normal tracking-[-0.28px] mb-6">Shop by Category</h2>
      <div className="text-red-500 text-center">
        Failed to load categories. Please try again later.
      </div>
    </div>
  );

  // No loading/error states needed for static data

  // Category item component
  const CategoryItem = ({ category, index }) => (
    <div
      key={category.id || `category-${index}`}
      className="flex flex-col items-center justify-start cursor-pointer group transition-transform duration-200 hover:scale-105"
      onClick={() => handleCategoryClick(category.name)}
    >
      {/* Category Image Container - Responsive sizing */}
      {/* BACKEND INTERACTION: Previously used dynamic image URLs from database */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200
                     w-[100px] h-[100px]
                     sm:w-[160px] sm:h-[160px]
                     md:w-[180px] md:h-[180px]
                     lg:w-[160px] lg:h-[160px]
                     xl:w-[180px] xl:h-[180px]"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-110"
          sizes="(max-width: 640px) 100px, (max-width: 768px) 160px, (max-width: 1024px) 180px, (max-width: 1280px) 160px, 180px"
        />
      </div>

      {/* Category Name - Responsive text sizing */}
      {/* BACKEND INTERACTION: Previously used dynamic category names from database */}
      <p
        className="text-[#000000] font-medium text-center mt-2 leading-normal tracking-[-0.28px] transition-colors duration-200 group-hover:text-[var(--color-primary)]
                   text-[10px]
                   sm:text-xs
                   md:text-[13px]
                   lg:text-xs
                   xl:text-sm"
      >
        {category.name}
      </p>
    </div>
  );

  // Get categories for mobile layout (first 3 + remaining 2)
  const firstRowCategories = categories.slice(0, 3);
  const secondRowCategories = categories.slice(3, 5);

  return (
    <section className="flex flex-col items-center justify-center w-full overflow-hidden container mx-auto py-10 px-4 md:px-10 bg-white">
      {/* Section Title */}
      <h2
        className="text-[#333333] text-center font-bold leading-normal tracking-[-0.28px] mb-5
                    text-xl
                    sm:text-2xl
                    md:text-[26px]
                    lg:text-[28px]"
      >
        Shop by Category
      </h2>

      {/* Categories Grid - Responsive Layout */}
      <div className="w-full">
        {/* Mobile Layout (< sm) - Special 3+2 layout */}
        <div className="sm:hidden w-full space-y-2">
          {/* First row - 3 categories */}
          <div className="flex justify-between gap-2">
            {firstRowCategories.map((category, index) => (
              <CategoryItem
                key={`mobile-first-${index}`}
                category={category}
                index={index}
              />
            ))}
          </div>

          {/* Second row - 2 categories centered */}
          <div className="flex justify-center gap-2">
            {secondRowCategories.map((category, index) => (
              <CategoryItem
                key={`mobile-second-${index}`}
                category={category}
                index={index + 3}
              />
            ))}
          </div>
        </div>

        {/* Tablet Layout (sm to lg) - Flexbox wrap */}
        <div className="hidden sm:flex lg:hidden flex-wrap justify-center items-center gap-2 md:gap-3 w-full">
          {categories.map((category, index) => (
            <div
              key={`tablet-${index}`}
              className="flex-[0_0_calc(33.333%-8px)] mb-4"
            >
              <CategoryItem category={category} index={index} />
            </div>
          ))}
        </div>

        {/* Desktop Layout (lg+) - Horizontal flex */}
        <div className="hidden lg:flex justify-center items-center gap-3 xl:gap-6 w-full">
          {categories.map((category, index) => (
            <CategoryItem
              key={`desktop-${index}`}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="border-b border-black/10 w-full mt-6" />
    </section>
  );
};

export default CategorySection;
