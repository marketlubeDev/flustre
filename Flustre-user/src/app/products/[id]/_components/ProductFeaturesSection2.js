"use client";

import Image from "next/image";

export default function ProductFeaturesSection2() {
  // Static feature sections with image on left
  const staticFeatureSections = [
    {
      id: 1,
      title: "Eco-Friendly Design",
      description: "Designed with sustainability in mind, our products are made from environmentally friendly materials that reduce your carbon footprint.",
      imageUrl: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/feature-banner4+(1).jpg",
      alt: "Eco-Friendly Design"
    },
   
  ];

  return (
    <div className="my-8">
      <div className="space-y-8">
        {staticFeatureSections.map((section) => (
          <div
            key={section.id}
            className="w-full rounded-lg overflow-hidden bg-white flex flex-col-reverse md:flex-row items-center justify-center gap-8"
          >
            {/* Left: Product Image */}
            <div className="flex-1 flex justify-center items-center w-full">
              <Image
                src={section.imageUrl}
                alt={section.alt}
                width={1500}
                height={350}
                className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[350px]"
              />
            </div>
            {/* Right: Text and Features */}
            <div className="flex-1 flex flex-col justify-center items-start max-w-md w-full mb-6 md:mb-0">
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
              <div className="text-gray-700 text-sm sm:text-base">
                {section.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
