import React, { useEffect, useState, useCallback, useRef } from "react";
import PageHeader from "../../../components/Admin/PageHeader";
import {
  getAllCategories,
  searchCategory,
  addCategory,
  editCategory,
  deleteCategory,
} from "../../../sevices/categoryApis";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import ConfirmationModal from "../../../components/Admin/ConfirmationModal";
import {
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaCamera,
  FaCopy,
} from "react-icons/fa";
import {
  triggerCategoryCreated,
  triggerCategoryDeleted,
} from "../../../utils/menuCountUtils";

function Category() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.envelop.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        fetchCategories();
        return;
      }

      try {
        setLoading(true);
        const response = await searchCategory(query);
        setCategories(response.category);
        setCurrentPage(1);
      } catch (error) {
        toast.error("Failed to search categories");
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that image is selected
    if (!formData.image && !imagePreview) {
      setImageError(true);
      toast.error("Please select a category image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingCategory) {
        await editCategory(editingCategory._id, formDataToSend);
        toast.success("Category updated successfully");
      } else {
        await addCategory(formDataToSend);
        toast.success("Category added successfully");
        // Trigger menu count update for new category
        triggerCategoryCreated();
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parentName: category.parent?.name || "",
      image: null,
    });
    setImagePreview(category.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
    setImageError(false);
    setEditingCategory(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete._id);
      toast.success("Category deleted successfully");

      // Trigger menu count update for deleted category
      triggerCategoryDeleted();

      fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const renderCategoryRow = (category, level = 0, parentName = null, idx) => {
    return (
      <tr
        key={category._id}
        className={`hover:bg-gray-50 divide-x divide-gray-200 ${
          idx === categories.length - 1 ? "last:rounded-b-lg" : ""
        }`}
      >
        <td className="px-4 py-3">
          <span
            className="inline-flex items-center px-3 py-1 rounded-md font-mono text-sm"
            style={{ background: "#F7F7F7" }}
          >
            {category._id}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-gray-200 rounded overflow-hidden bg-gray-50">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
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
            <div className="flex items-center">
              {level > 0 && (
                <>
                  {parentName && (
                    <span className="text-gray-500 mr-2">{parentName}</span>
                  )}
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
              <span className="text-sm text-gray-900 font-medium">
                {category.name}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-900">{category.description}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(category._id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy ID"
            >
              <FaCopy className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const Pagination = () => {
    const totalItems = searchQuery
      ? categories.length
      : categories.filter((category) => !category.parent).length;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          {/* <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div> */}
          <div className="w-full flex justify-end">
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="sr-only">Previous</span>
                <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === number
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {number}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="text-center py-4">
            <LoadingSpinner
              color="primary"
              text="Loading categories..."
              size="sm"
            />
          </td>
        </tr>
      );
    }

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center py-4">
            No categories found
          </td>
        </tr>
      );
    }

    const categoriesToDisplay = searchQuery
      ? categories
      : categories.filter((category) => !category.parent);

    const newTotalPages = Math.ceil(categoriesToDisplay.length / itemsPerPage);
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categoriesToDisplay.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return currentItems.map((category, idx) =>
      renderCategoryRow(category, 0, null, idx)
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* <PageHeader content="Categories" /> */}

      <div className="flex flex-col flex-1 m-4">
        <div className="flex flex-col h-full bg-white shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between px-3 py-4 border-b">
            <div className="flex items-center justify-between flex-wrap md:flex-row p-4 ">
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
                  placeholder="Search by ID, name, or description..."
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleOpenModal}
                className="block text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                style={{ backgroundColor: "#3573BA" }}
                type="button"
              >
                Add New Category
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="overflow-hidden rounded-lg m-4">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="divide-x divide-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide rounded-tl-lg">
                      Category ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Category Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 tracking-wide rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {renderTableBody()}
                </tbody>
              </table>
            </div>

            <div className="mt-auto">
              <Pagination />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCategory ? "Edit Category" : "Add New Category"}
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={handleImageClick}
                  className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    imageError || (!imagePreview && !formData.image)
                      ? "border-red-300 hover:border-red-400"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Category preview"
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
                      <p className="text-red-500 text-sm">Required</p>
                      <p className="text-gray-500" style={{ fontSize: "12px" }}>
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
                />
                {imageError && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a category image
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                />
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
                      {editingCategory ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCategory ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"?`}
        warningMessage={
          categoryToDelete?.subcategories?.length > 0
            ? "Warning: This category has subcategories. Please delete them first."
            : ""
        }
        isDisabled={categoryToDelete?.subcategories?.length > 0}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </div>
  );
}

export default Category;
