import React from "react";
import { useSelector } from "react-redux";
import { useVariantContext } from "../../../../../contexts/VariantContext";
import ProductInfoSection from "./ProductInfoSection";

export default function ProductInfoStep({
  handleProductChange,
  getError,
  isLoadingProduct,
  categories,
  showSubcategory,
  labels,
  SPEC_CHAR_LIMIT,
  handlePasteIntoSpecInput,
  updateSpecification,
  customFocusStyle,
  handleFocus,
  handleBlur,
}) {
  const productData = useSelector((state) => state.productCreation.productData);
  const variants = useSelector((state) => state.productCreation.variants);
  const { handleVariantFieldChange } = useVariantContext();
  
  return (
    <ProductInfoSection
      productData={productData}
      handleProductChange={handleProductChange}
      getError={getError}
      isLoadingProduct={isLoadingProduct}
      categories={categories}
      showSubcategory={showSubcategory}
      labels={labels}
      SPEC_CHAR_LIMIT={SPEC_CHAR_LIMIT}
      handlePasteIntoSpecInput={handlePasteIntoSpecInput}
      updateSpecification={updateSpecification}
      variants={variants}
      handleVariantFieldChange={handleVariantFieldChange}
      customFocusStyle={customFocusStyle}
      handleFocus={handleFocus}
      handleBlur={handleBlur}
    />
  );
}
