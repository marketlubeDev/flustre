"use client";

import Image from "next/image";

export default function CouponsSection({
  coupons,
  visibleCoupons,
  remainingCoupons,
  showMoreCoupons,
  setShowMoreCoupons,
}) {
  if (!Array.isArray(coupons) || coupons.length === 0) return null;

  const baseCardStyle = {
    borderRadius: "4px",
    borderStyle: "dashed",
    borderColor: "#2B73B8",
    background: "#F7F3F4",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const CouponCard = ({
    coupon,
    imgClass,
    minWidth,
    maxWidth,
    className = "",
  }) => (
    <div
      className={`rounded flex items-center gap-1 md:gap-2 flex-shrink-0 border-1 ${className}`}
      style={{ ...baseCardStyle, minWidth, maxWidth }}
    >
      <div className="flex items-center justify-center flex-shrink-0">
        <Image
          src="/coupon.svg"
          alt="coupon"
          width={20}
          height={20}
          className={imgClass}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-333333 text-xs md:text-sm truncate">
          {coupon.code}
        </h4>
        <p
          className="text-xs truncate"
          style={{ color: "rgba(51, 51, 51, 0.80)" }}
        >
          {coupon.description}
        </p>
      </div>
    </div>
  );

  const renderList = (items, visibilityClass, size) => {
    const sizeConfig = {
      sm: {
        imgClass: "w-4 h-4 md:w-5 md:h-5",
        minWidth: "100px",
        maxWidth: "140px",
        padding: "px-2 py-2 md:px-3 md:py-3",
      },
      md: {
        imgClass: "w-5 h-5",
        minWidth: "140px",
        maxWidth: "200px",
        padding: "px-3 py-3",
      },
      xl: {
        imgClass: "w-5 h-5",
        minWidth: "200px",
        maxWidth: "280px",
        padding: "px-4 py-3",
      },
    };
    const cfg = sizeConfig[size] || sizeConfig.sm;

    return items.map((c, idx) => (
      <CouponCard
        key={`${visibilityClass}-${idx}`}
        coupon={c}
        imgClass={cfg.imgClass}
        minWidth={cfg.minWidth}
        maxWidth={cfg.maxWidth}
        className={`${visibilityClass} ${cfg.padding}`}
      />
    ));
  };

  return (
    <>
      {/* Coupon Section */}
      <div className="mb-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            {/* First two coupons on small screens */}
            {renderList(visibleCoupons.slice(0, 2), "", "sm")}

            {/* Remaining coupons on md+ screens (not xl) */}
            {renderList(remainingCoupons, "hidden md:flex xl:hidden", "md")}

            {/* Remaining coupons on xl when expanded */}
            {showMoreCoupons &&
              renderList(remainingCoupons, "hidden xl:flex", "xl")}

            {/* Show "Show less" button inline with coupons on xl screens */}
            {showMoreCoupons && (
              <button
                className="text-sm font-medium hover:underline cursor-pointer hidden xl:block self-center ml-3"
                style={{ color: "var(--color-primary)" }}
                onClick={() => setShowMoreCoupons(false)}
              >
                Show less
              </button>
            )}
          </div>

          {/* Show "+1 more" on small screens and xl screens */}
          {coupons.length > 2 && !showMoreCoupons && (
            <button
              className="text-sm font-medium hover:underline whitespace-nowrap cursor-pointer self-start md:hidden xl:block"
              style={{ color: "var(--color-primary)" }}
              onClick={() => setShowMoreCoupons(true)}
            >
              +1 more
            </button>
          )}
        </div>
      </div>

      {/* Show remaining coupons for small and md screens when expanded */}
      {showMoreCoupons && coupons.length > 2 && (
        <>
          <div className="flex flex-wrap items-center gap-3 mt-3 xl:hidden">
            {renderList(coupons.slice(2), "", "sm")}
          </div>
          <div className="mt-2 xl:hidden">
            <button
              className="text-sm font-medium hover:underline cursor-pointer"
              style={{ color: "var(--color-primary)" }}
              onClick={() => setShowMoreCoupons(false)}
            >
              Show less
            </button>
          </div>
        </>
      )}
    </>
  );
}
