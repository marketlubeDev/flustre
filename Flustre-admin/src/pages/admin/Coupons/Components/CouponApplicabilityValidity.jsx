import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CouponApplicabilityValidity = ({
  validityOpen,
  setValidityOpen,
  formData,
  setFormData,
  minDate,
  handleApplyToChange,
  productSearchTerm,
  handleProductSearch,
  selectedProducts,
  removeSelectedProduct,
  searchingProducts,
  productResults,
  toggleProductSelection,
  categories,
  subcategories,
}) => {
  return (
    <div className="">
      <button
        type="button"
        onClick={() => setValidityOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(53, 115, 186, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#3573BA]">
          Applicability & Validity
          <span className="text-[#000000]">
            {validityOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </span>
        </span>
      </button>
      {validityOpen && (
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            {/* Applicable to section */}
            <div>
              <label className="block text-sm font-medium text-[#141414] mb-2">
                Applicable to
              </label>
              <select
                value={formData.applyTo}
                onChange={handleApplyToChange}
                className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
              >
                <option value="" disabled hidden>
                  Apply coupon to
                </option>{" "}
                <option value="product">Search product names…</option>{" "}
                <option value="category">Select category</option>
                <option value="subcategory">Choose subcategory</option>
                <option value="order">Order above amount</option>
              </select>

              {formData.applyTo === "product" && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
                    placeholder="Search product by name or SKU"
                  />
                  {Array.isArray(formData.productIds) &&
                    formData.productIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(selectedProducts.length > 0
                          ? selectedProducts.filter((p) =>
                              formData.productIds.includes(p._id)
                            )
                          : formData.productIds.map((id) => ({
                              _id: id,
                              name: id,
                            }))
                        ).map((p) => (
                          <span
                            key={p._id}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full"
                          >
                            {p.name}
                            <button
                              type="button"
                              onClick={() => removeSelectedProduct(p._id)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  {searchingProducts ? (
                    <div className="text-xs text-gray-500">Searching…</div>
                  ) : (
                    <div className="max-h-48 overflow-auto border border-gray-200 rounded-md divide-y">
                      {productResults.length === 0 ? (
                        <div className="p-2 text-xs text-gray-500">
                          No results
                        </div>
                      ) : (
                        productResults.map((p) => {
                          const checked = (formData.productIds || []).includes(
                            p._id
                          );
                          return (
                            <label
                              key={p._id}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleProductSelection(p)}
                                className="h-3 w-3 accent-[#7B253B] rounded border-gray-300"
                              />
                              <span className="line-clamp-1">{p.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {formData.applyTo === "category" && (
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              {formData.applyTo === "subcategory" && (
                <select
                  value={formData.subcategoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subcategoryId: e.target.value,
                    })
                  }
                  className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id || sub.id} value={sub._id || sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}

              {formData.applyTo === "order" && (
                <div className="mt-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.minPurchase}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPurchase: e.target.value,
                      })
                    }
                    className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D0D26] focus:border-transparent"
                    placeholder="Enter minimum order amount"
                  />
                </div>
              )}
            </div>

            {/* Valid until section */}
            <div>
              <label className="block text-sm font-medium text-[#141414] mb-2">
                Valid until
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                min={minDate}
                className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
                required
              />
            </div>

            {/* Limit section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {" "}
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  className="w-full rounded-[0.7rem] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3573BA] focus:border-transparent"
                  placeholder="Set usage limit"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponApplicabilityValidity;
