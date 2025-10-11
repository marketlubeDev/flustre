"use client";

import React from "react";

export default function ItemsHeader({ title, count }) {
  return (
    <div
      className="flex justify-between items-center mb-2 sm:mb-4 px-4 sm:px-4"
      style={{ overflow: "hidden" }}
    >
      <h3
        className="text-[16px] sm:text-[20px]"
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
      <span
        className="text-[12px] sm:text-[14px]"
        style={{
          color: "rgba(51, 51, 51, 0.60)",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          letterSpacing: "-0.28px",
        }}
      >
        {count}
      </span>
    </div>
  );
}
