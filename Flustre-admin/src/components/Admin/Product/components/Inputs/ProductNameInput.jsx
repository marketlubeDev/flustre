import React, { useState } from "react";
import ErrorMessage from "../../../../common/ErrorMessage";

const ProductNameInput = ({
  handleChange,
  value,
  errors,
  priority,
  onPriorityChange,
  activeStatus,
  onActiveStatusChange,
}) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-900">
          {priority ? "Priority Product Name" : "Product Name"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={activeStatus}
              onChange={(e) => onActiveStatusChange(e.target.checked)}
              className="accent-green-600"
            />
            Is Active
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={priority === 1}
              onChange={(e) => onPriorityChange(e.target.checked)}
              className="accent-green-600"
            />
            Mark as Priority
          </label>
        </div>
      </div>
      <input
        type="text"
        name="name"
        id="name"
        className={`bg-gray-50 border ${
          errors?.name ? "border-red-500" : "border-gray-300"
        } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
        onChange={handleChange}
        value={value}
        pattern="[A-Za-z0-9\s_-]*"
        title="Only letters, numbers, spaces, underscores and hyphens are allowed"
        onKeyDown={(e) => {
          const pattern = /[A-Za-z0-9\s_-]/;
          if (!pattern.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            e.preventDefault();
          }
        }}
      />
      <ErrorMessage error={errors?.name} />
    </div>
  );
};

export default ProductNameInput;
