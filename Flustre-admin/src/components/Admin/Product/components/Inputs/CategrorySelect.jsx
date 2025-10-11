import React from "react";
import ErrorMessage from "../../../../common/ErrorMessage";

const CategorySelect = ({ handleChange, value, errors, categories }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Category
    </label>
    <select
      name="category"
      className={`bg-gray-50 border ${
        errors?.category ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    >
      <option value="">Select Category</option>
      {categories?.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
    <ErrorMessage error={errors?.category} />
  </div>
);

export default CategorySelect;
