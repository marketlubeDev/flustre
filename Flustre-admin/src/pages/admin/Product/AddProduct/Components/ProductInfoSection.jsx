import React from "react";
import { useSelector } from "react-redux";

function ProductInfoSection({
  handleProductChange,
  getError,
  isLoadingProduct,
  categories,
  showSubcategory,
  labels,
  SPEC_CHAR_LIMIT,
  handlePasteIntoSpecInput,
  updateSpecification,
  handleVariantFieldChange,
  customFocusStyle,
  handleFocus,
  handleBlur,
}) {
  const productData = useSelector((state) => state.productCreation.productData);
  const variants = useSelector((state) => state.productCreation.variants);
  return (
    <div>
      <div className="px-0 py-0">
        <h2 className="text-sm font-semibold mb-6 bg-[#3573BA1A] text-[#3573BA] px-4 py-3 rounded-t-lg">
          PRODUCT INFO
        </h2>

        {/* Two column layout: Left details, Right pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left column - details */}
          <div
            className="lg:col-span-3 lg:border-r"
            style={{ borderRightColor: "#E1E4EA" }}
          >
            {/* Product Name */}
            <div className="mb-4 px-3">
              <label className="block text-sm font-medium text-black mb-2">
                Product name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                maxLength={120}
                className={`w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none placeholder-[#717886] text-[13px] ${
                  getError("name") ? "border-red-500" : ""
                } ${isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""}`}
                style={customFocusStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={productData.name}
                onChange={handleProductChange}
                placeholder="Enter product name (e.g. Classic Ceramic Mug)"
                disabled={isLoadingProduct}
              />
              {getError("name") && (
                <p className="text-red-500 text-sm mt-1">{getError("name")}</p>
              )}
            </div>

            {/* Category, Subcategory, and Label */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 px-3">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] text-[#717886]${
                    getError("category") ? "border-red-500" : ""
                  } ${
                    isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  name="category"
                  value={productData.category}
                  onChange={handleProductChange}
                  disabled={isLoadingProduct}
                >
                  <option value="" className="text-[#717886]">
                    Choose category
                  </option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {getError("category") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("category")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sub category
                </label>
                <select
                  className={`w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] text-[#717886] ${
                    getError("subcategory") ? "border-red-500" : ""
                  } ${
                    isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  name="subcategory"
                  value={productData?.subcategory || ""}
                  onChange={handleProductChange}
                  disabled={isLoadingProduct}
                >
                  <option value="" className="text-[#717886] text-[13px]">
                    Choose sub-category
                  </option>
                  {showSubcategory?.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                {getError("subcategory") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("subcategory")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Label <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[13px] text-[#717886] ${
                    getError("label") ? "border-red-500" : ""
                  } ${
                    isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  name="label"
                  value={productData?.label || ""}
                  onChange={handleProductChange}
                  disabled={isLoadingProduct}
                >
                  <option value="" className="text-[#717886] text-[13px]">
                    Choose label
                  </option>
                  {labels?.map((label) => (
                    <option key={label._id} value={label._id}>
                      {label.name}
                    </option>
                  ))}
                </select>
                {getError("label") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("label")}
                  </p>
                )}
              </div>
            </div>

            {/* About product */}
            <div className="mb-3 px-3">
              <label className="block text-sm font-medium text-black mb-2 ">
                About product
              </label>
              <textarea
                name="about"
                value={productData.about}
                onChange={handleProductChange}
                className={`w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-[#717886] ${
                  isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                rows={4}
                placeholder="Write a short description about the product, features, and usage..."
                style={{ fontSize: "13px" }}
                disabled={isLoadingProduct}
              />
            </div>

            {/* Specifications */}
            <div className="mb-6 px-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Specification
                </label>
              </div>

              <div className="space-y-3">
                {(productData.specifications || []).map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <textarea
                      value={spec || ""}
                      maxLength={SPEC_CHAR_LIMIT}
                      onPaste={(e) => handlePasteIntoSpecInput(idx, e)}
                      onChange={(e) => updateSpecification(idx, e.target.value)}
                      className={`flex-1 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-[#717886] ${
                        isLoadingProduct ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      rows={4}
                      placeholder="Write a specification detail..."
                      style={{ fontSize: "13px" }}
                      disabled={isLoadingProduct}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - pricing */}
          <div className="px-3 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2 ">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">
                    AED
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={productData.price || ""}
                    onChange={handleProductChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-[#717886]"
                    placeholder="0.00"
                    style={{ fontSize: "13px" }}
                    disabled={isLoadingProduct}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Compare at price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">
                    AED
                  </span>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={productData.compareAtPrice || ""}
                    onChange={handleProductChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-[#717886]"
                    placeholder="0.00"
                    style={{ fontSize: "13px" }}
                    disabled={isLoadingProduct}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Profit{" "}
                  <span className="inline-flex items-center ml-1 text-gray-400">
                    ⓘ
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">
                    AED
                  </span>
                  <input
                    type="number"
                    value={(() => {
                      const price = parseFloat(productData.price || "0");
                      const cost = parseFloat(productData.costPerItem || "0");
                      const profit = price - cost;
                      return Number.isFinite(profit)
                        ? profit.toFixed(2)
                        : "0.00";
                    })()}
                    readOnly
                    className="w-full pl-12 pr-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700"
                    placeholder="0.00"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Cost per item
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">
                    AED
                  </span>
                  <input
                    type="number"
                    name="costPerItem"
                    value={productData.costPerItem || ""}
                    onChange={handleProductChange}
                    min="0"
                    className="w-full pl-12 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-[#717886]"
                    placeholder="0.00"
                    style={{ fontSize: "13px" }}
                    disabled={isLoadingProduct}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600 flex gap-2 items-start">
              <img
                src="/icons/hint-icon.svg"
                alt="hint"
                className="mt-0.5 w-3 h-3"
              />
              <span style={{ fontSize: "13px", color: "#14141499" }}>
                All variants use this price by default. You can change it for
                each variant if needed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoSection;
