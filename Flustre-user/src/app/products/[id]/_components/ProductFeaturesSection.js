"use client";

import Image from "next/image";

export default function ProductFeaturesSection({ product }) {
  // Use API data if available, otherwise use static fallback
  const featureSections = product?.featuresSections?.filter(
    (section) => section.layout === "split" && section.imagePosition === "right"
  ) || [
    {
      id: 1,
      title: "Advanced Technology",
      description: "Experience cutting-edge technology that delivers superior performance and reliability for all your needs.",
      mediaUrl: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/feature-banner3+(1).jpg",
      alt: "Advanced Technology"
    },
  ];

  if (!featureSections || featureSections.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="space-y-8">
        {featureSections.map((section, index) => (
          <div
            key={section.id || index}
            className="w-full rounded-lg overflow-hidden bg-white flex flex-col md:flex-row items-center justify-center gap-8"
          >
            {/* Left: Text and Features */}
            <div className="flex-1 flex flex-col justify-center items-start max-w-md w-full mb-6 md:mb-0">
              {section.title && (
                <div
                  className="mb-4 font-semibold text-gray-900"
                  style={{
                    color: "#333",
                    fontSize: "clamp(18px, 4.5vw, 24px)",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    letterSpacing: "-0.24px",
                    leadingTrim: "both",
                    textEdge: "cap",
                  }}
                >
                  {section.title}
                </div>
              )}
              {section.description && (
                <div className="text-gray-700 text-sm sm:text-base">
                  {section.description}
                </div>
              )}
            </div>
            {/* Right: Product Image */}
            <div className="flex-1 flex justify-center items-center w-full">
              <Image
                src={section.mediaUrl || section.imageUrl}
                alt={section.title || section.alt || "Product Feature"}
                width={1500}
                height={350}
                className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[350px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
