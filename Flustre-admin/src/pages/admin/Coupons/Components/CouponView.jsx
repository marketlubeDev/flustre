import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 flex items-center justify-between  text-[#3573BA]"
        style={{ background: "rgba(53, 115, 186, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#3573BA]">
          {title}{" "}
          <span className="text-[#000000]">
            {isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </span>
        </span>
      </button>
      {isOpen && <div className="px-4 py-4">{children}</div>}
    </div>
  );
};

const CouponView = ({ coupon, onToggleStatus }) => {
  const usageCount = coupon?.usedCount ?? 0;
  const usageLimit = coupon?.usageLimit ?? 0;
  const displayLimit =
    usageLimit && usageLimit > 0 ? `${usageCount}/${usageLimit}` : "-";

  // Format applicable to field
  const formatApplicableTo = () => {
    if (coupon?.applyTo === "category" && coupon?.categoryId) {
      return `Category - ${coupon.categoryId.name || ""}`;
    }
    if (coupon?.applyTo === "subcategory" && coupon?.subcategoryId) {
      return `Subcategory - ${coupon.subcategoryId.name || ""}`;
    }
    if (coupon?.applyTo === "product" && coupon?.productIds?.length > 0) {
      return `Product (${coupon.productIds.length} items)`;
    }
    return coupon?.applyTo || "All orders";
  };

  return (
    <div className="space-y-0">
      {/* Coupon Basics Section */}
      <CollapsibleSection title="Coupon basics" defaultOpen={true}>
        <div className="space-y-4">
          {/* Coupon Code */}
          <div>
            <p className="text-sm text-[#14141499] mb-0.5">Coupon code</p>
            <p className="text-xl font-[500] tracking-wide text-[#141414]">
              {coupon?.code}
            </p>
          </div>

          {/* Coupon Description */}
          {coupon?.description && (
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">
                Coupon description
              </p>
              <p className="text-sm text-[#141414]">{coupon.description}</p>
            </div>
          )}

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">Discount type</p>
              <p className="text-sm font-medium text-[#141414] capitalize">
                {coupon?.discountType || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">Discount value</p>
              <p className="text-sm font-medium text-[#141414]">
                {coupon?.discountType === "percentage"
                  ? `${coupon?.discountAmount}%`
                  : `₹${coupon?.discountAmount}`}
              </p>
            </div>
          </div>

          {/* Maximum Discount */}
          {coupon?.maxDiscount && (
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">
                Maximum discount
              </p>
              <p className="text-sm font-medium text-[#141414]">
                ₹ {coupon.maxDiscount}
              </p>
            </div>
          )}

          {/* Coupon Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#141414]">
                Coupon status
              </p>
              <p className="text-xs text-[#14141499] mt-1">
                {coupon?.isActive
                  ? "Currently active"
                  : "Enable to make it active"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onToggleStatus && onToggleStatus(coupon?._id, !coupon?.isActive)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                coupon?.isActive ? "bg-[#3573BA]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  coupon?.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Applicability & Validity Section */}
      <CollapsibleSection title="Applicability & Validity" defaultOpen={true}>
        <div className="space-y-4">
          {/* Applicable To */}
          <div>
            <p className="text-sm text-[#14141499] mb-0.5">Applicable to</p>
            <p className="text-sm font-medium text-[#141414]">
              {formatApplicableTo()}
            </p>
          </div>

          {/* Valid Until and Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">Valid until</p>
              <p className="text-sm font-medium text-[#141414]">
                {coupon?.expiryDate
                  ? new Date(coupon.expiryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#14141499] mb-0.5">Limit</p>
              <p className="text-sm font-medium text-gray-900">
                {displayLimit}
              </p>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default CouponView;
