import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CouponBasicsFields = ({
  formData,
  setFormData,
  basicsOpen,
  setBasicsOpen,
  handleDiscountTypeChange,
  handleDiscountAmountChange,
}) => {
  return (
    <div className="">
      <button
        type="button"
        onClick={() => setBasicsOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(109, 13, 38, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#6D0D26]">
          Coupon basics{" "}
          <span className="text-[#000000]">
            {basicsOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </span>
        </span>
      </button>
      {basicsOpen && (
        <div className="p-4 space-y-4">
          {/* Coupon code */}
          <div className="">
            <div>
              <label className="block text-sm font-medium text-[#141414]">
                Coupon code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="mt-1 block w-full rounded-[0.7rem] border border-gray-300 px-3 py-1 placeholder:text-sm"
                placeholder="Enter coupon code"
                required
              />
            </div>
          </div>

          {/* Coupon description */}
          <div className="">
            <div>
              <label className="block text-sm font-medium text-[#141414]">
                Coupon description
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-[0.7rem] border border-gray-300 px-3  py-1 placeholder:text-sm pr-12"
                  placeholder="Enter coupon description"
                  maxLength={40}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {formData.description?.length || 0}/40
                </div>
              </div>
            </div>
          </div>

          {/* Discount type and value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#141414]">
                Discount type
              </label>
              <select
                value={formData.discountType}
                onChange={handleDiscountTypeChange}
                className="mt-1 block w-full rounded-[0.7rem] border border-gray-300 px-3  py-1 placeholder:text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#141414]">
                Discount value
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={handleDiscountAmountChange}
                  className="mt-1 block w-full rounded-[0.7rem] border border-gray-300 px-3  py-1 placeholder:text-sm pr-8"
                  placeholder={
                    formData.discountType === "percentage"
                      ? "Enter a value between 0-100"
                      : "Enter discount amount"
                  }
                  min="0"
                  max={
                    formData.discountType === "percentage" ? "100" : undefined
                  }
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {formData.discountType === "percentage" ? "%" : "AED"}
                </div>
              </div>
            </div>
          </div>

          {/* Maximum discount */}
          <div className="">
            <div>
              <label className="block text-sm font-medium text-[#141414]">
                Maximum discount
              </label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, maxDiscount: e.target.value })
                }
                className="mt-1 block w-full rounded-[0.7rem] border border-gray-300 px-3  py-1 placeholder:text-sm"
                placeholder="e.g., AED 100"
                min="0"
              />
            </div>
          </div>

          {/* Coupon status */}
          <div className="">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-[#141414]">
                  Coupon status
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Enable to make it active
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  formData.isActive ? "bg-[#6D0D26]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponBasicsFields;
