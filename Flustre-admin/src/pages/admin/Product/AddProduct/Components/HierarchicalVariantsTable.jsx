import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Hash,
  RotateCcw,
} from "lucide-react";
import { Modal } from "antd"; // Added Modal import
import VariantEditModal from "./VariantEditModal";
// NEW: import Dropdown for bulk actions
import { Dropdown } from "antd";
import VariantImagesModal from "./VariantImagesModal";

const HierarchicalVariantsTable = ({
  variants = [],
  onVariantUpdate,
  onRequestDeleteVariant,
  onRequestBulkDeleteVariants,
  groupBy = "",
  searchTerm = "",
  productName = "",
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  // NEW: modal state for editing a single variant
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  // Image upload modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageVariantIndex, setImageVariantIndex] = useState(null);
  const [initialImages, setInitialImages] = useState([]);
  // Group images state - stores images for each group
  const [groupImages, setGroupImages] = useState({});
  // Track if we're editing group images or individual variant images
  const [isEditingGroupImages, setIsEditingGroupImages] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState(null);
  // NEW: selection state for checkboxes
  const [selectedVariantIndices, setSelectedVariantIndices] = useState(
    new Set()
  );

  // Helper function to get effective images for a variant (group images if no individual images)
  const getEffectiveImages = (variant, groupImages = []) => {
    const variantImages = Array.isArray(variant?.images)
      ? variant.images.filter(Boolean)
      : [];

    // If variant has its own images, use those
    if (variantImages.length > 0) {
      return variantImages;
    }

    // Otherwise, use group images
    const validGroupImages = Array.isArray(groupImages)
      ? groupImages.filter(Boolean)
      : [];
    return validGroupImages;
  };

  // Small image preview: shows placeholder, single image, or stacked images
  const VariantImagePreview = ({
    images = [],
    size = 40,
    onClick,
    isGroupImage = false,
  }) => {
    const dimension = `${size}px`;
    const validImages = Array.isArray(images) ? images.filter(Boolean) : [];

    // Placeholder
    if (validImages.length === 0) {
      return (
        <img
          src="/icons/Frame.svg"
          alt="Variant image placeholder"
          className="cursor-pointer rounded object-cover"
          style={{ width: dimension, height: dimension }}
          onClick={onClick}
        />
      );
    }

    // Single image
    if (validImages.length === 1) {
      return (
        <div className="relative">
          <img
            src={validImages[0]}
            alt="Variant image"
            className="cursor-pointer rounded object-cover ring-1 ring-gray-200"
            style={{ width: dimension, height: dimension }}
            onClick={onClick}
          />
          {isGroupImage && (
            <div
              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"
              title="Group image (applies to all variants in this group)"
            />
          )}
        </div>
      );
    }

    // Multiple images -> stable 2x2 collage (max 4 visible)
    const toShow = validImages.slice(0, 4);
    const cellSize = Math.floor((size - 2) / 2); // small gap compensation
    const cellDimension = `${cellSize}px`;
    return (
      <div className="relative">
        <div
          className="cursor-pointer grid grid-cols-2 grid-rows-2 gap-[2px] bg-white rounded overflow-hidden ring-1 ring-gray-200"
          style={{ width: dimension, height: dimension }}
          onClick={onClick}
          title={`${validImages.length} images`}
        >
          {toShow.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Variant image ${idx + 1}`}
              className="object-cover"
              style={{ width: cellDimension, height: cellDimension }}
            />
          ))}
          {validImages.length > 4 && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] leading-none px-1.5 py-0.5 rounded">
              +{validImages.length - 4}
            </div>
          )}
        </div>
        {isGroupImage && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"
            title="Group image (applies to all variants in this group)"
          />
        )}
      </div>
    );
  };

  // NEW: dropdown items for bulk actions
  const bulkMenuItems = [
    { key: "edit_price", label: "Edit price" },
    { key: "edit_skus", label: "Edit SKUs" },
    { key: "edit_quantity", label: "Edit quantity" },
    { key: "add_image", label: "Add image" },
    { key: "delete", label: "Delete variant" },
  ];

  const handleBulkMenuClick = ({ key }) => {
    // Placeholder handlers; wire these to real bulk actions as needed
    if (key === "delete") {
      if (onRequestBulkDeleteVariants) {
        onRequestBulkDeleteVariants(Array.from(selectedVariantIndices));
      }
    }
  };

  // Parse variant name to extract attribute values
  const parseVariantAttributes = (variantName) => {
    if (!variantName) return {};
    const attributes = {};
    const parts = variantName.split(" / ");

    parts.forEach((part) => {
      const colonIndex = part.indexOf(":");
      if (colonIndex > 0) {
        const key = part.substring(0, colonIndex).trim();
        const value = part.substring(colonIndex + 1).trim();
        if (key && value) {
          attributes[key] = value;
        }
      }
    });

    return attributes;
  };

  // Group variants by the specified attribute
  const groupVariants = () => {
    if (!groupBy) {
      return [
        {
          groupName: "",
          variants: variants.map((variant, index) => ({
            ...variant,
            originalIndex: index,
          })),
        },
      ];
    }

    // Create a proper grouped structure
    const grouped = {};

    variants.forEach((variant, index) => {
      const attributes = parseVariantAttributes(variant.name);
      const groupValue = attributes[groupBy] || "Ungrouped";

      // Create unique key to avoid duplicates
      const uniqueKey = JSON.stringify(attributes);

      if (!grouped[groupValue]) {
        grouped[groupValue] = new Map();
      }

      // Only add if we haven't seen this exact combination before
      if (!grouped[groupValue].has(uniqueKey)) {
        grouped[groupValue].set(uniqueKey, {
          ...variant,
          originalIndex: index,
        });
      }
    });

    // Convert Map back to array
    return Object.entries(grouped).map(([groupName, variantMap]) => {
      const variants = Array.from(variantMap.values());
      return {
        groupName,
        variants,
        totalQty: variants.reduce(
          (sum, v) => sum + (parseInt(v.stockQuantity) || 0),
          0
        ),
      };
    });
  };

  // Filter variants based on search term
  const filteredGroups = groupVariants()
    .map((group) => ({
      ...group,
      variants: group.variants.filter((variant) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          (variant.name || "").toLowerCase().includes(searchLower) ||
          (variant.sku || "").toLowerCase().includes(searchLower)
        );
      }),
    }))
    .filter((group) => group.variants.length > 0);

  // Toggle group expansion
  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Handle variant field updates
  const handleVariantChange = (variantIndex, field, value) => {
    if (onVariantUpdate) {
      onVariantUpdate(variantIndex, field, value);
    }
  };

  // NEW: Modal open/close helpers
  const openEditModal = (variant) => {
    setSelectedVariantIndex(variant.originalIndex);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVariantIndex(null);
  };

  // Image modal helpers
  const openImageModal = (variant, isGroup = false, groupName = null) => {
    let current = [];

    if (isGroup && groupName) {
      // Opening group image modal
      current = groupImages[groupName] || [];
      setIsEditingGroupImages(true);
      setEditingGroupName(groupName);
      setImageVariantIndex(null);
    } else {
      // Opening individual variant image modal
      // Show the effective images (what's currently being displayed)
      if (variant && groupName) {
        current = getEffectiveImages(variant, groupImages[groupName]);
      } else {
        current = variant?.images || [];
      }
      setIsEditingGroupImages(false);
      setEditingGroupName(groupName);
      setImageVariantIndex(variant.originalIndex);
    }

    const cleaned = Array.isArray(current)
      ? current.filter(Boolean).slice(0, 5)
      : [];

    console.log(
      `Opening image modal for ${
        isGroup
          ? `group: ${groupName}`
          : `variant index: ${variant.originalIndex}`
      }`,
      { isGroup, groupName, variant: variant?.originalIndex, current: cleaned }
    );

    setInitialImages(cleaned);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImageVariantIndex(null);
    setInitialImages([]);
    setIsEditingGroupImages(false);
    setEditingGroupName(null);
  };

  const saveImagesToVariant = (images) => {
    const finalImages = (images || []).slice(0, 5);

    if (isEditingGroupImages && editingGroupName) {
      // Save to group images (local, for header preview)
      console.log(`Saving images to group: ${editingGroupName}`, finalImages);
      setGroupImages((prev) => ({
        ...prev,
        [editingGroupName]: finalImages,
      }));

      // Also persist these images into each variant that belongs to this group
      // so that images are not lost when switching tabs (unmounting this component)
      try {
        console.log(`Applying group images to group: ${editingGroupName}`, {
          groupBy,
          finalImages,
          variantsCount: variants.length,
        });

        // Collect all variant indices that need to be updated
        const variantIndicesToUpdate = [];

        variants.forEach((v, idx) => {
          const attrs = parseVariantAttributes(v?.name);
          const groupValue = attrs[groupBy] || "Ungrouped";

          console.log(`Checking variant ${idx}:`, {
            variantName: v?.name,
            parsedAttrs: attrs,
            groupBy,
            groupValue,
            editingGroupName,
            matches: groupValue === editingGroupName,
          });

          if (groupValue === editingGroupName) {
            console.log(`Marking variant ${idx} (${v?.name}) for image update`);
            variantIndicesToUpdate.push(idx);
          }
        });

        // Update all variants at once to avoid race conditions
        if (variantIndicesToUpdate.length > 0) {
          console.log(
            `Updating ${variantIndicesToUpdate.length} variants with images:`,
            variantIndicesToUpdate
          );

          // Use a single state update for all variants
          onVariantUpdate("bulk-update", "images", {
            indices: variantIndicesToUpdate,
            value: finalImages,
          });
        }
      } catch (e) {
        console.error("Error applying group images:", e);
      }
    } else if (imageVariantIndex !== null) {
      // Save to individual variant
      console.log(
        `Saving images to variant index: ${imageVariantIndex}`,
        finalImages
      );
      handleVariantChange(imageVariantIndex, "images", finalImages);
    }

    closeImageModal();
  };

  // Generate SKU for a variant
  const generateSKU = (variant) => {
    const attributes = parseVariantAttributes(variant.name);
    const attrValues = Object.values(attributes);

    const attrA = (attrValues[0] || "VAR")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();
    const attrB = (attrValues[1] || "DEF")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();

    const unique = Math.random().toString(36).toUpperCase().slice(2, 6); // 4-char base36
    const newSKU = `${attrA}-${attrB}-${unique}`;

    handleVariantChange(variant.originalIndex, "sku", newSKU);
  };

  // NEW: selection helpers
  const toggleVariantSelection = (originalIndex) => {
    setSelectedVariantIndices((prev) => {
      const next = new Set(prev);
      if (next.has(originalIndex)) {
        next.delete(originalIndex);
      } else {
        next.add(originalIndex);
      }
      return next;
    });
  };

  const allCurrentVariantIndices = filteredGroups.flatMap((g) =>
    g.variants.map((v) => v.originalIndex)
  );
  const selectedCount = Array.from(selectedVariantIndices).filter((i) =>
    allCurrentVariantIndices.includes(i)
  ).length;
  const isAllSelected =
    allCurrentVariantIndices.length > 0 &&
    selectedCount === allCurrentVariantIndices.length;

  const toggleSelectAll = () => {
    setSelectedVariantIndices((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        // unselect all in current view
        allCurrentVariantIndices.forEach((i) => next.delete(i));
      } else {
        // select all in current view
        allCurrentVariantIndices.forEach((i) => next.add(i));
      }
      return next;
    });
  };

  // Handle bulk price updates for a group
  const handleGroupPriceChange = (groupVariants, field, value) => {
    groupVariants.forEach((variant) => {
      handleVariantChange(variant.originalIndex, field, value);
    });
  };

  // Initialize/merge expanded state for groups without overwriting user toggles
  useEffect(() => {
    if (!groupBy) return;

    setExpandedGroups((prev) => {
      const next = { ...prev };
      const groups = groupVariants();
      groups.forEach((group) => {
        if (group.groupName && !(group.groupName in next)) {
          next[group.groupName] = true; // default to expanded for new groups
        }
      });
      return next;
    });
  }, [groupBy, variants]);

  // Determine if there is any variant with a non-empty name
  const hasAnyNamedVariant =
    Array.isArray(variants) &&
    variants.some((v) => typeof v?.name === "string" && v.name.trim() !== "");

  if (!hasAnyNamedVariant) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        <p>No variants available. Generate variants first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              {selectedCount > 0 ? (
                <tr>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-900"
                    colSpan={6}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                        />
                        <span className="text-sm text-gray-700">
                          {selectedCount} variants selected
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className="flex items-center gap-1 text-xs text-[#FB3748]"
                          onClick={() =>
                            onRequestBulkDeleteVariants &&
                            onRequestBulkDeleteVariants(
                              Array.from(selectedVariantIndices)
                            )
                          }
                        >
                          <img
                            src="/icons/close-line.svg"
                            alt="Delete"
                            className="w-4 h-4"
                          />
                          Delete variant
                        </button>
                        <Dropdown
                          menu={{
                            items: bulkMenuItems,
                            onClick: handleBulkMenuClick,
                          }}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </Dropdown>
                      </div>
                    </div>
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-r">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                      <span>Variant</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-r w-32">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-r w-36">
                    Compare-at price
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-r w-24">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900 border-r">
                    SKU
                  </th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <React.Fragment key={group.groupName || "no-group"}>
                  {/* Group Header Row (only if groupBy is set and group has a name) */}
                  {groupBy &&
                    group.groupName &&
                    (() => {
                      // Check if this is a simple single-attribute grouping scenario
                      const allGroups = groupVariants();
                      const isSimpleSingleAttributeGrouping =
                        groupBy &&
                        allGroups.length > 1 &&
                        allGroups.length <= 5 && // reasonable limit for single attribute values
                        allGroups.every((group) => group.variants.length === 1); // each group has only one variant

                      // Don't show group headers for simple single-attribute grouping
                      return !isSimpleSingleAttributeGrouping;
                    })() && (
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 border-r">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                            />
                            <VariantImagePreview
                              images={groupImages[group.groupName] || []}
                              size={48}
                              isGroupImage={true}
                              onClick={(e) => {
                                e.stopPropagation();
                                openImageModal(null, true, group.groupName);
                              }}
                            />

                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {group.groupName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {group.variants.length} variants
                              </span>
                            </div>

                            <button
                              onClick={() => toggleGroup(group.groupName)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {expandedGroups[group.groupName] ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                              AED
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="0.00"
                              onChange={(e) =>
                                handleGroupPriceChange(
                                  group.variants,
                                  "mrp",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                              AED
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              placeholder="0.00"
                              onChange={(e) =>
                                handleGroupPriceChange(
                                  group.variants,
                                  "offerPrice",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r">
                          <div className="px-3 py-1 bg-gray-100 rounded-lg text-center font-medium text-gray-700">
                            {group.totalQty || 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r">
                          <span className="text-gray-400 text-sm">
                            Auto-generated
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    )}

                  {/* Individual Variant Rows */}
                  {(() => {
                    // Check if we should show sub-variants for this group
                    if (!groupBy || !group.groupName) {
                      // No grouping - show all variants normally
                      return group.variants.map((variant) => {
                        const isChecked = selectedVariantIndices.has(
                          variant.originalIndex
                        );

                        return (
                          <tr
                            key={`variant-${variant.originalIndex}`}
                            className="bg-white hover:bg-gray-50"
                            onClick={() => openEditModal(variant)}
                          >
                            <td className="px-4 py-3 border-r">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                                  onClick={(e) => e.stopPropagation()}
                                  checked={isChecked}
                                  onChange={() =>
                                    toggleVariantSelection(
                                      variant.originalIndex
                                    )
                                  }
                                />
                                <VariantImagePreview
                                  images={variant?.images || []}
                                  size={40}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageModal(variant, false, null);
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="text-gray-700">
                                    {variant.name ||
                                      `Variant ${variant.originalIndex + 1}`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                  AED
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.mrp || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "mrp",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0.00"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                  AED
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.offerPrice || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "offerPrice",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0.00"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <input
                                type="number"
                                min="0"
                                className="w-20 px-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                                value={variant.stockQuantity || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.originalIndex,
                                    "stockQuantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative flex items-center">
                                <Hash className="absolute left-2 w-3 h-3 text-gray-400" />
                                <input
                                  type="text"
                                  className="w-32 pl-7 pr-8 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.sku || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generateSKU(variant);
                                  }}
                                  className="absolute right-2 p-1 hover:bg-gray-100 rounded"
                                  title="Generate SKU"
                                >
                                  <img
                                    src="/icons/Load.svg"
                                    alt="Generate SKU"
                                    className="w-4 h-4 text-gray-400"
                                  />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onRequestDeleteVariant) {
                                    onRequestDeleteVariant(
                                      variant.originalIndex
                                    );
                                  }
                                }}
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    }

                    // Check if this is a simple single-attribute grouping scenario
                    // When grouping by a single attribute (like size), we want to show variants as main rows
                    // instead of having group headers + nested sub-variants
                    const allGroups = groupVariants();
                    const hasMultipleGroups =
                      allGroups.filter((g) => g.groupName).length > 1;

                    // For simple single-attribute grouping (like size: S, M, L),
                    // show variants as main rows without group headers or nesting
                    const isSimpleSingleAttributeGrouping =
                      groupBy &&
                      allGroups.length > 1 &&
                      allGroups.length <= 5 && // reasonable limit for single attribute values
                      allGroups.every((group) => group.variants.length === 1); // each group has only one variant

                    if (isSimpleSingleAttributeGrouping) {
                      const groupSpecificVariants = group.variants;

                      if (
                        !groupSpecificVariants ||
                        groupSpecificVariants.length === 0
                      ) {
                        return null;
                      }

                      return groupSpecificVariants.map((variant) => {
                        const isChecked = selectedVariantIndices.has(
                          variant.originalIndex
                        );

                        // For single group, show the full variant name (including the group attribute)
                        const displayName =
                          variant.name ||
                          `Variant ${variant.originalIndex + 1}`;

                        return (
                          <tr
                            key={`variant-${variant.originalIndex}`}
                            className="bg-white hover:bg-gray-50"
                            onClick={() => openEditModal(variant)}
                          >
                            <td className="px-4 py-3 border-r">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                                  onClick={(e) => e.stopPropagation()}
                                  checked={isChecked}
                                  onChange={() =>
                                    toggleVariantSelection(
                                      variant.originalIndex
                                    )
                                  }
                                />
                                <VariantImagePreview
                                  images={getEffectiveImages(
                                    variant,
                                    groupImages[group.groupName]
                                  )}
                                  size={40}
                                  isGroupImage={
                                    !variant?.images ||
                                    variant.images.length === 0
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openImageModal(
                                      variant,
                                      false,
                                      group.groupName
                                    );
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="text-gray-700">
                                    {displayName}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                  AED
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.mrp || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "mrp",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0.00"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                  AED
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.offerPrice || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "offerPrice",
                                      e.target.value
                                    )
                                  }
                                  placeholder="0.00"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r">
                              <input
                                type="number"
                                min="0"
                                className="w-20 px-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                                value={variant.stockQuantity || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.originalIndex,
                                    "stockQuantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="px-4 py-3 border-r">
                              <div className="relative flex items-center">
                                <Hash className="absolute left-2 w-3 h-3 text-gray-400" />
                                <input
                                  type="text"
                                  className="w-32 pl-7 pr-8 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  value={variant.sku || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      variant.originalIndex,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generateSKU(variant);
                                  }}
                                  className="absolute right-2 p-1 hover:bg-gray-100 rounded"
                                  title="Generate SKU"
                                >
                                  <img
                                    src="/icons/Load.svg"
                                    alt="Generate SKU"
                                    className="w-4 h-4 text-gray-400"
                                  />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onRequestDeleteVariant) {
                                    onRequestDeleteVariant(
                                      variant.originalIndex
                                    );
                                  }
                                }}
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    }

                    // Multiple groups scenario - show nested sub-variants (original behavior)
                    // Grouping is enabled - only show if group is expanded
                    if (!expandedGroups[group.groupName]) {
                      return null;
                    }

                    // The variants in group.variants are already correctly grouped,
                    // so we don't need additional filtering - just use them directly
                    const groupSpecificVariants = group.variants;

                    // Don't show individual variant rows if there are no variants
                    if (
                      !groupSpecificVariants ||
                      groupSpecificVariants.length === 0
                    ) {
                      return null;
                    }

                    // Filter out variants with no meaningful data (all zero/empty values)
                    const meaningfulVariants = groupSpecificVariants.filter(
                      (variant) => {
                        const hasPrice =
                          variant.mrp && parseFloat(variant.mrp) > 0;
                        const hasOfferPrice =
                          variant.offerPrice &&
                          parseFloat(variant.offerPrice) > 0;
                        const hasQuantity =
                          variant.stockQuantity &&
                          parseInt(variant.stockQuantity) > 0;
                        const hasSku = variant.sku && variant.sku.trim() !== "";

                        // Show variant if it has at least one meaningful value
                        return (
                          hasPrice || hasOfferPrice || hasQuantity || hasSku
                        );
                      }
                    );

                    // Don't show individual variant rows if there are no meaningful variants
                    if (meaningfulVariants.length === 0) {
                      return null;
                    }

                    return meaningfulVariants.map((variant) => {
                      const isChecked = selectedVariantIndices.has(
                        variant.originalIndex
                      );

                      // Build display name without the grouped attribute
                      const displayName = (() => {
                        const variantName = variant.name || "";
                        if (!variantName) {
                          return `Variant ${variant.originalIndex + 1}`;
                        }

                        const attrs = parseVariantAttributes(variantName);

                        const filteredAttrs = Object.entries(attrs)
                          .filter(
                            ([key]) =>
                              key.toLowerCase() !== groupBy.toLowerCase()
                          )
                          .map(([key, value]) => value); // Just return the value, not "key: value"

                        if (filteredAttrs.length > 0) {
                          return filteredAttrs.join(" / ");
                        }
                        return "Default";
                      })();

                      return (
                        <tr
                          key={`variant-${variant.originalIndex}`}
                          className="bg-gray-50/30 hover:bg-gray-50"
                          onClick={() => openEditModal(variant)}
                        >
                          <td className="px-4 py-3 border-r">
                            <div className="flex items-center gap-2 ml-6">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 accent-[#0049B5]"
                                onClick={(e) => e.stopPropagation()}
                                checked={isChecked}
                                onChange={() =>
                                  toggleVariantSelection(variant.originalIndex)
                                }
                              />
                              <VariantImagePreview
                                images={getEffectiveImages(
                                  variant,
                                  groupImages[group.groupName]
                                )}
                                size={40}
                                isGroupImage={
                                  !variant?.images ||
                                  variant.images.length === 0
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openImageModal(
                                    variant,
                                    false,
                                    group.groupName
                                  );
                                }}
                              />
                              <div className="flex flex-col">
                                <span className="text-gray-700">
                                  {displayName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                AED
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={variant.mrp || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.originalIndex,
                                    "mrp",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                AED
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-24 pl-10 pr-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={variant.offerPrice || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.originalIndex,
                                    "offerPrice",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r">
                            <input
                              type="number"
                              min="0"
                              className="w-20 px-2 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                              value={variant.stockQuantity || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant.originalIndex,
                                  "stockQuantity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3 border-r">
                            <div className="relative flex items-center">
                              <Hash className="absolute left-2 w-3 h-3 text-gray-400" />
                              <input
                                type="text"
                                className="w-32 pl-7 pr-8 py-1 border rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={variant.sku || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.originalIndex,
                                    "sku",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateSKU(variant);
                                }}
                                className="absolute right-2 p-1 hover:bg-gray-100 rounded"
                                title="Generate SKU"
                              >
                                <img
                                  src="/icons/Load.svg"
                                  alt="Generate SKU"
                                  className="w-4 h-4 text-gray-400"
                                />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onRequestDeleteVariant) {
                                  onRequestDeleteVariant(variant.originalIndex);
                                }
                              }}
                            >
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Variant Modal (Extracted) */}
      <VariantEditModal
        open={isEditModalOpen}
        onCancel={closeEditModal}
        variants={variants}
        selectedVariantIndex={selectedVariantIndex}
        handleVariantChange={handleVariantChange}
        generateSKU={generateSKU}
      />

      {/* Variant Images Modal */}
      <VariantImagesModal
        open={isImageModalOpen}
        initialImages={initialImages}
        onCancel={closeImageModal}
        onSave={saveImagesToVariant}
        productName={productName}
        variantIndex={imageVariantIndex}
        isGroupImage={isEditingGroupImages}
        groupName={editingGroupName}
        hasIndividualImages={
          imageVariantIndex !== null
            ? variants[imageVariantIndex]?.images?.length > 0
            : false
        }
      />
    </div>
  );
};

export default HierarchicalVariantsTable;
