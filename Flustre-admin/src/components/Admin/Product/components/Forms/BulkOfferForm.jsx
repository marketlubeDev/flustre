import React, { useState, useRef } from "react";
import { useFetch } from "../../../../../hooks/useFetch";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { axiosInstance } from "../../../../../axios/axiosInstance";
import LoadingSpinner from "../../../../spinner/LoadingSpinner";

export const BulkOfferForm = ({
  onClose,
  isProductSelected,
  selectedProducts,
  setPageRender,
  clearSelectedProducts,
}) => {
  const [formData, setFormData] = useState({
    offerType: isProductSelected ? "group" : "category",
    offerName: "",
    category: "",
    brand: "",
    products: selectedProducts,
    offerMetric: "",
    offerValue: "",
    startDate: "",
    endDate: "",
    bannerImage: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  //fetching categories and brands
  const [brandsAndCategories] = useFetch("/admin/getcategoriesbrands");

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // handle apply offer
  const handleApplyOffer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.bannerImage ||
      !formData.offerName ||
      !formData.offerMetric ||
      !formData.offerValue ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill all the fields");
      setIsLoading(false);
      return;
    }

    const newFormData = new FormData();
    newFormData.append("offerType", formData.offerType);
    newFormData.append("offerName", formData.offerName);
    newFormData.append("category", formData.category);
    newFormData.append("brand", formData.brand);
    newFormData.append("products", JSON.stringify(formData.products));
    newFormData.append("offerMetric", formData.offerMetric);
    newFormData.append("offerValue", formData.offerValue);
    newFormData.append("startDate", formData.startDate);
    newFormData.append("endDate", formData.endDate);
    newFormData.append("bannerImage", formData.bannerImage);

    try {
      const response = await axiosInstance.post("/offer", newFormData);
      onClose();
      toast.success("Offer applied successfully");
      setPageRender((prev) => prev + 1);
      clearSelectedProducts();
    } catch (error) {
      toast.error("Error applying offer");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = brandsAndCategories?.categories || [];
  const brands = brandsAndCategories?.brands || [];

  const fieldsConfig = {
    category: [
      {
        label: "Category",
        // value: category,
        name: "category",
        options: categories,
      },
    ],
    brand: [{ label: "Brand", name: "brand", options: brands }],
    brandCategory: [
      { label: "Brand", name: "brand", options: brands },
      {
        label: "Category",
        name: "category",
        options: categories,
      },
    ],
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, bannerImage: file });
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Add Bulk Offer</h2>
      <p className="text-sm text-gray-600 mb-6">
        Create a special offer for a category, brand, or a specific combination
        of both.
      </p>

      <form onSubmit={handleApplyOffer}>
        {/*----------- offerName----------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Offer Name
            </label>
            <input
              type="text"
              className="mt-1  block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="eg. Onam Offer"
              name="offerName"
              value={formData.offerName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/*----------- offerType----------- */}
          {!isProductSelected && (
            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Offer Type
              </label>
              <select
                className="mt-1 block w-1/2 min-w-fit border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.offerType}
                name="offerType"
                // required
                onChange={(e) => {
                  // handleOfferTypeChange(e);
                  // setFormData({ ...formData, offerType: e.target.value });
                  handleInputChange(e);
                }}
              >
                <option value="category">Category</option>
                <option value="brand">Brand</option>
                <option value="brandCategory">
                  Category of a Specific Brand
                </option>
              </select>
            </div>
          )}
        </div>

        {/*----------- dynamic-fields----------- */}
        {!isProductSelected && (
          <div className="flex flex-col md:flex-row md:gap-4">
            {fieldsConfig[formData.offerType].map(
              ({ label, name, onChange, options }) => (
                <div key={label} className="mb-4 w-full ">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    // value={value}
                    // onChange={(e) => onChange(e.target.value)}
                    name={name}
                    value={formData[name]}
                    required
                    onChange={(e) => {
                      handleInputChange(e);
                      // setFormData({ ...formData, [label]: e.target.value });
                      // setOfferType(e.target.value);
                    }}
                  >
                    <option value="">{`Choose a ${label}`}</option>
                    {options?.map((option) => (
                      <option key={option?._id} value={option?._id}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        )}

        {/* ----------- offerMetric and offerValue----------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Offer Metric
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              name="offerMetric"
              value={formData.offerMetric}
              required
              onChange={handleInputChange}
            >
              <option value="">Choose Discount Type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* ----------- offerValue----------- */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Offer Value
            </label>
            <input
              type="number"
              placeholder={
                formData.offerMetric === "fixed"
                  ? "Enter Discount Value (in ₹)"
                  : "Enter Discount Value (in %)"
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.offerValue}
              name="offerValue"
              required
              onChange={handleInputChange}
              min={formData.offerMetric === "percentage" ? 0 : 1}
              max={formData.offerMetric === "percentage" && 100}
            />
          </div>
        </div>

        {/* ----------- startDate and endDate----------- */}
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.startDate}
              name="startDate"
              required
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* ----------- endDate----------- */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.endDate}
              name="endDate"
              required
              onChange={handleInputChange}
              min={formData.startDate}
            />
          </div>
        </div>

        {/* ----------- bannerImage----------- */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Image
          </label>
          <div
            onClick={handleImageClick}
            className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Brand preview"
                  className="w-full h-full object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white text-3xl" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">Click to upload image</p>
                <p className="text-gray-500" style={{ fontSize: "12px" }}>
                  ( 3:1 aspect ratio recommended )
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            name="bannerImage"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="reset"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Applying...
              </div>
            ) : (
              "Apply Offer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
