"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import HeroBanner from "../../_components/_homepage/hero/HeroBanner";
import SubcategoriesSection from "../../_components/_homepage/SubcategoriesSection";
import HaircareBanner from "../../_components/_homepage/HaircareBanner";
import SunsilkShampooSection from "../../_components/_homepage/SunsilkShampooSection";
import NewLaunchesSection from "../../_components/_homepage/NewLaunchesSection";
import ShopOtherCategoriesSection from "../../_components/_homepage/ShopOtherCategoriesSection";
import FeaturedProductsSection from "../../_components/_homepage/featuredproduct/FeaturedProductsSection";

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category;
  const subcategoriesRef = useRef(null);

  // Scroll to Subcategories section when category page loads or when category changes
  useEffect(() => {
    if (subcategoriesRef.current) {
      const element = subcategoriesRef.current;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // Offset by 100px to show some content above
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, [categoryName]);

  // Convert URL slug back to readable category name
  const getCategoryDisplayName = (slug) => {
    // Normalize slug to match our slugify rules
    const normalized = String(slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const categoryMap = {
      'hair-care': 'Hair Care',
      'body-shower': 'Body & Shower',
      'soap-deodorants': 'Soap & Deodorants',
      'skin-care': 'Skin Care',
      'oral-misc': 'Oral & Misc'
    };
    return categoryMap[normalized] || normalized.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayName = getCategoryDisplayName(categoryName);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Subcategories Section - Auto-scroll target */}
      <div ref={subcategoriesRef}>
        <SubcategoriesSection key={displayName} selectedCategory={displayName} />
        
      </div>
      
      {/* Haircare Banner Section */}
      <HaircareBanner selectedCategory={displayName} />
      
      {/* Sunsilk Shampoo Section */}
      <SunsilkShampooSection selectedCategory={displayName} />
      
      {/* New Launches Section */}
      <NewLaunchesSection />

      <FeaturedProductsSection />
    

    
      {/* Shop Other Categories Section */}
      <ShopOtherCategoriesSection currentCategory={categoryName} />

    </div>
  );
} 