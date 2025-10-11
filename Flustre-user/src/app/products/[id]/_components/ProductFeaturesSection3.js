"use client";

import Image from "next/image";

export default function ProductFeaturesSection3({ productType }) {
  const getTitle = () => {
    switch (productType) {
      case "Hair Care":
        return (
          <>
            Expert Hair Care
            <br />
            Solutions & Benefits
          </>
        );
      case "Skin Care":
        return (
          <>
            Professional Skincare
            <br />
            Benefits & Results
          </>
        );
      case "Soap & Deodorants":
        return (
          <>
            Natural Hygiene
            <br />
            Benefits & Protection
          </>
        );
      case "Body & Wash":
        return (
          <>
            Complete Body Care
            <br />
            Benefits & Wellness
          </>
        );
      case "Oral Care":
      case "Oral & Misc":
        return (
          <>
            Advanced Oral Care
            <br />
            Benefits & Health
          </>
        );
      default:
        return (
          <>
            Premium Solutions
            <br />
            Benefits & Quality
          </>
        );
    }
  };

  const getFeatures = () => {
    switch (productType) {
      case "Hair Care":
        return [
          "Advanced hair care technology for all hair types and concerns",
          "Clinically proven ingredients that promote healthy hair growth",
          "Professional-grade formulations for salon-quality results",
          "Long-lasting effects with regular use and proper care"
        ];
      case "Skin Care":
        return [
          "Dermatologist-approved formulas for various skin concerns",
          "Advanced active ingredients for visible skin improvements",
          "Gentle yet effective solutions for sensitive skin types",
          "Proven results with consistent daily application"
        ];
      case "Soap & Deodorants":
        return [
          "Natural ingredients for gentle yet effective cleansing",
          "Long-lasting protection and freshness throughout the day",
          "Antibacterial properties for comprehensive hygiene",
          "Eco-friendly formulations that are kind to your skin"
        ];
      case "Body & Wash":
        return [
          "Complete body care solutions for total wellness",
          "Luxurious textures that nourish and protect skin",
          "Therapeutic benefits for relaxation and rejuvenation",
          "Comprehensive care for all body areas and concerns"
        ];
      case "Oral Care":
      case "Oral & Misc":
        return [
          "Advanced dental care technology for optimal oral health",
          "Comprehensive protection against cavities and gum disease",
          "Fresh breath and long-lasting cleanliness",
          "Professional-grade results for daily dental care"
        ];
      default:
        return [
          "Premium quality ingredients for exceptional results",
          "Scientifically formulated for maximum effectiveness",
          "Safe and reliable solutions for daily use",
          "Proven performance backed by quality assurance"
        ];
    }
  };

  const getImageSrc = () => {
    switch (productType) {
      case "Hair Care":
        return "/haircarebanner3.png";
      case "Skin Care":
        return "/skincarebanner3.png";
      case "Soap & Deodorants":
        return "/soapbanner3.png";
      case "Body & Wash":
        return "/body&washbanner3.png";
      case "Oral Care":
      case "Oral & Misc":
        return "/oral&miscbanner3.png";
      default:
        return "/skincarebanner3.png";
    }
  };

  return (
    <div className="my-8">
      <div className="w-full rounded-lg overflow-hidden bg-white flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left: Text and Bullet Points */}
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
            {getTitle()}
          </div>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm sm:text-base">
            {getFeatures().map((feature, index) => (
              <li key={index} className="leading-relaxed">
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right: Product Image */}
        <div className="flex-1 flex justify-center items-center w-full">
          <Image
            src={getImageSrc()}
            alt={`${productType} Benefits`}
            width={1500}
            height={350}
            className="w-full max-w-[1500px] object-cover object-center h-48 sm:h-56 md:h-72 lg:h-[350px]"
          />
        </div>
      </div>
    </div>
  );
} 