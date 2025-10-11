import React from "react";

export default function StepContent({
  currentStep,
  renderProductInfoStep,
  renderFeaturesStep,
  renderVariantInfoStep,
  renderPreviewStep,
}) {
  const render = () => {
    switch (currentStep) {
      case 1:
        return renderProductInfoStep();
      case 2:
        return renderFeaturesStep();
      case 3:
        return renderVariantInfoStep();
      case 4:
        return renderPreviewStep();
      default:
        return renderProductInfoStep();
    }
  };

  return <>{render()}</>;
}
