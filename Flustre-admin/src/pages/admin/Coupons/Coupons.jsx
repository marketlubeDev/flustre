import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import PageHeader from "../../../components/Admin/PageHeader";
import { toast } from "react-toastify";
import SearchInput from "../../../components/common/SearchInput";
import CommonButton from "../../../components/common/Button";
import PlusIcon from "../../../components/common/icons/PlusIcon";
import {
  createCoupon,
  editCoupon,
  searchCoupon,
  removeCoupon,
  getAllCoupons,
} from "../../../sevices/couponApi";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import CouponDrawer from "./Components/CouponDrawer";
import CouponCard from "./Components/CouponCard";
import { RiDeleteBin6Line } from "react-icons/ri";
import { triggerCouponCreated, triggerCouponDeleted } from "../../../utils/menuCountUtils";

//

// Add this new component for delete confirmation
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  couponCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Delete Coupon</h2>
          <button
            onClick={onClose}
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
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the coupon{" "}
            <span className="font-semibold">{couponCode}</span>? This action
            cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Coupon Component
const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [drawerMode, setDrawerMode] = useState("create"); // 'create' | 'edit' | 'view'

  // Fetch all coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch coupons function
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCoupons();
      setCoupons(response.coupons);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setIsLoading(true);
          const response = await searchCoupon(searchQuery);
          setCoupons(response.data.coupons);
        } catch (error) {
          toast.error(error.response?.data?.message || "Search failed");
        } finally {
          setIsLoading(false);
        }
      } else {
        fetchCoupons();
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSubmit = async (formData, isCancel = false) => {
    if (isCancel) {
      setShowModal(false);
      setEditingCoupon(null);
      setDrawerMode("create");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await editCoupon(editingCoupon._id, formData);
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(formData);
        toast.success("Coupon created successfully");
        // Trigger menu count update for new coupon
        triggerCouponCreated();
      }
      setShowModal(false);
      setEditingCoupon(null);
      setDrawerMode("create");
      fetchCoupons(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setDrawerMode("edit");
    setShowModal(true);
  };

  const handleView = (coupon) => {
    setEditingCoupon(coupon);
    setDrawerMode("view");
    setShowModal(true);
  };

  const handleDelete = async (couponId, couponCode) => {
    setCouponToDelete({ id: couponId, code: couponCode });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // If bulk delete is queued, use selectedIds
      if (couponToDelete?.id) {
        await removeCoupon(couponToDelete.id);
      } else if (selectedIds.size > 0) {
        // sequentially delete for now; can be optimized with bulk API later
        for (const id of selectedIds) {
          await removeCoupon(id);
        }
      }
      toast.success("Coupon(s) deleted successfully");
      
      // Trigger menu count update for deleted coupons
      triggerCouponDeleted();
      
      fetchCoupons(); // Refresh the list
      setDeleteModalOpen(false);
      setCouponToDelete(null);
      setSelectedIds(new Set());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (couponId, newStatus) => {
    try {
      await editCoupon(couponId, { isActive: newStatus });
      toast.success(
        `Coupon ${newStatus ? "activated" : "deactivated"} successfully`
      );
      fetchCoupons(); // Refresh the list
      // Update the editing coupon if it's currently being viewed
      if (editingCoupon && editingCoupon._id === couponId) {
        setEditingCoupon({ ...editingCoupon, isActive: newStatus });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update coupon status"
      );
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allIds = coupons.map((c) => c._id);
  const isAllSelected =
    selectedIds.size > 0 && selectedIds.size === allIds.length;
  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === allIds.length) return new Set();
      return new Set(allIds);
    });
  };

  return (
    <div className="flex flex-col ">
      {/* <PageHeader content="Coupons" /> */}
      <div className="flex justify-between items-center m-5">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedIds.size === 0 ? (
          <CommonButton
            onClick={() => {
              setEditingCoupon(null);
              setDrawerMode("create");
              setShowModal(true);
            }}
            variant="gradientRose"
            size="medium"
            className="gap-2"
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Add Coupon
          </CommonButton>
        ) : (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-rose-600 "
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
              Select all
            </label>
            <CommonButton
              onClick={() => {
                setCouponToDelete(null); // indicate bulk
                setDeleteModalOpen(true);
              }}
              variant="outline"
              size="small"
              className="gap-2 text-red-600 border-red-200 "
              leftIcon={<RiDeleteBin6Line className="w-3 h-3" />}
            >
              Delete coupon
            </CommonButton>
          </div>
        )}
      </div>
      <div className="flex flex-col m-4">
        <div className="flex flex-col flex-1">
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <LoadingSpinner
                color="primary"
                text="Loading coupons..."
                size="sm"
              />
            ) : coupons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No coupons found
              </div>
            ) : (
              <CouponCard
                coupons={coupons}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={(id, code) => handleDelete(id, code)}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CouponDrawer
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          editingCoupon={editingCoupon}
          isSubmitting={isSubmitting}
          formId="coupon-form"
          mode={drawerMode}
          onSwitchMode={setDrawerMode}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add the DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCouponToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        couponCode={couponToDelete?.code}
      />
    </div>
  );
};

export default Coupon;
