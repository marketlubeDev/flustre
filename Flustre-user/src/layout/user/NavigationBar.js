"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NavigationBar = ({ navigationItems }) => {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const isRTL = false;
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleCategoriesMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowMegaMenu(true);
  };

  const handleCategoriesMouseLeave = () => {
    // Add a small delay before hiding to allow moving to mega menu
    hoverTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  const handleMegaMenuMouseEnter = () => {
    // Clear timeout when entering mega menu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMegaMenuMouseLeave = () => {
    // Hide mega menu when leaving
    setShowMegaMenu(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Get all categories with subcategories for mega menu
  const categoriesWithSubs = navigationItems.filter(item => item.hasDropdown && item.submenu && item.submenu.length > 0);

  return (
    <div
      className="bg-[var(--color-primary)] relative"
      dir="ltr"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16 overflow-x-hidden">
        <div
          className="hidden lg:flex lg:items-center lg:justify-evenly py-0.5"
          ref={navRef}
        >
          {navigationItems.map((item, index) => {
            const hasSubcategories = item.hasDropdown && item.submenu && item.submenu.length > 0;
            
            return (
              <div
                key={index}
                className="relative group flex-shrink-0"
                onMouseEnter={hasSubcategories ? handleCategoriesMouseEnter : undefined}
                onMouseLeave={hasSubcategories ? handleCategoriesMouseLeave : undefined}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-white font-normal transition-colors duration-200 py-2 cursor-pointer whitespace-nowrap text-sm xl:text-xs tracking-[0.02em]"
                  style={{ cursor: "pointer" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "white")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "white")}
                  onClick={() => {
                    // Reset category when Products is clicked
                    if (item.label === "Products") {
                      localStorage.removeItem("selectedCategory");
                    }
                    setShowMegaMenu(false);
                  }}
                >
                  <span>{item.label}</span>
                  {hasSubcategories && (
                    <Image
                      src="/dropdownicon.svg"
                      alt="dropdown"
                      width={7}
                      height={4}
                      className={`w-[7px] h-[4px] transition-transform duration-200 group-hover:rotate-180 filter brightness-0 invert ${
                        showMegaMenu ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mega Menu - Shows all categories and subcategories at once */}
      {showMegaMenu && categoriesWithSubs.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-200 z-[9999]"
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMegaMenuMouseLeave}
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {categoriesWithSubs.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <Link
                    href={category.href}
                    className="block font-semibold text-gray-900 text-base hover:text-[#2B73B8] transition-colors duration-200"
                    onClick={() => setShowMegaMenu(false)}
                  >
                    {category.label}
                  </Link>
                  <div className="space-y-2">
                    {category.submenu.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        href={`/products?category=${encodeURIComponent(
                          category.label
                        )}&subcategory=${encodeURIComponent(subItem)}`}
                        className="block text-sm text-gray-600 hover:text-[#2B73B8] hover:translate-x-1 transition-all duration-200"
                        onClick={() => setShowMegaMenu(false)}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
