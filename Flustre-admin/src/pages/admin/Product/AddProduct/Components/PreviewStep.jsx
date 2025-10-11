import React from "react";
import { useSelector } from "react-redux";
import ProductPreview from "./ProductPreview";

export default function PreviewStep({
  categories,
  showSubcategory,
  variants,
  onEditProductInfo,
  onEditFeatures,
  onEditVariants,
}) {
  const productData = useSelector((state) => state.productCreation.productData);
  return (
    <ProductPreview
      productData={productData}
      categories={categories}
      showSubcategory={showSubcategory}
      variants={variants}
      onEditProductInfo={onEditProductInfo}
      onEditFeatures={onEditFeatures}
      onEditVariants={onEditVariants}
    />
  );
}
