import React from "react";

const Selector = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
  containerClassName = "",
  label = "",
  required = false,
  error = "",
  touched = false,
  showError = true,
  ...props
}) => {
  const baseSelectClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md text-sm
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${
      touched && error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : ""
    }
    ${className}
  `.trim();

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={baseSelectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value || option.id}
            value={option.value || option.id}
          >
            {option.label || option.name}
          </option>
        ))}
      </select>
      {showError && touched && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Selector;
