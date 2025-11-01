"use client";

import Image from "next/image";

export default function ProductFeaturesBanner({ product }) {
  // Use API data if available, otherwise use static fallback
  const bannerSections = product?.featuresSections?.filter(
    (section) => section.layout === "banner"
  ) || [
    {
      id: 1,
      title: "Premium Quality Materials",
      mediaUrl:
        "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/feature-banner1+(1).jpg",
      alt: "Premium Quality Materials",
    },
  ];

  if (!bannerSections || bannerSections.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <hr className="mb-6" style={{ borderColor: "#D1D5DB" }} />
      <div
        className="mb-4 font-semibold text-gray-900"
        style={{
          color: "#333",
          fontSize: "clamp(20px, 4.5vw, 24px)",
          fontStyle: "normal",
          lineHeight: "normal",
          letterSpacing: "-0.24px",
        }}
      >
        Product Features
      </div>

      <div className="space-y-6">
        {bannerSections.map((section, index) => (
          <div
            key={section.id || index}
            className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white flex justify-center items-center"
          >
            <Image
              src={section.mediaUrl || section.imageUrl}
              alt={section.title || section.alt || "Product Feature"}
              width={1500}
              height={500}
              className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[500px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
