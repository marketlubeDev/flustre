import React from "react";
import StepContent from "./StepContent";
import ProductStatusSelect from "./ProductStatusSelect";
import BottomNavigation from "./BottomNavigation";

export default function RightPanel({
  currentStep,
  renderProductInfoStep,
  renderFeaturesStep,
  renderVariantInfoStep,
  renderPreviewStep,
  productStatusValue,
  onProductStatusChange,
  isControlDisabled,
  onCancel,
  onNext,
  onCreate,
  isFinalStep,
  isSaving,
  isEditMode = false,
}) {
  return (
    <div className="w-full lg:w-[85%] px-2 rounded-lg ">
      <div
        className="flex-1 min-w-0 mt-5 rounded-lg h-[calc(100vh-140px)]"
        style={{ backgroundColor: "#F6F6F6" }}
      >
        <div className="p-6 rounded-lg h-[100%] bg-[#F6F6F6]">
          <div className="bg-white rounded-lg h-[100%] overflow-y-auto">
            <StepContent
              currentStep={currentStep}
              renderProductInfoStep={renderProductInfoStep}
              renderFeaturesStep={renderFeaturesStep}
              renderVariantInfoStep={renderVariantInfoStep}
              renderPreviewStep={renderPreviewStep}
            />
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <ProductStatusSelect
            value={productStatusValue}
            onChange={onProductStatusChange}
            disabled={isControlDisabled}
          />
          <BottomNavigation
            onCancel={onCancel}
            onNext={onNext}
            onCreate={onCreate}
            isFinalStep={isFinalStep}
            isSaving={isSaving}
            isDisabled={isControlDisabled}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
}
