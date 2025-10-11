"use client";

import Image from "next/image";

export default function ProductImageSection({ productType }) {
  const getImageSource = (type) => {
    switch (type) {
      case "Hair Care":
        return "/haircarebanner3.png";
      case "Skin Care":
        return "/skincarebanner3.png";
      case "Soap & Deodorants":
        return "/soapbanner4.png";
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
    <div className="flex justify-start items-center w-full">
      <Image
        src={getImageSource(productType)}
        alt={`${productType} Advanced Features`}
        width={500}
        height={300}
        className="object-contain"
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
} 