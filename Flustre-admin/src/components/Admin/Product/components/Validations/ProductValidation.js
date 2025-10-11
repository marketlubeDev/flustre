export const validateProduct = (productData, variants , categories) => {
  const errors = {};
  const category = categories?.find(c => c._id === productData.category);
  // Product level validations
  if (!productData.name?.trim()) errors.name = "Product name is required";
  if (!productData.category) errors.category = "Category is required";
  if (!productData.subcategory && category?.subcategories?.length > 0) errors.subcategory = "Subcategory is required";
  if (!productData.label) errors.label = "Label is required";

  // Validate variants
  if (!variants || variants.length === 0) {
    errors.variants = "At least one variant is required";
    return errors;
  }

  // Validate each variant
  variants.forEach((variant, index) => {
    const variantErrors = {};
    
    // Required fields
    if (!variant.name?.trim()) variantErrors.name = "Variant name is required";
    if (!variant.sku?.trim()) variantErrors.sku = "SKU is required";
    if (!variant.mrp) variantErrors.mrp = "MRP is required";
    if (!variant.offerPrice) variantErrors.offerPrice = "Offer price is required";
    if (!variant.costPrice) variantErrors.costPrice = "Cost price is required";
    if (!variant.description?.trim()) variantErrors.description = "Description is required";
    if (!variant.stockStatus) variantErrors.stockStatus = "Stock status is required";
    if (variant.stockQuantity === undefined || variant.stockQuantity === null || variant.stockQuantity === "") {
      variantErrors.stockQuantity = "Stock quantity is required";
    }

    // Numeric validations
    if (isNaN(variant.mrp)) variantErrors.mrp = "MRP must be a number";
    if (isNaN(variant.offerPrice)) variantErrors.offerPrice = "Offer price must be a number";
    if (isNaN(variant.costPrice)) variantErrors.costPrice = "Cost price must be a number";
    if (isNaN(variant.stockQuantity)) variantErrors.stockQuantity = "Stock quantity must be a number";

    // Price logic validations
    if (Number(variant.offerPrice) > Number(variant.mrp)) {
      variantErrors.offerPrice = "Offer price must be less than or equal to MRP";
    }

    // Image validation
    if (!variant.images?.some((image) => image)) {
      variantErrors.images = "At least one variant image is required";
    }

    // If there are any errors for this variant, add them to the main errors object
    if (Object.keys(variantErrors).length > 0) {
      errors[`variant${index}`] = variantErrors;
    }
  });

  // Check for duplicate variant names and SKUs
  const variantNames = variants.map(v => v.name?.trim());
  const variantSkus = variants.map(v => v.sku?.trim());
  
  variants.forEach((variant, index) => {
    const nameCount = variantNames.filter(name => name === variant.name?.trim()).length;
    const skuCount = variantSkus.filter(sku => sku === variant.sku?.trim()).length;
    
    if (nameCount > 1) {
      if (!errors[`variant${index}`]) errors[`variant${index}`] = {};
      errors[`variant${index}`].name = "Variant name must be unique";
    }
    
    if (skuCount > 1) {
      if (!errors[`variant${index}`]) errors[`variant${index}`] = {};
      errors[`variant${index}`].sku = "SKU must be unique";
    }
  });

  return errors;
};
