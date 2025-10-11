import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  cartesian,
  getCommittedValues,
  getTyping,
  parseValues,
} from "../utils/variantChips";
import { dedupeNormalizeVariants } from "../utils/variants";

const VariantContext = createContext();

export const useVariantContext = () => {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error("useVariantContext must be used within a VariantProvider");
  }
  return context;
};

export const VariantProvider = ({ children, variants, setVariants, setActiveVariant, setProductData, updateProductOptions }) => {
  // Debug: Log variants prop changes
  console.log('VariantProvider - variants prop updated:', variants?.map((v, idx) => ({
    index: idx,
    name: v.name,
    images: v.images,
    imagesLength: v.images?.length,
    imagesFiltered: v.images?.filter(Boolean)?.length,
    imageValues: v.images?.map((img, imgIdx) => ({ imgIdx, value: img, isTruthy: Boolean(img) }))
  })));
  // State for variant options
  const [variantOptionSections, setVariantOptionSections] = useState([
    [{ optionName: "", valuesInput: "" }],
  ]);
  const [groupBy, setGroupBy] = useState("");
  const [variantSearch, setVariantSearch] = useState("");
  const [draggedOption, setDraggedOption] = useState(null);
  const [dragOverOption, setDragOverOption] = useState(null);

  // Get product data from Redux
  const productData = useSelector(
    (state) => state.productCreation.productData
  );
  const productName = productData?.name;

  // Initialize variant options from product data
  useEffect(() => {
    if (productData?.options && Array.isArray(productData.options) && productData.options.length > 0) {
      const optionSections = productData.options.map(option => ({
        optionName: option.name || "",
        valuesInput: Array.isArray(option.values) && option.values.length > 0 
          ? option.values.join(", ") + ", " 
          : ""
      }));
      setVariantOptionSections([optionSections]);
    }
  }, [productData?.options]);

  // Memoized computed values
  const flattenedOptions = useMemo(
    () => (variantOptionSections || []).flatMap((section) => section),
    [variantOptionSections]
  );

  const canGenerateVariants = useMemo(
    () =>
      flattenedOptions.some(
        (o) => o.optionName.trim() && parseValues(o.valuesInput).length > 0
      ),
    [flattenedOptions]
  );

  // Option management handlers
  const handleOptionChange = (sectionIndex, rowIndex, field, value) => {
    setVariantOptionSections((previousSections) =>
      previousSections.map((sectionRows, sIdx) =>
        sIdx === sectionIndex
          ? sectionRows.map((row, rIdx) =>
              rIdx === rowIndex ? { ...row, [field]: value } : row
            )
          : sectionRows
      )
    );
  };

  const handleAddOptionSection = () => {
    setVariantOptionSections((previousSections) => [
      ...previousSections,
      [{ optionName: "", valuesInput: "" }],
    ]);
  };

  const handleRemoveOptionSection = (sectionIndex) => {
    setVariantOptionSections((previousSections) =>
      previousSections.filter((_, idx) => idx !== sectionIndex)
    );
  };

  // Value input handlers
  const handleValuesInputChange = (sectionIndex, rowIndex, newTyping) => {
    setVariantOptionSections((previousSections) =>
      previousSections.map((sectionRows, sIdx) => {
        if (sIdx !== sectionIndex) return sectionRows;
        return sectionRows.map((row, rIdx) => {
          if (rIdx !== rowIndex) return row;
          const committed = getCommittedValues(row.valuesInput || "");
          const base = committed.join(", ");
          const combined = committed.length
            ? newTyping
              ? base + ", " + newTyping
              : base
            : newTyping;
          return { ...row, valuesInput: combined };
        });
      })
    );
  };

  const handleValuesKeyDown = (sectionIndex, rowIndex, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setVariantOptionSections((previousSections) =>
        previousSections.map((sectionRows, sIdx) => {
          if (sIdx !== sectionIndex) return sectionRows;
          return sectionRows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const current = String(row.valuesInput || "");
            const tokens = current.split(/[\,\n]/);
            const last = tokens[tokens.length - 1]?.trim() || "";
            if (!last) return row;
            const committed = new Set(getCommittedValues(current));
            if (committed.has(last)) {
              return /[\,\n]\s*$/.test(current)
                ? row
                : { ...row, valuesInput: current + ", " };
            }
            const next =
              (committed.size > 0 ? Array.from(committed) : [])
                .concat(last)
                .join(", ") + ", ";
            return { ...row, valuesInput: next };
          });
        })
      );
    }
    if (event.key === "Backspace") {
      const input = event.currentTarget;
      const value = String(input.value || "");
      const typing = /[\,\n]\s*$/.test(value)
        ? ""
        : value
            .split(/[\,\n]/)
            .pop()
            ?.trim() || "";
      if (typing) return;
      setVariantOptionSections((previousSections) =>
        previousSections.map((sectionRows, sIdx) => {
          if (sIdx !== sectionIndex) return sectionRows;
          return sectionRows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const committed = getCommittedValues(row.valuesInput || "");
            if (committed.length === 0) return row;
            const pruned = committed.slice(0, committed.length - 1);
            const next = pruned.length ? pruned.join(", ") + ", " : "";
            return { ...row, valuesInput: next };
          });
        })
      );
    }
  };

  const handleRemoveValueChip = (sectionIndex, rowIndex, valueToRemove) => {
    setVariantOptionSections((previousSections) =>
      previousSections.map((sectionRows, sIdx) => {
        if (sIdx !== sectionIndex) return sectionRows;
        return sectionRows.map((row, rIdx) => {
          if (rIdx !== rowIndex) return row;
          const committed = getCommittedValues(row.valuesInput || "");
          const filtered = committed.filter((v) => v !== valueToRemove);
          const next = filtered.length ? filtered.join(", ") + ", " : "";
          return { ...row, valuesInput: next };
        });
      })
    );
  };

  // Variant generation
  const handleGenerateVariants = () => {
    const cleaned = flattenedOptions
      .filter(
        (o) =>
          o.optionName.trim() && getCommittedValues(o.valuesInput).length > 0
      )
      .map((o) => ({
        name: o.optionName.trim(),
        values: getCommittedValues(o.valuesInput),
      }));
    if (cleaned.length === 0) return;
    
    const optionValues = cleaned.map((o) => [...o.values]); // Create defensive copies
    
    const combinations =
      optionValues.length === 1
        ? optionValues[0].map((v) => [v])
        : cartesian(optionValues);
    
    const defaultPricing = variants[0] || {};
    const newVariants = combinations.map((combo, comboIndex) => {
      const title = combo
        .map((v, idx) => {
          const optionName = cleaned[idx]?.name;
          return optionName ? `${optionName}: ${v}` : v;
        })
        .join(" / ");
      
      const optionsMap = combo.reduce((acc, value, idx) => {
        const option = cleaned[idx];
        if (option && option.name) {
          acc[option.name] = value;
        }
        return acc;
      }, {});
      
      return {
        name: title,
        options: optionsMap,
        sku: "",
        mrp: defaultPricing.mrp || "",
        offerPrice: defaultPricing.offerPrice || "",
        costPrice: defaultPricing.costPrice || "",
        description: defaultPricing.description || "",
        images: [null, null, null, null],
        stockStatus: defaultPricing.stockStatus || "instock",
        stockQuantity: defaultPricing.stockQuantity || "0",
      };
    });
    
    setVariants(dedupeNormalizeVariants(newVariants));
    setActiveVariant?.(0);
    setGroupBy(cleaned[0]?.name || "");
    // Update product options in Redux state
    updateProductOptions?.(cleaned);
  };

  // Drag and drop handlers
  const handleOptionDragStart = (sectionIndex, rowIndex) => {
    setDraggedOption({ sectionIndex, rowIndex });
  };

  const handleOptionDragEnter = (sectionIndex, rowIndex) => {
    setDragOverOption({ sectionIndex, rowIndex });
  };

  const handleOptionDragOver = (event) => {
    event.preventDefault();
  };

  const handleOptionDrop = (toSectionIndex, toRowIndex) => {
    if (!draggedOption) return;
    if (toSectionIndex !== draggedOption.sectionIndex) {
      setDraggedOption(null);
      setDragOverOption(null);
      return;
    }
    setVariantOptionSections((previousSections) =>
      previousSections.map((rows, sIdx) => {
        if (sIdx !== toSectionIndex) return rows;
        const list = [...rows];
        const fromIndex = draggedOption.rowIndex;
        if (
          fromIndex === null ||
          fromIndex === undefined ||
          toRowIndex === null ||
          toRowIndex === undefined ||
          fromIndex === toRowIndex
        ) {
          return rows;
        }
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toRowIndex, 0, moved);
        return list;
      })
    );
    setDraggedOption(null);
    setDragOverOption(null);
  };

  const handleOptionDragEnd = () => {
    setDraggedOption(null);
    setDragOverOption(null);
  };

  // Variant field change handler
  const handleVariantFieldChange = (variantIndex, fieldName, fieldValue) => {
    // Handle bulk updates for group images
    if (variantIndex === 'bulk-update' && fieldName === 'images') {
      const { indices, value } = fieldValue;
      console.log(`Bulk Redux Update - Updating ${indices.length} variants with images:`, {
        indices,
        value,
        valueLength: value?.length
      });
      
      setVariants((previousVariants) => {
        const updatedVariants = previousVariants.map((variant, index) => {
          if (indices.includes(index)) {
            const updatedVariant = { ...variant };
            updatedVariant.images = value;
            return updatedVariant;
          }
          return { ...variant };
        });
        
        console.log(`Bulk Redux State After Update:`, {
          updatedIndices: indices,
          allVariantsImages: updatedVariants.map((v, idx) => ({
            index: idx,
            name: v.name,
            images: v.images,
            imagesLength: v.images?.length,
            imagesFiltered: v.images?.filter(Boolean)?.length,
            rawImages: v.images
          }))
        });
        
        return updatedVariants;
      });
      return;
    }
    
    // Block negative values for numeric fields
    if (
      ["mrp", "offerPrice", "costPrice", "stockQuantity"].includes(fieldName)
    ) {
      const numeric = parseFloat(fieldValue);
      if (!Number.isNaN(numeric) && numeric < 0) return;
    }
    
    // Debug: Log variant field changes
    if (fieldName === "images") {
      console.log(`Redux Update - Variant ${variantIndex} (${variants[variantIndex]?.name})`, {
        fieldName,
        fieldValue,
        fieldValueLength: fieldValue?.length,
        fieldValueFiltered: fieldValue?.filter(Boolean),
        currentImages: variants[variantIndex]?.images
      });
    }
    
    setVariants((previousVariants) => {
      // Create a deep copy to avoid mutation issues
      const updatedVariants = previousVariants.map((variant, index) => {
        if (index === variantIndex) {
          const updatedVariant = { ...variant };
          updatedVariant[fieldName] = fieldValue;
          return updatedVariant;
        }
        return { ...variant };
      });
      
      // Debug: Log the updated state for image changes
      if (fieldName === "images") {
        console.log(`Redux State After Update - Variant ${variantIndex}:`, {
          updatedImages: updatedVariants[variantIndex]?.images,
          updatedImagesLength: updatedVariants[variantIndex]?.images?.length,
          updatedImagesFiltered: updatedVariants[variantIndex]?.images?.filter(Boolean),
          // Detailed inspection
          image0: updatedVariants[variantIndex]?.images?.[0],
          image1: updatedVariants[variantIndex]?.images?.[1],
          image2: updatedVariants[variantIndex]?.images?.[2],
          image3: updatedVariants[variantIndex]?.images?.[3],
          allImagesTruthy: updatedVariants[variantIndex]?.images?.map(img => Boolean(img)),
          allVariantsImages: updatedVariants.map((v, idx) => ({
            index: idx,
            name: v.name,
            images: v.images,
            imagesLength: v.images?.length,
            imagesFiltered: v.images?.filter(Boolean)?.length,
            rawImages: v.images
          }))
        });
      }
      
      return updatedVariants;
    });
  };

  const contextValue = {
    // State
    variantOptionSections,
    groupBy,
    setGroupBy,
    variantSearch,
    setVariantSearch,
    draggedOption,
    dragOverOption,
    productName,
    
    // Computed values
    flattenedOptions,
    canGenerateVariants,
    
    // Utility functions
    parseValues,
    getCommittedValues,
    getTyping,
    
    // Handlers
    handleOptionChange,
    handleAddOptionSection,
    handleRemoveOptionSection,
    handleValuesInputChange,
    handleValuesKeyDown,
    handleRemoveValueChip,
    handleGenerateVariants,
    handleOptionDragStart,
    handleOptionDragEnter,
    handleOptionDragOver,
    handleOptionDrop,
    handleOptionDragEnd,
    handleVariantFieldChange,
  };

  return (
    <VariantContext.Provider value={contextValue}>
      {children}
    </VariantContext.Provider>
  );
};
