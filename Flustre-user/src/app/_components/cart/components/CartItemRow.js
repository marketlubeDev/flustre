"use client";

import React from "react";

export default function CartItemRow({
  item,
  index,
  isLast,
  quantities,
  updateQuantity,
  removeItem,
  renderMeta,
  renderPrice,
}) {
  return (
    <div
      key={index}
      className="relative flex w-full"
      style={{
        display: "flex",
        paddingBottom: "12px",
        alignItems: "center",
        gap: "12px",
        alignSelf: "stretch",
        paddingTop: "12px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderBottom: !isLast ? "1px dashed rgba(209, 213, 219, 1)" : "none",
      }}
    >
      <button
        onClick={() => removeItem(item.id)}
        className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
        style={{ cursor: "pointer" }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        className="bg-white rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          width: "64px",
          height: "64px",
          aspectRatio: "1/1",
          marginRight: "16px",
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div className="flex-1 min-w-0 w-full">
        <h4
          className="text-[14px] sm:text-[16px] font-semibold mb-1"
          style={{
            overflow: "hidden",
            color: "#333",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "140%",
            letterSpacing: "-0.32px",
            alignSelf: "stretch",
            marginBottom: "2px",
          }}
          title={item.name}
        >
          {item.name}
        </h4>

        {renderMeta?.(item)}

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs text-gray-600">Qty :</span>
            <div
              style={{
                display: "flex",
                height: "32px",
                padding: "0 3px",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                borderRadius: "4px",
                border: "1px solid var(--color-primary)",
                background: "#F7F3F4",
                minWidth: "72px",
                maxWidth: "80px",
                position: "relative",
              }}
            >
              <button
                onClick={() =>
                  updateQuantity(
                    item.id,
                    (quantities[item.id] || item.quantity || 1) - 1
                  )
                }
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-primary)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  borderRadius: "3px",
                  lineHeight: 1,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#E6F9ED")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                -
              </button>
              <span
                style={{
                  padding: "0 2px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  minWidth: "20px",
                  textAlign: "center",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {String(quantities[item.id] || item.quantity || 1).padStart(
                  2,
                  "0"
                )}
              </span>
              <button
                onClick={() =>
                  updateQuantity(
                    item.id,
                    (quantities[item.id] || item.quantity || 1) + 1
                  )
                }
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-primary)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  borderRadius: "3px",
                  lineHeight: 1,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#E6F9ED")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                +
              </button>
            </div>
          </div>

          {renderPrice?.(item)}
        </div>
      </div>
    </div>
  );
}
