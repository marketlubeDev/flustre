"use client";

import Image from "next/image";

export default function CategoryFeaturesSection({ productType }) {
  const getTitle = () => {
    switch (productType) {
      case "Hair Care":
        return (
          <>
            Professional Hair Care <br />
            Solutions
          </>
        );
      case "Skin Care":
        return (
          <>
            Advanced Skincare <br />
            Technology
          </>
        );
      case "Soap & Deodorants":
        return (
          <>
            Natural Hygiene <br />
            Solutions
          </>
        );
      case "Body & Wash":
        return (
          <>
            Premium Body Care <br />
            Technology
          </>
        );
      case "Oral Care":
      case "Oral & Misc":
        return (
          <>
            Advanced Dental Care <br />
            Technology
          </>
        );
      default:
        return (
          <>
            Detachable High-Purity OFC <br />
            Cable
          </>
        );
    }
  };

  const getFeatures = () => {
    switch (productType) {
      case "Hair Care":
        return [
          "Our professional hair care solutions are designed to address specific hair concerns with scientifically proven formulations that deliver visible results.",
          "Each product is crafted with premium ingredients and advanced technology to provide salon-quality results in the comfort of your home."
        ];
      case "Skin Care":
        return [
          "Our advanced skincare technology combines cutting-edge dermatological science with natural ingredients to target specific skin concerns effectively.",
          "Each formulation is designed to work harmoniously with your skin's natural processes, promoting healthy, radiant, and youthful-looking skin."
        ];
      case "Soap & Deodorants":
        return [
          "Our natural hygiene solutions provide thorough cleansing while being gentle on your skin and environmentally friendly for daily use.",
          "Each product is crafted with carefully selected natural ingredients to ensure effective hygiene without compromising skin health."
        ];
      case "Body & Wash":
        return [
          "Our premium body care technology delivers comprehensive skin nourishment and protection through innovative formulations and luxurious textures.",
          "Each product combines therapeutic ingredients with indulgent formulations to provide complete body wellness and rejuvenation."
        ];
      case "Oral Care":
      case "Oral & Misc":
        return [
          "Our advanced dental care technology provides superior oral hygiene through innovative cleaning systems and protective formulas.",
          "Each product is designed to work together for complete oral health, from daily maintenance to specialized treatments."
        ];
      default:
        return [
          "Choose your cable termination: 3.5mm or Type-C (with mic). You can now choose the termination and choose design during your purchase.",
          "The advantage of a detachable termination is you can pair these with a preferred DAC & Amp or cable for further performance if you ever wanted to in the near future."
        ];
    }
  };

  const getImageSrc = () => {
    switch (productType) {
      case "Hair Care":
        return "/haircarebanner2.png";
      case "Skin Care":
        return "/skincarebanner2.png";
      case "Soap & Deodorants":
        return "/soapbanner2.png";
      case "Body & Wash":
        return "/body&washbanner2.png";
      case "Oral Care":
      case "Oral & Misc":
        return "/oral&miscbanner2.png";
      default:
        return "/productfeaturesimage5.png";
    }
  };

  return (
    <div className="my-8">
      <div className="w-full rounded-lg overflow-hidden bg-white flex flex-col md:flex-row items-stretch justify-center py-8">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-md w-full md:pr-8 mb-6 md:mb-0">
          <div
            className="mb-4 self-start"
            style={{
              color: "#333",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              letterSpacing: "-0.24px",
              leadingTrim: "both",
              textEdge: "cap",
            }}
          >
            {getTitle()}
          </div>
          <ul className="list-disc pl-5 text-gray-700 text-base self-start space-y-2">
            {getFeatures().map((feature, index) => (
              <li key={index}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Product Image */}
        <div className="flex-1 flex justify-end items-center w-full">
          <Image
            src={getImageSrc()}
            alt={`${productType} Advanced Features`}
            width={500}
            height={300}
            className="object-contain"
            style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
} 