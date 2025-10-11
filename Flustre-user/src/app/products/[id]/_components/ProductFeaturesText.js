"use client";

export default function ProductFeaturesText({ productType }) {
  const getTitle = (type) => {
    switch (type) {
      case "Hair Care":
        return "Advanced Hair Growth Technology";
      case "Skin Care":
        return "Advanced Anti-Aging Technology";
      case "Soap & Deodorants":
        return "Advanced Cleansing Technology";
      case "Body & Wash":
        return "Advanced Body Care Technology";
      case "Oral Care":
      case "Oral & Misc":
        return "Advanced Dental Care Technology";
      default:
        return "Advanced Anti-Aging Technology";
    }
  };

  const getDescription = (type) => {
    switch (type) {
      case "Hair Care":
        return "Our advanced hair growth technology utilizes cutting-edge formulations that penetrate deep into hair follicles to stimulate natural growth and strengthen hair from the roots. Each product is scientifically formulated to address specific hair concerns and promote healthy, vibrant hair.";
      case "Skin Care":
        return "Our advanced anti-aging technology combines revolutionary ingredients with proven dermatological science to target fine lines, wrinkles, and age spots. Each formulation is designed to work at the cellular level to promote skin regeneration and maintain youthful radiance.";
      case "Soap & Deodorants":
        return "Our advanced cleansing technology provides superior hygiene protection while maintaining skin's natural moisture balance. Each product is engineered with antibacterial properties and natural ingredients to ensure thorough cleansing without compromising skin health.";
      case "Body & Wash":
        return "Our advanced body care technology delivers comprehensive skin nourishment and protection through innovative formulations. Each product combines therapeutic ingredients with luxurious textures to provide complete body wellness and rejuvenation.";
      case "Oral Care":
      case "Oral & Misc":
        return "Our advanced dental care technology provides superior oral hygiene through innovative cleaning systems and protective formulas. Each product is designed to work together for complete oral health, from daily maintenance to specialized treatments.";
      default:
        return "Our advanced anti-aging technology combines revolutionary ingredients with proven dermatological science to target fine lines, wrinkles, and age spots. Each formulation is designed to work at the cellular level to promote skin regeneration and maintain youthful radiance.";
    }
  };

  return (
    <div className="flex flex-col justify-center items-start max-w-md w-full md:pl-8 sm:pl-6">
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
        {getTitle(productType)}
      </div>
      <p className="text-gray-700 text-base self-start">
        {getDescription(productType)}
      </p>
    </div>
  );
} 