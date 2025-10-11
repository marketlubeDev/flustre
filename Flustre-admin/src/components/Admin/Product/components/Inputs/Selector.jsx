import React from "react";
import ErrorMessage from "../../../../common/ErrorMessage";

const Selector = ({options, handleChange, value, errors, label, name, disabled=false }) => {

  return (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      name={name}
      className={`bg-gray-50 border ${
        errors?.[name] ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
      disabled={disabled}
    >
      <option value="">Select {label}</option>
      {options?.map((option) => (
        <option key={option._id} value={option._id}>
          {option.name}
        </option>
      ))}
    </select>
    <ErrorMessage error={errors?.[name]} />
  </div>
  );
};

export default Selector;
