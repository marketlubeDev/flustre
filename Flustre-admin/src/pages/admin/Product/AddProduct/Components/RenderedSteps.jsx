import React from "react";
import ProductInfoStep from "./ProductInfoStep";
import FeaturesStep from "./FeaturesStep";
import VariantInfoStep from "./VariantInfoStep";
import PreviewStep from "./PreviewStep";

export default function RenderedSteps(props) {
  const {
    // common
    categories,
    showSubcategory,
    labels,
    isLoadingProduct,
    goToStep,
    // step1
    SPEC_CHAR_LIMIT,
    handleProductChange,
    getError,
    handlePasteIntoSpecInput,
    updateSpecification,
    variants,
    handleVariantFieldChange,
    customFocusStyle,
    handleFocus,
    handleBlur,
    // step2
    selectedBannerType,
    setSelectedBannerType,
    updateMultiFeatureMedia,
    updateMultiFeature,
    dragOverBannerIndex,
    handleBannerDragStart,
    handleBannerDragEnter,
    handleBannerDragOver,
    handleBannerDrop,
    handleBannerDragEnd,
    handleBannerTypeSelect,
    setProductData,
    // step3
    onRequestDeleteVariant,
    onRequestBulkDeleteVariants,
  } = props;

  const renderProductInfoStep = () => (
    <ProductInfoStep
      handleProductChange={handleProductChange}
      getError={getError}
      isLoadingProduct={isLoadingProduct}
      categories={categories}
      showSubcategory={showSubcategory}
      labels={labels}
      SPEC_CHAR_LIMIT={SPEC_CHAR_LIMIT}
      handlePasteIntoSpecInput={handlePasteIntoSpecInput}
      updateSpecification={updateSpecification}
      customFocusStyle={customFocusStyle}
      handleFocus={handleFocus}
      handleBlur={handleBlur}
    />
  );

  const renderVariantInfoStep = () => (
    <VariantInfoStep
      isLoadingProduct={isLoadingProduct}
      onRequestDeleteVariant={onRequestDeleteVariant}
      onRequestBulkDeleteVariants={onRequestBulkDeleteVariants}
    />
  );

  const renderPreviewStep = () => (
    <PreviewStep
      categories={categories}
      showSubcategory={showSubcategory}
      variants={variants}
      onEditProductInfo={() => goToStep(1)}
      onEditFeatures={() => goToStep(2)}
      onEditVariants={() => goToStep(3)}
    />
  );

  const renderFeaturesStep = () => (
    <FeaturesStep
      setProductData={setProductData}
      selectedBannerType={selectedBannerType}
      setSelectedBannerType={setSelectedBannerType}
      updateMultiFeatureMedia={updateMultiFeatureMedia}
      updateMultiFeature={updateMultiFeature}
      dragOverBannerIndex={dragOverBannerIndex}
      handleBannerDragStart={handleBannerDragStart}
      handleBannerDragEnter={handleBannerDragEnter}
      handleBannerDragOver={handleBannerDragOver}
      handleBannerDrop={handleBannerDrop}
      handleBannerDragEnd={handleBannerDragEnd}
      handleBannerTypeSelect={handleBannerTypeSelect}
    />
  );

  return {
    renderProductInfoStep,
    renderVariantInfoStep,
    renderPreviewStep,
    renderFeaturesStep,
  };
}
