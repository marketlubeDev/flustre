import ErrorMessage from "../../../../common/ErrorMessage";

const StoreSelect = ({ handleChange, value, errors, stores, disabled }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Store
    </label>
    <select
      name="store"
      className={`bg-gray-50 border ${
        errors?.store ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
      disabled={disabled}
    >
      <option value="">Select Store</option>
      {stores?.map((store) => (
        <option key={store?._id} value={store?._id}>
          {store?.store_name}
        </option>
      ))}
    </select>
    <ErrorMessage error={errors?.store} />
  </div>
);

export default StoreSelect;
