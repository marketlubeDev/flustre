import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productData: {
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    store: "",
    label: "test",
    activeStatus: true,
    priority: 0,
    about: "",
    specifications: [""],
    returnPolicyDays: 7,
    returnPolicyText: "",
    featureImages: [null],
    price: 0,
    compareAtPrice: 0,
    costPerItem: 0,
    options: [
      {
        name: "",
        values: [""],
      },
    ],
    featuresSection: {
      layout: "banner",
      imagePosition: "right",
      mediaType: "image",
      title: "",
      description: "",
      mediaUrl: "",
      mediaFile: null,
    },
    featuresSections: [
      {
        layout: "banner",
        imagePosition: "right",
        mediaType: "image",
        title: "",
        description: "",
        mediaUrl: "",
        mediaFile: null,
      },
    ],
  },
  variants: [
    {
      name: "",
      sku: "",
      mrp: 0,
      offerPrice: 0,
      costPrice: 0,
      description: "",
      images: [null, null, null, null],
      stockStatus: "instock",
      stockQuantity: "0",
      options: {},
    },
  ],
};

const productCreationSlice = createSlice({
  name: "productCreation",
  initialState,
  reducers: {
    setProductData(state, action) {
      state.productData = action.payload;
    },
    updateProductData(state, action) {
      Object.assign(state.productData, action.payload);
    },
    setVariants(state, action) {
      state.variants = action.payload;
    },
    updateVariantByIndex(state, action) {
      const { index, changes } = action.payload || {};
      if (
        typeof index === "number" &&
        index >= 0 &&
        index < state.variants.length &&
        changes &&
        typeof changes === "object"
      ) {
        Object.assign(state.variants[index], changes);
      }
    },
    resetProductCreation(state) {
      state.productData = initialState.productData;
      state.variants = initialState.variants;
    },
    setStoreIdInProduct(state, action) {
      state.productData.store = action.payload || "";
    },
    syncPricingToVariants(state) {
      // Sync product-level pricing to all variants
      const { price, compareAtPrice, costPerItem } = state.productData;
      state.variants.forEach((variant) => {
        variant.mrp = price;
        variant.offerPrice = compareAtPrice;
        variant.costPrice = costPerItem;
      });
    },
    updateProductOptions(state, action) {
      // Update product options when variant types are added/modified
      state.productData.options = action.payload || [];
    },
  },
});

export const {
  setProductData,
  updateProductData,
  setVariants,
  updateVariantByIndex,
  resetProductCreation,
  setStoreIdInProduct,
  syncPricingToVariants,
  updateProductOptions,
} = productCreationSlice.actions;

export default productCreationSlice.reducer;
