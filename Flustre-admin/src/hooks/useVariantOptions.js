import { useMemo, useState } from "react";
import {
  cartesian,
  getCommittedValues,
  getTyping,
  parseValues,
} from "../utils/variantChips";
import { dedupeNormalizeVariants } from "../utils/variants";

export function useVariantOptions({
  variants,
  setVariants,
  setActiveVariant,
  setProductData,
}) {
  const [variantOptionSections, setVariantOptionSections] = useState([
    [{ optionName: "", valuesInput: "" }],
  ]);
  const [groupBy, setGroupBy] = useState("");
  const [variantSearch, setVariantSearch] = useState("");
  const [draggedOption, setDraggedOption] = useState(null);
  const [dragOverOption, setDragOverOption] = useState(null);

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
    const optionValues = cleaned.map((o) => o.values);
    const combinations =
      optionValues.length === 1
        ? optionValues[0].map((v) => [v])
        : cartesian(optionValues);
    const defaultPricing = variants[0] || {};
    const newVariants = combinations.map((combo) => {
      const title = combo
        .map((v, idx) =>
          cleaned[idx]?.name ? `${cleaned[idx].name}: ${v}` : v
        )
        .join(" / ");
      const optionsMap = combo.reduce((acc, value, idx) => {
        const key = cleaned[idx]?.name;
        if (key) acc[key] = value;
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
    setProductData?.((prev) => ({ ...prev, options: cleaned }));
  };

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

  return {
    // state
    variantOptionSections,
    setVariantOptionSections,
    groupBy,
    setGroupBy,
    variantSearch,
    setVariantSearch,
    draggedOption,
    dragOverOption,
    // helpers
    parseValues,
    getCommittedValues,
    getTyping,
    flattenedOptions,
    canGenerateVariants,
    // handlers
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
  };
}
