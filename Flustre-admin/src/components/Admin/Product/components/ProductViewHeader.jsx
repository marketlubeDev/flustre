import React from "react";

const ProductViewHeader = ({
  productCounts,
  selectedStore,
  stores,
  onStoreChange,
  role,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange,
  categories = [],
  subCategories = [],
  onImportCSV,
  onAddProduct,
}) => {
  return (
    <div className="bg-white p-4 pt-8 px-6">
      {/* <div className="px-6 py-4"> */}
      {/* Main Header Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Side - Search and Categories */}
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img
                src="/icons/searchicon.svg"
                alt="Search"
                className="h-4 w-4"
              />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              style={{
                border: "1px solid #E1E4EA",
                background: "#FCFCFC",
              }}
            />
          </div>

          {/* All Categories Dropdown */}
          <div className="min-w-[120px]">
            <select
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option
                  key={category._id || category.id}
                  value={category._id || category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Categories Dropdown */}
          <div className="min-w-[120px]">
            <select
              value={selectedSubCategory || ""}
              onChange={(e) => onSubCategoryChange?.(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              disabled={!selectedCategory}
            >
              <option value="">All Sub-categories</option>
              {subCategories?.map((subCategory) => (
                <option
                  key={subCategory._id || subCategory.id}
                  value={subCategory._id || subCategory.id}
                >
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Store Selector for Super Admin */}
          {role === "superadmin" && stores?.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Store:
              </label>
              <select
                value={selectedStore || ""}
                onChange={(e) => onStoreChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[150px] bg-white"
              >
                <option value="">All Stores</option>
                {stores?.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Import CSV Button */}
          <button
            onClick={onImportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            style={{
              color: "#6D0D26",
              backgroundColor: "#6D0D261A",
            }}
          >
            <img
              src="/icons/importcsv.svg"
              alt="Import CSV"
              className="w-5 h-5"
            />
            Import CSV
          </button>

          {/* Add Product Button */}
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            style={{
              borderRadius: "8px",
              borderBottom: "1px solid #B3536C",
              background:
                "linear-gradient(180deg, #6D0D26 30.96%, #A94962 100%)",
              boxShadow: "0 1px 2px 0 rgba(189, 93, 118, 0.69)",
            }}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ProductViewHeader;
