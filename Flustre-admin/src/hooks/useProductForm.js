import { useState } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../sevices/ProductApis";
import { useDispatch } from "react-redux";
import { syncPricingToVariants } from "../redux/features/productCreationSlice";

export function useProductForm({
  navigate,
  productData,
  setProductData,
  variants,
  onSubmit, // optional: function(formData) to save (create/update)
}) {
  const [errors, setErrors] = useState({ product: {}, variants: {} });
  const SPEC_CHAR_LIMIT = 140;
  const dispatch = useDispatch();

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "category") {
        newData.subcategory = "";
      }

      // Sync pricing to variants when pricing fields change
      if (
        name === "price" ||
        name === "compareAtPrice" ||
        name === "costPerItem"
      ) {
        // Use setTimeout to ensure state is updated before syncing
        setTimeout(() => {
          dispatch(syncPricingToVariants());
        }, 0);
      }

      return newData;
    });
  };

  const updateSpecification = (idx, value) => {
    setProductData((prev) => {
      const list = [...(prev.specifications || [])];
      list[idx] = value;
      return { ...prev, specifications: list };
    });
  };

  const handlePasteIntoSpecInput = (idx, e) => {
    const text = e.clipboardData?.getData("text") || "";
    if (/\r?\n/.test(text)) {
      e.preventDefault();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.slice(0, SPEC_CHAR_LIMIT));
      if (lines.length === 0) return;
      setProductData((prev) => {
        const list = [...(prev.specifications || [])];
        list[idx] = lines[0];
        if (lines.length > 1) {
          list.splice(idx + 1, 0, ...lines.slice(1));
        }
        return { ...prev, specifications: list };
      });
    }
  };

  const handlePublishProduct = async () => {
    try {
      if (!productData.name?.trim()) {
        toast.error("Product name is required");
        return;
      }
      if (!productData.category) {
        toast.error("Category is required");
        return;
      }
      if (!productData.label || productData.label === "") {
        toast.error("Label is required");
        return;
      }
      if (!variants || variants.length === 0) {
        toast.error("At least one variant is required");
        return;
      }

      const generateSKU = (productName, variantIndex, variantName) => {
        const productPrefix = productName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 6);
        const variantSuffix = variantName
          ? variantName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .substring(0, 3)
          : `var${variantIndex + 1}`;
        const timestamp = Date.now().toString().slice(-4);
        return `${productPrefix}-${variantSuffix}-${timestamp}`.toUpperCase();
      };

      const processedVariants = variants.map((variant, index) => {
        if (!variant.sku?.trim()) {
          const generatedSKU = generateSKU(
            productData.name,
            index,
            variant.name
          );
          return { ...variant, sku: generatedSKU };
        }
        return variant;
      });

      for (let i = 0; i < processedVariants.length; i++) {
        const variant = processedVariants[i];
        if (!variant.mrp || isNaN(variant.mrp)) {
          toast.error(`Valid MRP is required for variant ${i + 1}`);
          return;
        }
        if (!variant.offerPrice || isNaN(variant.offerPrice)) {
          toast.error(`Valid offer price is required for variant ${i + 1}`);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("subcategory", productData.subcategory);
      formData.append("label", productData.label);
      formData.append("priority", productData.priority);
      formData.append("activeStatus", productData.activeStatus);
      formData.append("about", productData.about);
      formData.append("returnPolicyDays", productData.returnPolicyDays);
      formData.append("returnPolicyText", productData.returnPolicyText);

      // Use product-level pricing for the base product
      const basePrice = productData.price || "";
      const baseCompareAt = productData.compareAtPrice || "";
      const baseCost = productData.costPerItem || "";
      const baseProfit = (() => {
        const priceNum = parseFloat(basePrice || "0");
        const costNum = parseFloat(baseCost || "0");
        const p = priceNum - costNum;
        return Number.isFinite(p) ? p.toString() : "0";
      })();
      formData.append("price", basePrice);
      formData.append("compareAtPrice", baseCompareAt);
      formData.append("profit", baseProfit);
      formData.append("costPerItem", baseCost);

      // Send product-level options as JSON string (server expects this format)
      if (productData.options && Array.isArray(productData.options) && productData.options.length > 0) {
        const validOptions = productData.options.filter(opt => 
          opt && 
          typeof opt === "object" && 
          opt.name && 
          Array.isArray(opt.values) && 
          opt.values.length > 0
        );
        
        if (validOptions.length > 0) {
          formData.append("options", JSON.stringify(validOptions));
        }
      }

      if (productData.specifications && productData.specifications.length > 0) {
        productData.specifications.forEach((spec, index) => {
          if (spec && spec.trim()) {
            formData.append(`specifications[${index}]`, spec.trim());
          }
        });
      }

      if (productData.featureImages && productData.featureImages.length > 0) {
        productData.featureImages.forEach((image) => {
          if (image && image instanceof File) {
            formData.append(`featureImages`, image);
          }
        });
      }

      if (
        productData.featuresSections &&
        productData.featuresSections.length > 0
      ) {
        productData.featuresSections.forEach((section, sectionIndex) => {
          formData.append(
            `featuresSections[${sectionIndex}].layout`,
            section.layout || "banner"
          );
          formData.append(
            `featuresSections[${sectionIndex}].imagePosition`,
            section.imagePosition || "right"
          );
          formData.append(
            `featuresSections[${sectionIndex}].mediaType`,
            section.mediaType || "image"
          );
          formData.append(
            `featuresSections[${sectionIndex}].title`,
            section.title || ""
          );
          formData.append(
            `featuresSections[${sectionIndex}].description`,
            section.description || ""
          );
          formData.append(
            `featuresSections[${sectionIndex}].mediaUrl`,
            section.mediaUrl || ""
          );
          if (section.mediaFile && section.mediaFile instanceof File) {
            formData.append(
              `featuresSections[${sectionIndex}].mediaFile`,
              section.mediaFile
            );
          }
        });
      }

      if (processedVariants && processedVariants.length > 0) {
        processedVariants.forEach((variant, variantIndex) => {
          if (variant._id) {
            formData.append(`variants[${variantIndex}][_id]`, variant._id);
          }
          formData.append(`variants[${variantIndex}][sku]`, variant.sku || "");
          formData.append(
            `variants[${variantIndex}][price]`,
            variant.mrp || ""
          );
          formData.append(
            `variants[${variantIndex}][compareAtPrice]`,
            variant.offerPrice || ""
          );
          formData.append(
            `variants[${variantIndex}][quantity]`,
            variant.stockQuantity || ""
          );
          formData.append(
            `variants[${variantIndex}][options]`,
            JSON.stringify(variant.options || {})
          );
          // Handle multiple images per variant
          if (Array.isArray(variant.images)) {
            variant.images.forEach((img, imgIndex) => {
              if (img instanceof File) {
                // New file uploads
                formData.append(
                  `variants[${variantIndex}][images][${imgIndex}]`,
                  img
                );
              } else if (typeof img === "string" && img.trim()) {
                // Existing uploaded images (URLs)
                formData.append(
                  `variants[${variantIndex}][existingImages][${imgIndex}]`,
                  img
                );
              }
            });
          }
        });
      }

      if (typeof onSubmit === "function") {
        const response = await onSubmit(formData);
        // If submit succeeds, navigate back to product list
        if (response && (response.status === 200 || response.status === 201)) {
          setTimeout(() => {
            navigate("/admin/product");
          }, 1000);
        }
        return;
      }

      // Fallback (legacy) create-only path
      const response = await addProduct(formData);
      if (response.status === 201) {
        toast.success("Product created successfully!");
        setTimeout(() => {
          navigate("/admin/product");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Failed to create product";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const getError = (field, isVariant = false, variantIndex = null) => {
    if (isVariant && variantIndex !== null) {
      return errors.variants[variantIndex]?.[field];
    }
    return errors.product[field];
  };

  return {
    errors,
    setErrors,
    SPEC_CHAR_LIMIT,
    handleProductChange,
    updateSpecification,
    handlePasteIntoSpecInput,
    handlePublishProduct,
    getError,
  };
}
