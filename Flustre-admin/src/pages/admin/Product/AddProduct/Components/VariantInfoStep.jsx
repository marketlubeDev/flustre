import React from "react";
import { useSelector } from "react-redux";
import VariantOptionsBuilder from "./VariantOptionsBuilder";
import VariantAttributesSection from "./VariantAttributesSection";

export default function VariantInfoStep({
  isLoadingProduct,
  onRequestDeleteVariant,
  onRequestBulkDeleteVariants,
}) {
  const variants = useSelector((state) => state.productCreation.variants);

  return (
    <div className="bg-white rounded-lg h-full overflow-hidden">
      <div className="p-0 h-full flex flex-col min-h-0">
        <VariantOptionsBuilder isLoadingProduct={isLoadingProduct} />
        <VariantAttributesSection
          variants={variants}
          onRequestDeleteVariant={onRequestDeleteVariant}
          onRequestBulkDeleteVariants={onRequestBulkDeleteVariants}
        />
      </div>
    </div>
  );
}
