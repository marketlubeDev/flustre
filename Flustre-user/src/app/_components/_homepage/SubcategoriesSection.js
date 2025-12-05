"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useCategories from "@/lib/hooks/useCategories";

export default function SubcategoriesSection({ selectedCategory }) {
  const router = useRouter();
  const { categories, loading } = useCategories();

  // Find the selected category and get its subcategories
  const subcategories = useMemo(() => {
    if (!selectedCategory || !categories || categories.length === 0) {
      return [];
    }

    // Find the category that matches the selected category name
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase()
    );

    // Return subcategories if they exist and are an array
    if (category && category.subcategories) {
      // Handle both array of objects and array of strings
      if (Array.isArray(category.subcategories)) {
        return category.subcategories.map((sub) => {
          // If sub is an object with name, use it; otherwise treat as string
          const subName = typeof sub === "object" && sub !== null ? (sub.name || sub) : sub;
          const subId = typeof sub === "object" && sub !== null ? (sub._id || sub.id || sub) : sub;
          return {
            name: subName,
            id: subId,
          };
        });
      }
    }

    return [];
  }, [selectedCategory, categories]);

  const handleSubcategoryClick = (subcategoryName) => {
    router.push(
      `/products?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(subcategoryName)}`
    );
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-8 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-10 2xl:px-10">
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-[28px] font-bold text-gray-800 mb-4">
            Subcategories
          </h2>
        </header>
        <div className="flex justify-center items-center w-full h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </section>
    );
  }

  // If no subcategories, don't render the section
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-10 2xl:px-10">
      <header className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-[28px] font-bold text-gray-800 mb-4">
          Subcategories
        </h2>
      </header>

      {/* Subcategories - Premium horizontal row with blue gradient and animation */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5">
        {subcategories.map((subcategory, index) => (
          <button
            key={`${selectedCategory}-${subcategory.id || subcategory.name}-${index}`}
            onClick={() => handleSubcategoryClick(subcategory.name)}
            className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/90 via-[var(--color-primary)] to-[var(--color-primary)]/80 border-2 border-[var(--color-primary)]/30 rounded-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] shadow-md group"
            aria-label={`Browse ${subcategory.name} subcategory`}
          >
            {/* Continuous shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            
            {/* Continuous rotating gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/50 via-transparent to-[var(--color-primary)]/30 rounded-lg animate-spin-slow opacity-60"></div>
            
            <p className="relative text-white font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap z-10">
              {subcategory.name}
            </p>
          </button>
        ))}
      </div>
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

