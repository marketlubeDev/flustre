"use client";

import React from "react";
import Button from "@/app/_components/common/Button";

export default function BottomActionBar({
  hasItems,
  totalPayable,
  viewLabel,
  detailsLabel,
  onCheckout,
}) {
  return (
    <div
      className="border-t border-gray-200 py-4 px-4 sm:py-6 sm:px-3 bg-white fixed sm:relative bottom-0 sm:bottom-auto left-0 sm:left-auto right-0 sm:right-auto h-[80px] sm:h-[100px]"
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "80px",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {!hasItems ? (
        <div style={{ display: "none" }}></div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-[16px] sm:text-[20px]"
              style={{
                color: "#2B73B8",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "-0.4px",
              }}
            >
              ₹ {totalPayable.toLocaleString()}
            </div>
            <button
              className="text-[12px] sm:text-[14px]"
              style={{
                color: "rgba(51, 51, 51, 0.70)",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                letterSpacing: "-0.28px",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#333")}
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "rgba(51, 51, 51, 0.7)")
              }
            >
              {viewLabel} {detailsLabel}
            </button>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={onCheckout}
            className="font-medium sm:w-[260px] text-[14px] sm:text-[16px]"
            style={{ borderRadius: "4px" }}
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
