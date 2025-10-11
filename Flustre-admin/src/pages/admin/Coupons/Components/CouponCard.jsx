import React from "react";
import { toast } from "react-toastify";

const CouponCard = ({
  coupons,
  onView,
  onEdit,
  onDelete,
  selectedIds = new Set(),
  onToggleSelect,
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {coupons.map((coupon) => {
          const isActive = new Date(coupon.expiryDate) > new Date();
          const discountLabel =
            coupon.discountType === "percentage"
              ? `${coupon.discountAmount}% OFF`
              : `₹${coupon.discountAmount} OFF`;
          const usageLimit = coupon?.usageLimit ?? null;
          const usageCount = coupon?.usedCount ?? null;
          const displayLimit =
            usageLimit && usageLimit > 0 ? `${usageCount ?? 0}/${usageLimit}` : "-";
          const isSelected = selectedIds?.has?.(coupon._id);

          return (
            <div
              key={coupon._id}
              className="relative coupon-ticket group overflow-hidden cursor-pointer"
              onClick={() => onView && onView(coupon)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onView && onView(coupon);
              }}
            >
              <div className="coupon-ticket__scallops" />
              <div className="coupon-ticket__divider" />
              <div className="coupon-ticket__right">
                <span
                  className={`coupon-ticket__off transition-opacity duration-200 ${
                    isSelected ? "opacity-0" : "group-hover:opacity-0"
                  }`}
                >
                  {discountLabel}
                </span>
                {/* Checkbox shown in the same area; positioned top-center */}
                <div
                  className={`absolute top-3 left-1/2 -translate-x-1/2 transition-opacity duration-200 z-10 ${
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label="Select coupon"
                    className="coupon-ticket__check grid place-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect && onToggleSelect(coupon._id);
                    }}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6D0D26"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-5 pr-24">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-xs text-[#6D0D26]"
                      style={{ opacity: 0.6 }}
                    >
                      Coupon code
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-[#6D0D26] tracking-wide">
                        {coupon.code}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          toast.success("Coupon code copied");
                        }}
                        className="text-[#6D0D26] hover:text-[#6D0D26]/80 cursor-pointer"
                        title="Copy code"
                        aria-label="Copy coupon code"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5.25 5.5C5.80228 5.5 6.25 5.05228 6.25 4.5V3.25C6.25 3.05109 6.32902 2.86032 6.46967 2.71967C6.61032 2.57902 6.80109 2.5 7 2.5H16C16.1989 2.5 16.3897 2.57902 16.5303 2.71967C16.671 2.86032 16.75 3.05109 16.75 3.25V13.75C16.75 13.9489 16.671 14.1397 16.5303 14.2803C16.3897 14.421 16.1989 14.5 16 14.5H14.75C14.1977 14.5 13.75 14.9477 13.75 15.5V16.75C13.75 17.164 13.4125 17.5 12.9948 17.5H4.00525C3.90635 17.5006 3.8083 17.4816 3.71674 17.4442C3.62519 17.4068 3.54192 17.3517 3.47174 17.282C3.40156 17.2123 3.34584 17.1294 3.30779 17.0381C3.26974 16.9468 3.2501 16.8489 3.25 16.75L3.25225 6.25C3.25225 5.836 3.58975 5.5 4.0075 5.5H5.25ZM5.752 7C5.19981 7 4.75214 7.44756 4.752 7.99975L4.75025 14.9998C4.75011 15.5521 5.19787 16 5.75025 16H11.25C11.8023 16 12.25 15.5523 12.25 15V8C12.25 7.44772 11.8023 7 11.25 7H5.752ZM7.75 4.75C7.75 5.16421 8.08579 5.5 8.5 5.5H12.75C13.3023 5.5 13.75 5.94772 13.75 6.5V12.25C13.75 12.6642 14.0858 13 14.5 13C14.9142 13 15.25 12.6642 15.25 12.25V5C15.25 4.44772 14.8023 4 14.25 4H8.5C8.08579 4 7.75 4.33579 7.75 4.75Z"
                            fill="#6D0D26"
                            fillOpacity="0.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-xs text-[#6D0D26] underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(coupon);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600 underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(coupon._id, coupon.code);
                      }}
                    >
                      Delete
                    </button>
                  </div> */}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[#6D0D26]" style={{ opacity: 0.6 }}>
                      Valid till
                    </p>
                    <p className="font-medium text-[#6D0D26]">
                      {new Date(coupon.expiryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6D0D26]" style={{ opacity: 0.6 }}>
                      Limit
                    </p>
                    <p className="font-medium text-gray-900">{displayLimit}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponCard;
