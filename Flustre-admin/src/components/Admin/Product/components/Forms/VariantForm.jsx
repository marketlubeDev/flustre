import ErrorMessage from "../../../../common/ErrorMessage";

const VariantForm = ({ handleVariantChange, currentVariantData, errors }) => {
  return (
    <>
      <div className="flex gap-2 px-3">
        <div className="flex flex-col w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Regular Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="price"
            className={`bg-gray-50 border ${
              errors?.price ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onChange={handleVariantChange}
            value={currentVariantData?.price}
          />
          <ErrorMessage error={errors?.price} />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Offer Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="offerPrice"
            className={`bg-gray-50 border ${
              errors?.offerPrice ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onChange={handleVariantChange}
            value={currentVariantData?.offerPrice}
          />
          <ErrorMessage error={errors?.offerPrice} />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Gross Price <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="grossPrice"
            className={`bg-gray-50 border ${
              errors?.grossPrice ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onChange={handleVariantChange}
            value={currentVariantData?.grossPrice}
          />
          <ErrorMessage error={errors?.grossPrice} />
        </div>
      </div>
      <div className="flex gap-2 px-3">
        <div className="flex flex-col w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Quantity In Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            className={`bg-gray-50 border ${
              errors?.stock ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onChange={handleVariantChange}
            value={currentVariantData?.stock}
          />
          <ErrorMessage error={errors?.stock} />
        </div>
        <div className="flex flex-col w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Stock Status <span className="text-red-500">*</span>
          </label>
          <select
            name="stockStatus"
            className={`bg-gray-50 border ${
              errors?.stockStatus ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            onChange={handleVariantChange}
            value={currentVariantData?.stockStatus}
          >
            <option value="">Select Status</option>
            <option value="instock">In stock</option>
            <option value="outofstock">Out of stock</option>
          </select>
          <ErrorMessage error={errors?.stockStatus} />
        </div>
      </div>
      <div className="px-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={6}
          className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
            errors?.description ? "border-red-500" : "border-gray-300"
          } focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Write your thoughts here..."
          onChange={handleVariantChange}
          value={currentVariantData?.attributes?.description}
        />
        <ErrorMessage error={errors?.description} />
      </div>
    </>
  );
};

export default VariantForm;
