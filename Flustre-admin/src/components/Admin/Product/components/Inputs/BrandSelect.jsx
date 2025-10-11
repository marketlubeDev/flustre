import ErrorMessage from "../../../../common/ErrorMessage";

const BrandSelect = ({ brands, handleChange, value, errors }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Brand Name <span className="text-red-500">*</span>
    </label>
    <select
      name="brand"
      className={`bg-gray-50 border ${
        errors?.brand ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    >
      <option value="">Select Brand</option>
      {brands?.map((brand) => (
        <option key={brand._id} value={brand._id}>
          {brand.name}
        </option>
      ))}
    </select>
    <ErrorMessage error={errors?.brand} />
  </div>
);

export default BrandSelect;
