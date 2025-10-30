import React from "react";
import { Drawer } from "antd";
import CouponForm from "./CouponForm";
import CouponView from "./CouponView";
import { IoClose } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

const CouponDrawer = ({
  open,
  onClose,
  onSubmit,
  editingCoupon,
  isSubmitting,
  formId = "coupon-form",
  mode = "create", // 'create' | 'edit' | 'view'
  onSwitchMode,
  onToggleStatus,
}) => {
  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full pr-10">
          <span>
            {mode === "view"
              ? "View Coupon"
              : editingCoupon
              ? "Edit Coupon"
              : "Add Coupon"}
          </span>
          {mode === "view" && editingCoupon && (
            <button
              type="button"
              onClick={() => onSwitchMode && onSwitchMode("edit")}
              className="flex items-center gap-2 p-0 text-gray-600 hover:text-gray-800 bg-transparent"
            >
              <AiOutlineEdit className="text-lg" />
              <span className="text-base">Edit</span>
            </button>
          )}
        </div>
      }
      closeIcon={
        <span className="text-gray-600 hover:text-gray-800 text-xl leading-none">
          <IoClose />
        </span>
      }
      open={open}
      onClose={onClose}
      placement="right"
      width="30vw"
      destroyOnClose
      maskClosable
      rootClassName="coupon-drawer"
      styles={{
        header: {
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          borderRadius: "12px 12px 0 0",
        },
        body: {
          padding: 16,
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: "0 0 12px 12px",
        },
        wrapper: {
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
      footer={
        mode === "view" ? null : (
          <div className="flex justify-end items-center px-4 py-2">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onSubmit(null, true)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {mode !== "view" && (
                <button
                  type="submit"
                  form={formId}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-[#3573BA] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? editingCoupon
                      ? "Updating..."
                      : "Creating..."
                    : editingCoupon
                    ? "Update coupon"
                    : "Create coupon"}
                </button>
              )}
            </div>
          </div>
        )
      }
    >
      {mode === "view" ? (
        <CouponView coupon={editingCoupon} onToggleStatus={onToggleStatus} />
      ) : (
        <CouponForm
          onSubmit={onSubmit}
          initialData={editingCoupon}
          isSubmitting={isSubmitting}
          formId={formId}
        />
      )}
    </Drawer>
  );
};

export default CouponDrawer;
