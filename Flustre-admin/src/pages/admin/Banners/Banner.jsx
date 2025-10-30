import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../../components/Admin/PageHeader";
import { FaTrash, FaEdit, FaCamera, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  addBanner,
  deleteBanner,
  editBanner,
  getBanners,
} from "../../../sevices/bannerApis";
import {
  triggerBannerCreated,
  triggerBannerDeleted,
} from "../../../utils/menuCountUtils";

function Banner() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerFor: "",
    image: null,
    mobileImage: null,
    productLink: "",
  });
  const fileInputRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const mobileFileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      setBanners(response.data);
    } catch (error) {
      toast.error("Failed to fetch banners");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("bannerFor", formData.bannerFor);
      formDataToSend.append("productLink", formData.productLink);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.mobileImage) {
        formDataToSend.append("mobileImage", formData.mobileImage);
      }

      if (editingBanner) {
        await editBanner(editingBanner._id, formDataToSend);
        toast.success("Banner updated successfully");
      } else {
        await addBanner(formDataToSend);
        toast.success("Banner added successfully");
        // Trigger menu count update for new banner
        triggerBannerCreated();
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
      setIsSubmitting(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = async (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      bannerFor: banner.bannerFor,
      image: null,
      mobileImage: null,
      productLink: banner.productLink || "",
    });
    setImagePreview(banner.image);
    setMobileImagePreview(banner.mobileImage);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      bannerFor: "",
      image: null,
      mobileImage: null,
      productLink: "",
    });
    setImagePreview(null);
    setMobileImagePreview(null);
    setEditingBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    resetForm();
  };

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
      toast.success("Banner deleted successfully");

      // Trigger menu count update for deleted banner
      triggerBannerDeleted();

      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleMobileImageClick = () => {
    mobileFileInputRef.current.click();
  };

  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mobileImage: file,
      }));
      setMobileImagePreview(URL.createObjectURL(file));
    }
  };

  const getBannerTypeStyle = (bannerFor) => {
    const styles = {
      hero: "bg-blue-100 text-blue-800 border border-blue-200",
      singleOffer: "bg-purple-100 text-purple-800 border border-purple-200",
      product: "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return (
      styles[bannerFor] || "bg-gray-100 text-gray-800 border border-gray-200"
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex flex-col flex-1 m-4">
        <div className="flex flex-col h-full bg-white shadow-lg rounded-xl">
          {/* Header Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3"></div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: "#3573BA" }}
            >
              <FaPlus className="mr-2" size={14} />
              Add New Banner
            </button>
          </div>

          {/* Stats Cards */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">
                      {banners?.length || 0}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Total Banners
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">
                      {banners?.filter((b) => b.bannerFor === "hero")?.length ||
                        0}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Hero Banners
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">
                      {banners?.filter((b) => b.bannerFor === "singleOffer")
                        ?.length || 0}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">
                      Featured Promotions
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">
                      {banners?.filter((b) => b.bannerFor === "product")
                        ?.length || 0}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Product Banners
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="flex flex-col flex-1 p-6">
            <div className="overflow-hidden rounded-lg">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="divide-x divide-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide rounded-tl-lg">
                      Banner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Title & Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Product Link
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Mobile Image
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wide rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners?.length > 0 ? (
                    banners.map((banner, idx) => (
                      <tr
                        key={banner._id}
                        className={`hover:bg-gray-50 divide-x divide-gray-200 ${
                          idx === banners.length - 1 ? "last:rounded-b-lg" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                              {banner.image ? (
                                <img
                                  src={banner.image}
                                  alt="Banner"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {banner.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {banner.description || "No description"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBannerTypeStyle(
                              banner.bannerFor
                            )}`}
                          >
                            {banner.bannerFor === "hero" && "Hero Banner"}
                            {banner.bannerFor === "singleOffer" &&
                              "Featured Promotions"}
                            {banner.bannerFor === "product" && "Product Banner"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            {banner.productLink ? (
                              <a
                                href={banner.productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs break-all underline"
                              >
                                {banner.productLink.length > 30
                                  ? `${banner.productLink.substring(0, 30)}...`
                                  : banner.productLink}
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No link
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            {banner.mobileImage ? (
                              <img
                                src={banner.mobileImage}
                                alt="Mobile Banner"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditBanner(banner)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 font-medium">
                              No banners found
                            </p>
                            <p className="text-sm text-gray-400">
                              Create your first banner to get started
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaCamera className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Type
                  </label>
                  <select
                    name="bannerFor"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleInputChange}
                    value={formData.bannerFor}
                  >
                    <option value="" disabled>
                      Select Banner Type
                    </option>
                    <option value="hero">Hero Banner</option>
                    <option value="singleOffer">
                      Featured Promotions Banner
                    </option>
                    <option value="product">Product Banner</option>
                  </select>
                </div>

                {/* Desktop Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Desktop Banner Image
                  </label>
                  <div
                    onClick={handleImageClick}
                    className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Banner preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                          <FaCamera className="text-white text-2xl" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FaCamera className="mx-auto text-gray-400 text-2xl mb-2" />
                        <p className="text-gray-600 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-gray-400 text-xs">
                          3:1 aspect ratio recommended
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Mobile Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mobile Banner Image
                  </label>
                  <div
                    onClick={handleMobileImageClick}
                    className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                  >
                    {mobileImagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile banner preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                          <FaCamera className="text-white text-2xl" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FaCamera className="mx-auto text-gray-400 text-2xl mb-2" />
                        <p className="text-gray-600 font-medium">
                          Click to upload mobile image
                        </p>
                        <p className="text-gray-400 text-xs">
                          2:1 aspect ratio recommended
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    onChange={handleMobileImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter banner title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      rows="3"
                      placeholder="Enter banner description"
                    />
                  </div>

                  {(formData.bannerFor === "product" ||
                    formData.bannerFor === "singleOffer") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Link
                      </label>
                      <input
                        type="url"
                        name="productLink"
                        value={formData.productLink}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://example.com/product/123"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the URL where users should be directed when they
                        click this banner button
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {editingBanner ? "Updating..." : "Adding..."}
                      </>
                    ) : editingBanner ? (
                      "Update Banner"
                    ) : (
                      "Add Banner"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
