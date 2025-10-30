import React from "react";

function BottomNavigation({
  onCancel,
  onNext,
  onCreate,
  isFinalStep,
  isSaving,
  isDisabled,
  isEditMode = false,
}) {
  const handlePrimaryClick = isFinalStep ? onCreate : onNext;

  return (
    <div className="flex items-center gap-3 mb-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors text-[#FB3748]"
        disabled={isDisabled}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handlePrimaryClick}
        disabled={isSaving || isDisabled}
        className="px-6 py-2 text-sm text-white transition-colors disabled:opacity-50"
        style={{
          borderRadius: "8px",
          borderBottom: "1px solid #6C9BC8",
          background: "linear-gradient(180deg, #3573BA 30.96%, #6FA0D5 100%)",
          boxShadow: "0 1px 2px 0 rgba(92, 139, 189, 0.5)",
          minWidth: "120px",
        }}
      >
        {isSaving
          ? "Saving..."
          : isFinalStep
          ? isEditMode
            ? "Update Product"
            : "Create Product"
          : "Next"}
      </button>
    </div>
  );
}

export default BottomNavigation;
