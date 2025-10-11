"use client";

import React from "react";

export default function CartSidebarHeader({ onClose, title }) {
  return (
    <div
      className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 bg-white"
      style={{
        backgroundColor: "white",
        height: "80px",
        minHeight: "80px",
        maxHeight: "80px",
        flexShrink: 0,
      }}
    >
      <div className="flex items-center">
        <button
          onClick={onClose}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          style={{ cursor: "pointer" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2
          className="font-[600] text-[18px] sm:text-[22px]"
          style={{
            color: "#333333",
            fontStyle: "normal",
            lineHeight: "normal",
            letterSpacing: "-0.44px",
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
