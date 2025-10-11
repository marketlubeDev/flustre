"use client";

import React from "react";

export default function EmptyCartMessage({
  title,
  description,
  ctaText,
  onCta,
  onClose,
}) {
  return (
    <div
      className="flex flex-col items-center justify-start py-6 sm:py-12 px-4 sm:px-4"
      style={{
        minHeight: "calc(100vh - 160px)",
        height: "calc(100vh - 160px)",
        textAlign: "center",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <div
        className="mb-4"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#999" }}
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>

      <h3
        className="text-[16px] sm:text-[20px]"
        style={{
          color: "#333333",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          letterSpacing: "-0.4px",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <p
        className="text-[14px] sm:text-[16px]"
        style={{
          color: "rgba(51, 51, 51, 0.70)",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          letterSpacing: "-0.32px",
          marginBottom: "24px",
        }}
      >
        {description}
      </p>

      <button
        onClick={() => {
          if (onClose) onClose();
          if (onCta) onCta();
        }}
        style={{
          display: "flex",
          padding: "12px 24px",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          borderRadius: "4px",
          background: "var(--color-primary)",
          color: "#fff",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "normal",
          border: "none",
          transition: "background 0.2s",
          cursor: "pointer",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.background = "var(--color-primary)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.background = "var(--color-primary)")
        }
      >
        {ctaText}
      </button>
    </div>
  );
}
