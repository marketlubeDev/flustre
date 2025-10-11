'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Button from '@/app/_components/common/Button';
import BeautyCollectionGrid from './BeautyCollectionGrid';
 

export default function EngineeredBy7Hz() {
  const router = useRouter();

  const handleShopAllClick = () => {
    router.push('/products');
  };

  return (
    <>
      <div className="py-6 md:py-8 lg:py-10 container mx-auto px-4 md:px-8 lg:px-10 xl:px-8 2xl:px-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left Section - Text Content */}
          <div className="flex-1 lg:max-w-[400px]">
            <h2 className="mb-4 sm:mb-6 text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-semibold leading-normal tracking-[-0.56px] sm:tracking-[-0.64px] md:tracking-[-0.72px] lg:tracking-[-0.8px] text-[#333]">
              Handpicked Home Furnishings
            </h2>
            <p className="mb-6 sm:mb-8 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-medium leading-normal tracking-[-0.14px] sm:tracking-[-0.16px] md:tracking-[-0.17px] lg:tracking-[-0.18px] text-[rgba(51,51,51,0.8)]">
              Premium quality furniture for comfortable, stylish living. Limited time offer.
              Experience the transformation.
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={handleShopAllClick}
              className="rounded-[4px] hover:bg-[#2B73B8] text-xs sm:text-sm md:text-base lg:text-base"
            >
              Shop all
            </Button>
          </div>

          {/* Right Section - Beauty Collection Grid */}
          <BeautyCollectionGrid />
        </div>
      </div>
    </>
  );
}