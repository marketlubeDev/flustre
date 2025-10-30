import React from "react";
import { Modal } from "antd";

const VariantEditModal = ({
  open,
  onCancel,
  variants = [],
  selectedVariantIndex = null,
  handleVariantChange,
  generateSKU,
}) => {
  return (
    <Modal
      open={open && selectedVariantIndex !== null}
      onCancel={onCancel}
      title={
        <div className="text-lg font-semibold text-[#000000]">Edit variant</div>
      }
      width={640}
      styles={{ header: { borderBottom: "1px solid rgba(0, 0, 0, 0.10)" } }}
      footer={[
        <button
          key="cancel"
          className="px-6 py-2 text-sm rounded-lg text-[#FB3748]  mr-2 min-w-[100px]"
          onClick={onCancel}
        >
          Cancel
        </button>,
        <button
          key="save"
          className="px-6 py-2 text-sm text-white hover:opacity-95 min-w-[100px]"
          style={{
            borderRadius: "8px",
            borderBottom: "1px solid #6C9BC8",
            background: "linear-gradient(180deg, #3573BA 30.96%, #6FA0D5 100%)",
            boxShadow: "0 1px 2px 0 rgba(92, 139, 189, 0.5)",
          }}
          onClick={onCancel}
        >
          Save
        </button>,
      ]}
    >
      <div className="space-y-6">
        {/* Price Section */}
        <div>
          <div className="mb-4 pb-2 bg-[#3573BA0F] ">
            <h3 className="text-sm font-semibold text-[#3573BA] ">Price</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#141414] font-semibold mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    AED
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-3 py-2 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={variants[selectedVariantIndex || 0]?.mrp || ""}
                    onChange={(e) =>
                      handleVariantChange(
                        selectedVariantIndex,
                        "mrp",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#141414] font-semibold mb-2">
                  Compare at price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    AED
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-3 py-2 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={
                      variants[selectedVariantIndex || 0]?.offerPrice || ""
                    }
                    onChange={(e) =>
                      handleVariantChange(
                        selectedVariantIndex,
                        "offerPrice",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <label className="block text-sm text-[#141414] font-semibold ">
                    Cost per item
                  </label>
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    AED
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-3 py-2 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={variants[selectedVariantIndex || 0]?.costPrice || ""}
                    onChange={(e) =>
                      handleVariantChange(
                        selectedVariantIndex,
                        "costPrice",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <label className="block text-sm text-[#141414] font-semibold ">
                    Profit
                  </label>
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    AED
                  </span>
                  <div className="w-full pl-12 pr-3 py-2 border rounded-lg border-gray-100 bg-gray-50 text-gray-700">
                    {(() => {
                      const mrp = parseFloat(
                        variants[selectedVariantIndex || 0]?.mrp || "0"
                      );
                      const cost = parseFloat(
                        variants[selectedVariantIndex || 0]?.costPrice || "0"
                      );
                      const profit = isNaN(mrp) || isNaN(cost) ? 0 : mrp - cost;
                      return profit.toFixed(0);
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div>
          <div className="mb-4 pb-2 bg-[#3573BA0F] ">
            <h3 className="text-sm font-semibold text-[#3573BA] ">Inventory</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#141414] mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={variants[selectedVariantIndex || 0]?.stockQuantity || ""}
                onChange={(e) =>
                  handleVariantChange(
                    selectedVariantIndex,
                    "stockQuantity",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#141414] mb-2">
                SKU
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-3 pr-10 py-2 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={variants[selectedVariantIndex || 0]?.sku || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      selectedVariantIndex,
                      "sku",
                      e.target.value
                    )
                  }
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Generate SKU"
                  onClick={() =>
                    generateSKU({
                      ...variants[selectedVariantIndex || 0],
                      originalIndex: selectedVariantIndex,
                    })
                  }
                >
                  <img
                    src="/icons/Load.svg"
                    alt="Generate SKU"
                    className="w-4 h-4 text-gray-400"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VariantEditModal;
