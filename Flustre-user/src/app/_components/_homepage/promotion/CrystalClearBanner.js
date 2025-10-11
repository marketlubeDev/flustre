"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
// import { useTranslation } from "@/lib/hooks/useTranslation"; // Removed API integration
// import { useFeaturedPromotionBanners } from "@/lib/hooks/useBanners"; // Removed API integration

export default function CrystalClearBanner() {
  // Static translation function - no API integration
  const t = (key) => key; // Simple fallback
  const language = "EN";
  const router = useRouter();

  // Static data - no API integration
  const bannersData = null;
  const isLoading = false;
  const error = null;

  // Fallback banner data in case API fails or no data
  const fallbackBanner = {
    id: 1,
    title: "Luxury Furniture Collection, 20% OFF!",
    description:
      "Premium furniture essentials for comfortable, stylish living. Limited time offer",
    image:
      "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/crystal/crystabanner1+(1).jpg",
    productLink: "/category/skin-care",
    percentage: 20,
  };

  // Use API data if available, otherwise use fallback
  const banner =
    bannersData?.data?.length > 0
      ? {
          id: bannersData.data[0]._id,
          title: bannersData.data[0].title,
          description:
            bannersData.data[0].description ||
            "Premium skincare essentials for radiant, healthy skin. Limited time offer",
          image: bannersData.data[0].image,
          productLink: bannersData.data[0].productLink || "/category/skin-care",
          percentage: bannersData.data[0].percentage,
        }
      : fallbackBanner;

  const handleShopNowClick = () => {
    if (banner.productLink) {
      // If it's a full URL, open in new tab
      if (banner.productLink.startsWith("http")) {
        window.open(banner.productLink, "_blank");
      } else {
        // If it's a relative path, navigate to it
        router.push(banner.productLink);
      }
    } else {
      // Fallback to skin care category
      router.push("/category/skin-care");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-10 overflow-hidden">
        <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
        <div className="border-b border-gray-200 w-full mt-6" />
      </div>
    );
  }

  // Show error state (still render with fallback data)
  if (error) {
    console.warn(
      "Failed to fetch crystal clear banners, using fallback data:",
      error
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-10 overflow-hidden">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-lg">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={banner.image}
            alt={banner.title}
            className="object-cover absolute inset-0 w-full h-full"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x400?text=Banner+Image";
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div>
                <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-3 sm:mb-4">
                  {banner.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  {banner.description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="large"
                onClick={handleShopNowClick}
                className="bg-transparent hover:bg-white/10 text-white border-white hover:scale-105 focus:ring-white/50 focus:ring-offset-transparent text-sm sm:text-base rounded"
              >
               Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 w-full mt-6" />
    </div>
  );
}
