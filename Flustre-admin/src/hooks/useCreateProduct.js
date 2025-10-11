import { useState, useCallback } from "react";
import { addProduct, updateProduct } from "../sevices/ProductApis";
import { toast } from "react-toastify";
import { triggerProductCreated, triggerProductUpdated } from "../utils/menuCountUtils";

/**
 * Hook to create or update a product using FormData.
 * Consumers should pass a FormData built from current UI state.
 */
export function useCreateOrUpdateProduct({
  isEditMode = false,
  productId = null,
} = {}) {
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    async (formData) => {
      setIsSaving(true);
      try {
        const response =
          isEditMode && productId
            ? await updateProduct(productId, formData)
            : await addProduct(formData);

        toast.success(
          isEditMode
            ? "Product updated successfully"
            : "Product added successfully"
        );

        // Trigger menu count updates
        if (isEditMode) {
          triggerProductUpdated();
        } else {
          triggerProductCreated();
        }

        return response;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error saving product");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [isEditMode, productId]
  );

  return { save, isSaving };
}
