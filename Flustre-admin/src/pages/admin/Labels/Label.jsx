import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "../../../components/Admin/PageHeader";
import {
  getAllLabels,
  searchLabel,
  addLabel,
  editLabel,
  deleteLabel,
} from "../../../sevices/labelApis";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTags } from "react-icons/fa";
import { getProductsByLabel } from "../../../sevices/labelApis";
import ConfirmationModal from "../../../components/Admin/ConfirmationModal";
import LabelProductsModal from "./components/LabelProductsModal";
import LabelFormModal from "./components/LabelFormModal";

function Label() {
  const [labels, setLabels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedLabelForProducts, setSelectedLabelForProducts] =
    useState(null);
  const [labelProducts, setLabelProducts] = useState([]);

  const truncateText = (text, maxLength = 80) => {
    if (typeof text !== "string") return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      const response = await getAllLabels();
      setLabels(response.envelop.data);
    } catch (error) {
      toast.error("Failed to fetch labels");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        fetchLabels();
        return;
      }

      try {
        setLoading(true);
        const response = await searchLabel(query);
        setLabels(response.label);
      } catch (error) {
        toast.error("Failed to search labels");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingLabel) {
        await editLabel(editingLabel._id, formData);
        toast.success("Label updated successfully");
      } else {
        await addLabel(formData);
        toast.success("Label added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchLabels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      description: label.description,
    });
    setShowModal(true);
  };

  const handleDelete = (labelId) => {
    const label = labels.find((l) => l._id === labelId);
    setLabelToDelete(label);
    setShowDeleteModal(true);
  };

  const handleViewProducts = async (label) => {
    try {
      setSelectedLabelForProducts(label);
      setShowProductsModal(true);
      setProductsLoading(true);
      const products = await getProductsByLabel(label._id);
      const safeProducts = Array.isArray(products) ? products : [];
      const visibleProducts = safeProducts.filter((p) => !p?.isDeleted);
      setLabelProducts(visibleProducts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setLabelToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteLabel(labelToDelete._id);
      toast.success("Label deleted successfully");
      fetchLabels();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingLabel(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#E8D8DC] rounded-xl">
                <FaTags className="w-6 h-6 text-[#6D0D26]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block w-80 pl-11 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Search labels by name..."
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: "#6D0D26" }}
              >
                <FaPlus className="w-4 h-4" />
                Add New Label
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Stats Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Total Labels:</span>
                  <span className="font-semibold text-gray-900">
                    {labels.length}
                  </span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Search Results:
                    </span>
                    <span className="font-semibold text-blue-600">
                      {labels.length}
                    </span>
                  </div>
                )}
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchLabels();
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="divide-x divide-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                      Label Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                      Label ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <LoadingSpinner color="primary" size="sm" />
                          <span className="text-sm text-gray-500">
                            Loading labels...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : labels.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-50 rounded-full">
                            <FaTags className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              No labels found
                            </h3>
                            <p className="text-gray-500 mt-1">
                              {searchQuery
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first label"}
                            </p>
                          </div>
                          {!searchQuery && (
                            <button
                              onClick={() => setShowModal(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            >
                              <FaPlus className="w-4 h-4" />
                              Create Label
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    labels.map((label, idx) => (
                      <tr
                        key={label._id}
                        className="hover:bg-gray-50 divide-x divide-gray-200 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: "#6D0D26" }}
                            >
                              <FaTags className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {label.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Label #{idx + 1}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-lg font-mono text-sm"
                            style={{ background: "#F7F7F7" }}
                          >
                            <span className="text-gray-600">
                              {label._id.slice(-8)}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-sm text-gray-700"
                            title={label.description || "No description"}
                          >
                            {label.description ? (
                              truncateText(label.description, 100)
                            ) : (
                              <span className="text-gray-400 italic">
                                No description
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(label)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150"
                              title="Edit label"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewProducts(label)}
                              className="px-3 py-1.5 text-xs font-medium text-white rounded-lg"
                              style={{ backgroundColor: "#6D0D26" }}
                              title="View products"
                            >
                              View Products
                            </button>
                            <button
                              onClick={() => handleDelete(label._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                              title="Delete label"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <LabelFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleInputChange}
        isSubmitting={isSubmitting}
        isEditing={Boolean(editingLabel)}
      />

      <LabelProductsModal
        isOpen={showProductsModal}
        onClose={() => {
          setShowProductsModal(false);
          setSelectedLabelForProducts(null);
          setLabelProducts([]);
        }}
        label={selectedLabelForProducts}
        products={labelProducts}
        loading={productsLoading}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the label "${labelToDelete?.name}"?`}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </div>
  );
}

export default Label;
