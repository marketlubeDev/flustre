"use client";
import { serviceBenefits } from "../../../../lib/data";
import Image from "next/image";

export default function ProductServiceBenefits() {
  // Filter to show only the three specific benefits based on titleKey
  const filteredBenefits = serviceBenefits.filter(
    (benefit) =>
      benefit.titleKey === "Secured Payment" ||
      benefit.titleKey === "Delivery" ||
      benefit.titleKey === "24x7 Support"
  );

  return (
    <div className="mb-6 px-2 sm:px-0">
      <div className="flex flex-row items-center justify-center gap-6 sm:gap-4 md:gap-12 lg:gap-8 xl:gap-6 w-full mx-auto max-w-[520px]">
        {filteredBenefits.map((benefit, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            {/* Service Benefit Item */}
            <div className="flex flex-col items-center gap-4 sm:gap-2 lg:gap-3">
              <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-26 lg:h-26 xl:w-28 xl:h-28">
                <Image
                  src={benefit.icon}
                  alt={benefit.alt}
                  width={56}
                  height={56}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-13 lg:h-13 xl:w-14 xl:h-14"
                />
              </div>
              <span
                className="text-center text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base font-medium"
                style={{
                  color: "#333",
                  lineHeight: "1.2",
                  letterSpacing: "-0.24px",
                  width: "clamp(90px, 14vw, 200px)",
                  maxWidth: "200px",
                  minHeight: "2.4em",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {benefit.alt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
