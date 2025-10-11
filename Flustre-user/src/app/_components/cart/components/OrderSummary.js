"use client";

import React from "react";

export default function OrderSummary({
  title,
  subtotal,
  total,
  discount,
  couponDiscount,
  labels,
  open,
  onToggle,
}) {
  return (
    <div className="mt-3 sm:mt-6" style={{ overflow: "hidden" }}>
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-4 sm:px-4">
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
        <div className="flex flex-col items-center ml-2">
          <button
            type="button"
            aria-label={open ? labels.collapse : labels.expand}
            onClick={onToggle}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none",
              cursor: "pointer",
            }}
            tabIndex={0}
          >
            <svg
              className="w-5 h-5 text-gray-400 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                transform: open ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.2s",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-2 text-sm bg-white px-4 sm:px-6 py-2 sm:py-4">
          <div className="flex justify-between">
            <span
              className="text-[14px] sm:text=[16px]"
              style={{
                color: "#333",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                letterSpacing: "-0.32px",
              }}
            >
              {labels.subtotal}
            </span>
            <span
              className="text-[16px] sm:text-[18px]"
              style={{
                color: "#2B73B8",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "-0.36px",
              }}
            >
              ₹ {subtotal.toLocaleString()}
            </span>
          </div>
          <div
            className="flex flex-col border-t border-dashed border-gray-200"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              alignSelf: "stretch",
              padding: "12px 0 12px",
              borderTop: "1px dashed rgba(51, 51, 51, 0.10)",
            }}
          >
            <div className="flex justify-between w-full">
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "rgba(51, 51, 51, 0.70)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                {labels.total}
              </span>
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "#2B73B8",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                ₹ {total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "rgba(51, 51, 51, 0.70)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                {labels.discount}
              </span>
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "#2B73B8",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                -₹ {discount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "rgba(51, 51, 51, 0.70)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                {labels.delivery}
              </span>
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "var(--color-primary)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                {labels.freeShipping}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "rgba(51, 51, 51, 0.70)",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                {labels.couponDiscount}
              </span>
              <span
                className="text-[14px] sm:text-[16px]"
                style={{
                  color: "#2B73B8",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "-0.32px",
                }}
              >
                -₹ {couponDiscount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
