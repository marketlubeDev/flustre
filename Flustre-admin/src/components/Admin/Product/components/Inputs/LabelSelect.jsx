import ErrorMessage from "../../../../common/ErrorMessage";

const LabelSelect = ({ labels, handleChange, value, errors }) => (
  <div className="flex flex-col w-1/2">
    <label className="block mb-2 text-sm font-medium text-gray-900">
      Label
    </label>
    <select
      name="label"
      className={`bg-gray-50 border ${
        errors?.label ? "border-red-500" : "border-gray-300"
      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={handleChange}
      value={value}
    >
      <option value="">Select Label</option>
      {labels?.map((label) => (
        <option key={label._id} value={label._id}>
          {label.name}
        </option>
      ))}
    </select>
    <ErrorMessage error={errors?.label} />
  </div>
);

export default LabelSelect;
