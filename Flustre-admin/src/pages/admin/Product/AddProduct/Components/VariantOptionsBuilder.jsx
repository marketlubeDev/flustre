import React from "react";
import { useVariantContext } from "../../../../../contexts/VariantContext";

function VariantOptionsBuilder({ isLoadingProduct }) {
  const {
    variantOptionSections,
    getCommittedValues,
    getTyping,
    handleOptionDragStart,
    handleOptionDragEnter,
    handleOptionDragOver,
    handleOptionDrop,
    handleOptionDragEnd,
    handleOptionChange,
    handleRemoveValueChip,
    handleValuesInputChange,
    handleValuesKeyDown,
    handleRemoveOptionSection,
    handleAddOptionSection,
    handleGenerateVariants,
    canGenerateVariants,
    dragOverOption,
  } = useVariantContext();
  return (
    <div className="bg-white rounded-lg w-full">
      <div className="p-0 flex flex-col">
        <div className="flex-shrink-0">
          <h2 className="text-sm font-semibold text-[#3573BA] bg-[#3573BA1A] px-4 py-3 rounded-t-lg">
            VARIANT INFO
          </h2>

          <div className="border rounded-lg mb-6 p-0">
            <div className="p-0">
              {(variantOptionSections || []).map((sectionRows, sectionIdx) => (
                <div
                  key={`section-${sectionIdx}`}
                  className="rounded-md p-4"
                  style={{
                    backgroundColor: "#00000003",
                    borderBottom: "1px solid #E1E4EA",
                  }}
                >
                  <div className="flex items-center justify-between mb-2 text-xs text-[#00000099] gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div style={{ width: "20px" }}></div>
                      <div
                        className="text-[14px] font-semibold text-[#000000]"
                        style={{ flexBasis: "30%" }}
                      >
                        Option
                      </div>
                      <div
                        className="text-[14px] font-semibold text-[#000000]"
                        style={{ flex: "1 1 0%" }}
                      >
                        Value
                      </div>
                    </div>
                  </div>
                  {sectionRows.map((row, rowIdx) => (
                    <div
                      key={`row-${sectionIdx}-${rowIdx}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-3"
                      draggable
                      onDragStart={() =>
                        handleOptionDragStart(sectionIdx, rowIdx)
                      }
                      onDragEnter={() =>
                        handleOptionDragEnter(sectionIdx, rowIdx)
                      }
                      onDragOver={handleOptionDragOver}
                      onDrop={() => handleOptionDrop(sectionIdx, rowIdx)}
                      onDragEnd={handleOptionDragEnd}
                      style={
                        dragOverOption &&
                        dragOverOption.sectionIndex === sectionIdx &&
                        dragOverOption.rowIndex === rowIdx
                          ? { backgroundColor: "#F9FAFB", borderRadius: "6px" }
                          : {}
                      }
                    >
                      <div
                        style={{ width: "20px" }}
                        className="flex items-center justify-center cursor-move"
                      >
                        <img
                          src="/icons/6dots.svg"
                          alt="drag"
                          className="w-3 h-3 opacity-60"
                        />
                      </div>
                      <div
                        className="w-full sm:w-auto"
                        style={{ flexBasis: "30%" }}
                      >
                        <input
                          type="text"
                          className="w-full px-3 py-1 min-h-[37px] border border-[#E1E4EA] rounded-[6px] bg-white text-sm placeholder:text-xs"
                          placeholder="e.g., Color, Size"
                          value={row.optionName}
                          onChange={(e) =>
                            handleOptionChange(
                              sectionIdx,
                              rowIdx,
                              "optionName",
                              e.target.value
                            )
                          }
                          disabled={isLoadingProduct}
                          style={{
                            "::placeholder": { color: "#717886" },
                            color: "#000",
                          }}
                        />
                      </div>
                      <div className="w-full" style={{ flex: "1 1 0%" }}>
                        <div className="border border-[#E1E4EA] rounded-[6px] bg-white px-3 py-1 min-h-[34px] focus-within:outline-none focus-within:ring-0 focus-within:border-[#E1E4EA]">
                          <div className="flex flex-wrap items-center gap-2">
                            {getCommittedValues(row.valuesInput).map(
                              (val, chipIdx) => (
                                <span
                                  key={`chip-${sectionIdx}-${rowIdx}-${chipIdx}`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 text-sm rounded-md"
                                  style={{
                                    backgroundColor: "#F3F4F6",
                                    color: "#111827",
                                  }}
                                >
                                  {val}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveValueChip(
                                        sectionIdx,
                                        rowIdx,
                                        val
                                      )
                                    }
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            )}
                            <input
                              type="text"
                              className="flex-1 min-w-[80px] px-1 py-1 outline-none border-0 bg-transparent text-sm placeholder:text-xs focus:outline-none focus:ring-0 focus-visible:outline-none"
                              placeholder={
                                getCommittedValues(row.valuesInput).length ===
                                  0 && getTyping(row.valuesInput).length === 0
                                  ? "Add values one by one(e.g., Red, Blue, Green)"
                                  : ""
                              }
                              value={getTyping(row.valuesInput)}
                              onChange={(e) =>
                                handleValuesInputChange(
                                  sectionIdx,
                                  rowIdx,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                handleValuesKeyDown(sectionIdx, rowIdx, e)
                              }
                              disabled={isLoadingProduct}
                              style={{
                                "::placeholder": { color: "#717886" },
                                color: "#000",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        style={{ width: "28px" }}
                        className="flex justify-end self-end sm:self-auto"
                      >
                        {variantOptionSections.length > 1 && (
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center rounded-[6px]"
                            style={{
                              backgroundColor: "#FB37481A",
                              color: "#FB3748",
                            }}
                            title="Remove variant section"
                            onClick={() =>
                              handleRemoveOptionSection(sectionIdx)
                            }
                          >
                            −
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2">
                <button
                  type="button"
                  className="text-[#3573BA] text-sm font-semibold flex items-center gap-1"
                  onClick={handleAddOptionSection}
                >
                  + Add Variant
                </button>
                <button
                  type="button"
                  className="px-8 py-2 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderRadius: "6px",
                    borderBottom: "1px solid #6C9BC8",
                    background:
                      "linear-gradient(180deg, #3573BA 30.96%, #6FA0D5 100%)",
                    boxShadow: "0 1px 2px 0 rgba(92, 139, 189, 0.5)",
                  }}
                  onClick={handleGenerateVariants}
                  disabled={isLoadingProduct || !canGenerateVariants}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantOptionsBuilder;
