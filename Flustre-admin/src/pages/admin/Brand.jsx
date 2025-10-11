import React, { useEffect, useState, useCallback, useRef } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import {
  getAllBrands,
  searchBrand,
  addBrand,
  editBrand,
  deleteBrand,
} from "../../sevices/brandApis";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";
import Pagination from "../../components/Admin/Product/components/Pagination/Pagination";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [priorityBrandsCount, setPriorityBrandsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPriority: false,
    image: null,
    bannerImage: null,
    mobileBannerImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [mobileBannerImagePreview, setMobileBannerImagePreview] =
    useState(null);
  const fileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const mobileBannerFileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBrands = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await getAllBrands(page, 10);
      if (response && response.data) {
        setBrands(response.data.brands || []);
        setPriorityBrandsCount(response.data.priorityBrandCount || 0);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(1);
  }, []);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchBrands(page);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        fetchBrands();
        return;
      }

      try {
        setLoading(true);
        const response = await searchBrand(query);
        if (response && response.brands) {
          setBrands(response.brands || []);
          setTotalPages(response.totalPages || 1);
          setCurrentPage(response.currentPage || 1);
        } else {
          toast.error("Invalid search response from server");
        }
      } catch (error) {
        console.error("Search Error:", error);
        toast.error("Failed to search brands");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (type === "checkbox") {
      setPriorityBrandsCount(
        checked ? priorityBrandsCount + 1 : priorityBrandsCount - 1
      );
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleBannerImageClick = () => {
    bannerFileInputRef.current.click();
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

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMobileBannerImageClick = () => {
    mobileBannerFileInputRef.current.click();
  };

  const handleMobileBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mobileBannerImage: file }));
      setMobileBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validate all required fields
    const missingFields = [];
    if (!formData.name) missingFields.push("Brand Name");
    if (!formData.description) missingFields.push("Brand Description");
    if (!editingBrand) {
      if (!formData.image) missingFields.push("Brand Image");
      if (!formData.bannerImage) missingFields.push("Banner Image");
      if (!formData.mobileBannerImage)
        missingFields.push("Mobile Banner Image");
    }
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      setIsSubmitting(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isPriority", formData.isPriority || false);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.bannerImage) {
        formDataToSend.append("bannerImage", formData.bannerImage);
      }
      if (formData.mobileBannerImage) {
        formDataToSend.append("mobileBannerImage", formData.mobileBannerImage);
      }
      if (editingBrand) {
        await editBrand(editingBrand._id, formDataToSend);
        toast.success("Brand updated successfully");
      } else {
        await addBrand(formDataToSend);
        toast.success("Brand added successfully");
      }
      setShowModal(false);
      resetForm();
      setSearchQuery("");
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      image: null,
      bannerImage: null,
      mobileBannerImage: null,
      isPriority: brand.isPriority,
    });
    setImagePreview(brand.image);
    setBannerImagePreview(brand.bannerImage);
    setMobileBannerImagePreview(brand.mobileBannerImage);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      bannerImage: null,
      mobileBannerImage: null,
    });
    setEditingBrand(null);
    setImagePreview(null);
    setBannerImagePreview(null);
    setMobileBannerImagePreview(null);
  };

  // Add useEffect for handling body scroll
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBrand(brandToDelete._id);
      toast.success("Brand deleted successfully");
      fetchBrands();
      setShowDeleteModal(false);
      setBrandToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* <PageHeader
        content="Brands"
        otherDetails={`${priorityBrandsCount} priority brands`}
      /> */}

      <div className="flex flex-col m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name"
                />
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowModal(true)}
                className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
              >
                Add New Brand
              </button>
            </div>
          </div>

          <div
            className={`${
              showModal ? "overflow-hidden" : "overflow-y-auto"
            } flex-1`}
          >
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Brand ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Brand Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Banner Image
                  </th>

                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <LoadingSpinner
                        color="primary"
                        text="Loading brands..."
                        size="sm"
                      />
                    </td>
                  </tr>
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No brands found
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr
                      key={brand._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        <span
                          className={`w-4 h-4 block rounded-full ${
                            brand.isPriority && "bg-green-500"
                          }`}
                          title={brand.isPriority ? "Priority Brand" : ""}
                        ></span>
                        {brand._id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {brand.image && (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          {brand.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {brand.bannerImage && (
                          <img
                            src={brand.bannerImage}
                            alt={brand.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {brands && brands.length > 0 && (
              <div className="py-4 px-3 flex justify-end border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingBrand ? "Edit Brand" : "Add New Brand"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
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
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 text-left">
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
                          <p
                            className="text-gray-500"
                            style={{ fontSize: "12px" }}
                          >
                            ( 1:1 aspect ratio recommended )
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
                      name="image"
                    />
                  </div>
                  <div>
                    <div className="mb-4 text-left">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banner Image
                      </label>
                      <div
                        onClick={handleBannerImageClick}
                        className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {bannerImagePreview ? (
                          <img
                            src={bannerImagePreview}
                            alt="Brand preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                            <p className="text-gray-500">
                              Click to upload image
                            </p>
                            <p
                              className="text-gray-500"
                              style={{ fontSize: "12px" }}
                            >
                              ( 4:1 aspect ratio recommended )
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={bannerFileInputRef}
                        onChange={handleBannerImageChange}
                        accept="image/*"
                        className="hidden"
                        name="bannerImage"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4 text-left">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banner Image For Mobile
                      </label>
                      <div
                        onClick={handleMobileBannerImageClick}
                        className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {mobileBannerImagePreview ? (
                          <img
                            src={mobileBannerImagePreview}
                            alt="Mobile banner preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                            <p className="text-gray-500">
                              Click to upload mobile banner image
                            </p>
                            <p
                              className="text-gray-500"
                              style={{ fontSize: "12px" }}
                            >
                              ( 2:1 aspect ratio recommended )
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={mobileBannerFileInputRef}
                        onChange={handleMobileBannerImageChange}
                        accept="image/*"
                        className="hidden"
                        name="mobileBannerImage"
                      />
                    </div>
                  </div>
                  <div className="mb-4 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={20}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/20 characters
                    </p>
                  </div>
                  <div className="mb-4 flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Is Priority Brand ?
                    </label>
                    <input
                      type="checkbox"
                      name="isPriority"
                      checked={formData.isPriority}
                      onChange={handleInputChange}
                      disabled={
                        priorityBrandsCount >= 8 && !formData.isPriority
                      }
                      className="w-ful p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {priorityBrandsCount >= 8 && !formData.isPriority && (
                      <p className="text-red-500 text-sm mt-1">
                        Maximum of 8 priority brands reached.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                          {editingBrand ? "Updating..." : "Adding..."}
                        </>
                      ) : editingBrand ? (
                        "Update"
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the brand "${brandToDelete?.name}"?`}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </div>
  );
}

export default Brand;
