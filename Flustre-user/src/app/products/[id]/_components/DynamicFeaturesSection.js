"use client";

import Image from "next/image";

export default function DynamicFeaturesSection({ product }) {
  const featuresSections = product?.featuresSections || [];

  if (!featuresSections || featuresSections.length === 0) {
    return null; // Don't render anything if no features sections
  }

  const renderSection = (section, index) => {
    const {
      layout = "banner",
      imagePosition = "right",
      mediaType = "image",
      mediaUrl,
      title,
      description,
    } = section;

    // Banner layout - full width image/video
    if (layout === "banner") {
      return (
        <div key={index} className="my-8">
          {index === 0 && (
            <>
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
            </>
          )}

          <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white flex justify-center items-center">
            {mediaType === "video" ? (
              <video
                src={mediaUrl}
                className="w-full object-cover object-center h-48 sm:h-64 md:h-80 lg:h-[600px]"
                controls
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={mediaUrl}
                alt={title || "Product Feature"}
                width={1500}
                height={500}
                className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[500px]"
              />
            )}
          </div>
        </div>
      );
    }

    // Split layout - text and image side by side
    if (
      layout === "split" ||
      imagePosition === "left" ||
      imagePosition === "right"
    ) {
      const isImageLeft = imagePosition === "left";

      return (
        <div key={index} className="my-8">
          <div className="space-y-8">
            <div
              className={`w-full rounded-lg overflow-hidden bg-white flex ${
                isImageLeft
                  ? "flex-col-reverse md:flex-row"
                  : "flex-col md:flex-row"
              } items-center justify-center gap-8`}
            >
              {/* Text Content */}
              <div
                className={`flex-1 flex flex-col justify-center items-start max-w-md w-full mb-6 md:mb-0 ${
                  isImageLeft ? "order-2 md:order-2" : "order-1 md:order-1"
                }`}
              >
                {title && (
                  <div
                    className="mb-4 font-semibold text-gray-900"
                    style={{
                      color: "#333",
                      fontSize: "clamp(18px, 4.5vw, 24px)",
                      fontStyle: "normal",
                      lineHeight: "normal",
                      letterSpacing: "-0.24px",
                    }}
                  >
                    {title}
                  </div>
                )}
                {description && (
                  <div className="text-gray-700 text-sm sm:text-base">
                    {description}
                  </div>
                )}
              </div>

              {/* Media Content */}
              <div
                className={`flex-1 flex justify-center items-center w-full ${
                  isImageLeft ? "order-1 md:order-1" : "order-2 md:order-2"
                }`}
              >
                {mediaType === "video" ? (
                  <video
                    src={mediaUrl}
                    className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[350px]"
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={mediaUrl}
                    alt={title || "Product Feature"}
                    width={1500}
                    height={350}
                    className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[350px]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Video only layout
    if (layout === "video" || mediaType === "video") {
      return (
        <div key={index} className="my-8">
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white relative">
            <video
              src={mediaUrl}
              className="w-full object-cover object-center h-48 sm:h-64 md:h-80 lg:h-[600px]"
              controls
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );
    }

    // Default: banner layout
    return (
      <div key={index} className="my-8">
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white flex justify-center items-center">
          <Image
            src={mediaUrl}
            alt={title || "Product Feature"}
            width={1500}
            height={500}
            className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[500px]"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {featuresSections.map((section, index) => renderSection(section, index))}
    </>
  );
}
