"use client";

import { categories } from "../../../lib/data";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

export default function ShopOtherCategoriesSection({ currentCategory }) {
  const router = useRouter();
  
  // Normalize strings to consistent slugs (e.g., "Body & Shower" -> "body-shower")
  const normalizeSlug = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // Memoize filtered categories to avoid recalculation on every render
  const otherCategories = useMemo(() => {
    const currentSlug = normalizeSlug(currentCategory);
    return categories.filter((category) =>
      normalizeSlug(category.name) !== currentSlug
    );
  }, [currentCategory]);

  const handleCategoryClick = (categoryName) => {
    // Navigate to category-specific page using normalized slug
    router.push(`/category/${normalizeSlug(categoryName)}`);
  };

  return (
    <section className="pt-0 pb-8 container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Shop Other Categories
          </h2>
        </header>
        
        {/* Unified Responsive Grid */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {otherCategories.map((category, index) => (
                          <div 
              key={`${category.name}-${index}`}
              className="group flex flex-col items-center justify-start cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg w-24 sm:w-28 md:w-36 lg:w-40 xl:w-44"
              onClick={() => handleCategoryClick(category.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category.name);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Shop ${category.name} category`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Image
                  src={category.image}
                  alt={`${category.name} category`}
                  width={100}
                  height={100}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 object-cover transition-transform duration-200 group-hover:scale-110"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 144px, (max-width: 1280px) 160px, 176px"
                  priority={index < 6} // Priority load for first 6 images
                />
              </div>
              
              {/* Category Name */}
              <p className="text-gray-900 font-medium text-center mt-2 text-xs sm:text-sm md:text-base leading-tight tracking-tight transition-colors duration-200 group-hover:text-[var(--color-primary)]">
                {category.name}
              </p>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {otherCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No other categories available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}