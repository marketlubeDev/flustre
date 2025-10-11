"use client";

import React from "react";

export default function CouponSection({ title, description, onOpen }) {
  return (
    <div className="mt-3 sm:mt-6 bg-[#F5F5F5]" style={{ overflow: "hidden" }}>
      <h3
        className="mb-2 sm:mb-3 px-4 sm:px-4 text-[16px] sm:text-[20px]"
        style={{
          color: "#333333",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h3>
      <button
        onClick={onOpen}
        className="flex items-center justify-between p-2 sm:p-3 bg-white border border-gray-200 px-4 sm:px-4 w-full hover:bg-gray-50 transition-colors cursor-pointer"
        style={{ cursor: "pointer" }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
            <img src="/coupon.svg" alt="Coupon" className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-[12px] sm:text-sm font-medium text-gray-800">
              {description.title}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-600">
              {description.subtitle}
            </p>
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
