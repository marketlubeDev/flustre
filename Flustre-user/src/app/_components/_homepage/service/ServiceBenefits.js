"use client";

import Image from "next/image";
import { serviceBenefits } from "../../../../lib/data";
 

export default function ServiceBenefits() {

  return (
    <>
      <section 
        className="py-8 md:py-12 overflow-hidden bg-[#F4F8FB]"
        aria-label="Service Benefits"
      >
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-[300px]">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {serviceBenefits.map((benefit, index) => (
              <div key={benefit.title || index} className="flex items-center">
                {/* Service Benefit Item */}
                <div className="flex flex-col items-center gap-2 md:gap-3 min-w-0">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <Image
                      src={benefit.icon}
                      alt={benefit.alt}
                      fill
                      sizes="(max-width: 768px) 48px, 64px"
                      className="object-contain"
                      priority={index < 3} // Prioritize first 3 images
                    />
                  </div>
                  <h3 
                    className="text-center text-[#333] font-semibold leading-tight tracking-[-0.36px] text-[clamp(10px,1.4vw,14px)] w-[clamp(70px,18vw,180px)]"
                  >
                    {benefit.title || benefit.titleKey}
                  </h3>
                </div>

                {/* Divider - Show between items, hidden on mobile wrap */}
                {index < serviceBenefits.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center mx-4 md:mx-6 lg:mx-8">
                    <div 
                      className="w-px bg-gray-300 h-20"
                      role="separator"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom border */}
      <div 
        className="border-b border-black/10 w-[85%] mt-6 mx-auto"
        role="separator"
        aria-hidden="true"
      />
    </>
  );
}