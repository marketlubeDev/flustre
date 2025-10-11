import React from "react";

const InputWithValidation = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "",
  required = true,
  className = "",
}) => (
  <div className="flex flex-col">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`bg-gray-50 border ${
        touched && error ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className}`}
    />
    {touched && error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default InputWithValidation;
