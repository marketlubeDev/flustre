import React from "react";

const SelectWithValidation = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = true,
  className = "",
}) => (
  <div className="flex flex-col">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`bg-gray-50 border ${
        touched && error ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className}`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {touched && error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default SelectWithValidation;
