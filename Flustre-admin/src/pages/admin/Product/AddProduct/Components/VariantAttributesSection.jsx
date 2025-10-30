import React from "react";
import { useVariantContext } from "../../../../../contexts/VariantContext";
import HierarchicalVariantsTable from "./HierarchicalVariantsTable";

function VariantAttributesSection({
  variants,
  onRequestDeleteVariant,
  onRequestBulkDeleteVariants,
}) {
  const {
    groupBy,
    setGroupBy,
    flattenedOptions,
    variantSearch,
    setVariantSearch,
    handleVariantFieldChange,
  } = useVariantContext();
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <h2 className="text-sm font-semibold text-[#3573BA] bg-[#3573BA1A] px-4 py-3 rounded-t-lg flex-shrink-0">
        VARIANT ATTRIBUTE
      </h2>

      {/* Controls section */}
      <div
        className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-shrink-0"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#00000099]">Group by</span>
          <select
            className="px-2 py-1 min-h-[33px] border rounded text-xs"
            style={{ borderColor: "#E1E4EA" }}
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="">None</option>
            {flattenedOptions
              .filter((o) => o.optionName.trim())
              .map((o, i) => (
                <option
                  key={`${o.optionName}-${i}`}
                  value={o.optionName.trim()}
                >
                  {o.optionName.trim()}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64 md:w-72">
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1 border rounded text-[13px] w-full placeholder-custom"
              style={{
                borderColor: "#E1E4EA",
                fontSize: "13px",
                color: variantSearch ? "#141414" : "#717886",
              }}
              value={variantSearch}
              onChange={(e) => setVariantSearch(e.target.value)}
            />
            <img
              src="/icons/searchicon.svg"
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
            />
            <style>
              {`
                  .placeholder-custom::placeholder {
                    color: #717886 !important;
                    font-size: 13px !important;
                    opacity: 1;
                  }
                `}
            </style>
          </div>
        </div>
      </div>

      {/* Table with scroll - Updated to pass props */}
      <div className="flex-1 overflow-hidden px-4 pb-4 min-h-0">
        <div className="h-full overflow-auto border rounded-lg hide-scrollbar">
          <HierarchicalVariantsTable
            variants={variants}
            onVariantUpdate={handleVariantFieldChange}
            onRequestDeleteVariant={onRequestDeleteVariant}
            onRequestBulkDeleteVariants={onRequestBulkDeleteVariants}
            groupBy={groupBy}
            searchTerm={variantSearch}
          />
        </div>
      </div>
    </div>
  );
}

export default VariantAttributesSection;
