"use client";

export default function VariantOptions({
  product,
  selectedVariant,
  setSelectedVariant,
}) {
  if (!Array.isArray(product?.variants) || product.variants.length === 0) {
    return null;
  }

  const variants = product.variants;
  const current = variants[selectedVariant] || null;

  const matchesOptions = (variant, desired) => {
    if (!variant?.options) return false;
    return Object.keys(desired).every(
      (key) => variant.options[key] === desired[key]
    );
  };

  const renderOptionGroup = (opt, groupIdx) => {
    const optionName = opt?.name || "Option";
    const values =
      Array.isArray(opt?.values) && opt.values.length > 0
        ? opt.values
        : Array.from(
            new Set(
              variants
                .map((v) => (v?.options ? v.options[optionName] : undefined))
                .filter(Boolean)
            )
          );

    const selectedValue = current?.options
      ? current.options[optionName]
      : undefined;
    const labelText = optionName.charAt(0).toUpperCase() + optionName.slice(1);

    const onSelectValue = (value) => {
      const desired = { ...(current?.options || {}) };
      desired[optionName] = value;

      let idx = variants.findIndex((v) => matchesOptions(v, desired));
      if (idx < 0) {
        idx = variants.findIndex(
          (v) => v?.options && v.options[optionName] === value
        );
      }

      if (idx >= 0) setSelectedVariant(idx);
    };

    return (
      <div key={`${optionName}-${groupIdx}`} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            {labelText}:
          </span>
          <span className="text-gray-900 font-semibold text-xs sm:text-sm">
            {selectedValue || `Variant ${selectedVariant + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {values.map((value, idx) => {
            const isActive = String(value) === String(selectedValue);
            return (
              <button
                key={`${optionName}-${value}-${idx}`}
                onClick={() => onSelectValue(value)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium border cursor-pointer ${
                  isActive ? "border-2" : "border"
                }`}
                style={{
                  borderColor: isActive ? "#2B73B8" : "#D1D5DB",
                  color: "#333",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (Array.isArray(product?.options) && product.options.length > 0) {
    return <>{product.options.map((opt, i) => renderOptionGroup(opt, i))}</>;
  }

  const firstKey = current?.options ? Object.keys(current.options)[0] : null;
  const derived = firstKey
    ? {
        name: firstKey,
        values: Array.from(
          new Set(variants.map((v) => v?.options?.[firstKey]).filter(Boolean))
        ),
      }
    : { name: "Option", values: [] };

  return <>{renderOptionGroup(derived, 0)}</>;
}
