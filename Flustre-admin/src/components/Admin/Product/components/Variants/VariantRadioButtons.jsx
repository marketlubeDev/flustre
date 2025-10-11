import ErrorMessage from "../../../../common/ErrorMessage";

const VariantRadioButtons = ({
  selectedVariant,
  handleRadioChange,
  errors,
}) => (
  <div className="flex gap-2">
    <div className="flex items-center ps-4 border border-gray-200 rounded-sm w-1/2">
      <input
        id="bordered-radio-1"
        type="radio"
        name="variantradio"
        value="hasVariants"
        checked={selectedVariant === "hasVariants"}
        onChange={handleRadioChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
      />
      <label
        htmlFor="bordered-radio-1"
        className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
      >
        Has Product Variants
      </label>
    </div>
    <div className="flex items-center ps-4 border border-gray-200 rounded-sm w-1/2">
      <input
        id="bordered-radio-2"
        type="radio"
        name="variantradio"
        value="noVariants"
        checked={selectedVariant === "noVariants"}
        onChange={handleRadioChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
      />
      <label
        htmlFor="bordered-radio-2"
        className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
      >
        No Product Variants
      </label>
      <ErrorMessage error={errors?.variantradio} />
    </div>
  </div>
);

export default VariantRadioButtons;
