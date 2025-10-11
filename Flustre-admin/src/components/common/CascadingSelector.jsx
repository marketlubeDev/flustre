import React from "react";
import Selector from "./Selector";

const CascadingSelector = ({
  // Primary selector props
  primaryValue,
  primaryOnChange,
  primaryOptions = [],
  primaryPlaceholder = "Select category",
  primaryLabel = "Category",

  // Secondary selector props
  secondaryValue,
  secondaryOnChange,
  secondaryOptions = [],
  secondaryPlaceholder = "Select subcategory",
  secondaryLabel = "Subcategory",

  // Cascading behavior
  onPrimaryChange, // Custom handler for primary change (e.g., to reset secondary)
  cascadingData = {}, // Object with primary values as keys and secondary options as values

  // Styling
  className = "",
  containerClassName = "",
  primaryClassName = "",
  secondaryClassName = "",

  // Other props
  disabled = false,
  required = false,
  error = "",
  touched = false,
  showError = true,
}) => {
  // Handle primary selector change
  const handlePrimaryChange = (e) => {
    const newValue = e.target.value;
    primaryOnChange(e);

    // Reset secondary value when primary changes
    if (onPrimaryChange) {
      onPrimaryChange(newValue);
    } else {
      // Default behavior: reset secondary selector
      secondaryOnChange({ target: { value: "" } });
    }
  };

  // Get secondary options based on primary selection
  const getSecondaryOptions = () => {
    if (primaryValue && cascadingData[primaryValue]) {
      return cascadingData[primaryValue];
    }
    return secondaryOptions;
  };

  return (
    <div className={`flex flex-col space-y-4 ${containerClassName}`}>
      {/* Primary Selector */}
      <div className="w-full">
        <Selector
          value={primaryValue}
          onChange={handlePrimaryChange}
          options={primaryOptions}
          placeholder={primaryPlaceholder}
          label={primaryLabel}
          disabled={disabled}
          className={primaryClassName}
          required={required}
          error={error}
          touched={touched}
          showError={showError}
        />
      </div>

      {/* Secondary Selector */}
      <div className="w-full">
        <Selector
          value={secondaryValue}
          onChange={secondaryOnChange}
          options={getSecondaryOptions()}
          placeholder={secondaryPlaceholder}
          label={secondaryLabel}
          disabled={disabled || !primaryValue}
          className={secondaryClassName}
          required={false}
          showError={false}
        />
      </div>
    </div>
  );
};

export default CascadingSelector;
