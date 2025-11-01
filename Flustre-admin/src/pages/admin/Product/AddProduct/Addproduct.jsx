import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminUtilities } from "../../../../sevices/adminApis";
import { getProductById, deleteVariant } from "../../../../sevices/ProductApis";
import { toast } from "react-toastify";
import StepSidebar from "./Components/StepSidebar";
import RenderedSteps from "./Components/RenderedSteps";
import RightPanel from "./Components/RightPanel";
import ConfirmationModal from "../../../../components/Admin/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrUpdateProduct } from "../../../../hooks/useCreateProduct";
import { useFeaturesSections } from "../../../../hooks/useFeaturesSections";
import { VariantProvider } from "../../../../contexts/VariantContext";
import { dedupeNormalizeVariants } from "../../../../utils/variants";
import { useProductForm } from "../../../../hooks/useProductForm";
import {
  setProductData as setProductDataAction,
  setVariants as setVariantsAction,
  setStoreIdInProduct,
  resetProductCreation,
  updateProductOptions,
} from "../../../../redux/features/productCreationSlice";

export default function Addproduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productIdFromQuery = searchParams.get("productId");
  const productId = location.state?.productId || productIdFromQuery;
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.store);
  const productData = useSelector((state) => state.productCreation.productData);
  const variants = useSelector((state) => state.productCreation.variants);

  console.log(productData, "productDatacvbk");

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, name: "Product Info", description: "Basic product information" },
    {
      id: 2,
      name: "Features",
      description: "Product features and specifications",
    },
    {
      id: 3,
      name: "Variant Info",
      description: "Product variants and pricing",
    },
    { id: 4, name: "Preview", description: "Review before publishing" },
  ];

  // Dispatch-compatible setters to preserve existing API for children
  const setProductData = (updater) => {
    if (typeof updater === "function") {
      const next = updater(productData);
      dispatch(setProductDataAction(next));
    } else {
      dispatch(setProductDataAction(updater));
    }
  };
  const setVariants = (updater) => {
    if (typeof updater === "function") {
      const next = updater(variants);
      dispatch(setVariantsAction(next));
    } else {
      dispatch(setVariantsAction(updater));
    }
  };
  const updateProductOptionsAction = (options) => {
    dispatch(updateProductOptions(options));
  };
  const [activeVariant, setActiveVariant] = useState(0);
  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [showSubcategory, setShowSubcategory] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { save, isSaving } = useCreateOrUpdateProduct({
    isEditMode,
    productId,
  });
  const {
    errors,
    setErrors,
    SPEC_CHAR_LIMIT,
    handleProductChange,
    updateSpecification,
    handlePasteIntoSpecInput,
    handlePublishProduct,
    getError,
  } = useProductForm({
    navigate,
    productData,
    setProductData,
    variants,
    onSubmit: save,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [isDeletingVariant, setIsDeletingVariant] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [showBulkSpecAdd, setShowBulkSpecAdd] = useState(false);
  const [bulkSpecText, setBulkSpecText] = useState("");

  // Hooks: Features and Variant Options
  const {
    selectedBannerType,
    setSelectedBannerType,
    draggedBannerIndex,
    dragOverBannerIndex,
    handleBannerDragStart,
    handleBannerDragEnter,
    handleBannerDragOver,
    handleBannerDrop,
    handleBannerDragEnd,
    handleBannerTypeSelect,
    updateMultiFeature,
    updateMultiFeatureMedia,
  } = useFeaturesSections({ productData, setProductData, toast });

  // Variant context will handle all variant-related state and logic

  // Custom focus style for burgundy color
  const customFocusStyle = {
    "--tw-ring-color": "#3573BA",
    "--tw-ring-opacity": "0.5",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#3573BA";
    e.target.style.outline = "none";
    e.target.style.boxShadow = "0 0 0 3px rgba(53, 115, 186, 0.1)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#D1D5DB";
    e.target.style.boxShadow = "none";
  };

  useEffect(() => {
    if (productData?.category && categories.length > 0) {
      const selectedCategory = categories.find(
        (c) => c._id === productData.category
      );
      setShowSubcategory(selectedCategory?.subcategories || []);
    } else {
      setShowSubcategory([]);
    }
  }, [productData.category, categories]);

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        const response = await adminUtilities();
        setCategories(response?.data.categories);
        setLabels(response?.data.labels);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error fetching utilities"
        );
      }
    };
    fetchUtilities();
  }, []);

  useEffect(() => {}, [showSubcategory]);

  useEffect(() => {
    if (store?._id) {
      dispatch(setStoreIdInProduct(store._id));
    }
  }, [store?._id]);

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      setIsLoadingProduct(true);
      const fetchProduct = async () => {
        try {
          const res = await getProductById(productId);
          const prod = res.data;

          console.log("Product data from API:", prod);
          console.log("Category:", prod.category);
          console.log("Subcategory:", prod.subcategory);
          console.log("Extracted category ID:", prod.category?._id || "");
          console.log(
            "Extracted subcategory ID:",
            prod.subcategory?._id || prod.subcategory || ""
          );

          setProductData({
            name: prod.name || "",
            category: prod.category?._id || "",
            subcategory: prod.subcategory?._id || prod.subcategory || "",
            store: prod.store?._id || "",
            label: prod.label?._id || "",
            activeStatus: prod.activeStatus ?? true,
            priority: prod.priority ?? 0,
            about: prod.about || "",
            // Product-level pricing fields
            price: prod.price || "",
            compareAtPrice: prod.compareAtPrice || "",
            profit: prod.profit || "",
            costPerItem: prod.costPerItem || "",
            specifications:
              prod.specifications && prod.specifications.length > 0
                ? prod.specifications
                : [""],
            returnPolicyDays: prod.returnPolicyDays ?? 7,
            returnPolicyText: prod.returnPolicyText || "",
            featureImages: prod.featureImages || [null],
            options: prod.options || [],
            featuresSection: {
              layout: prod.featuresSection?.layout || "banner",
              imagePosition: prod.featuresSection?.imagePosition || "right",
              mediaType: prod.featuresSection?.mediaType || "image",
              title: prod.featuresSection?.title || "",
              description: prod.featuresSection?.description || "",
              mediaUrl: prod.featuresSection?.mediaUrl || "",
              mediaFile: null,
            },
            featuresSections:
              Array.isArray(prod.featuresSections) &&
              prod.featuresSections.length > 0
                ? prod.featuresSections.map((s) => ({
                    layout: s?.layout || "banner",
                    imagePosition: s?.imagePosition || "right",
                    mediaType: s?.mediaType || "image",
                    title: s?.title || "",
                    description: s?.description || "",
                    mediaUrl: s?.mediaUrl || "",
                    mediaFile: null,
                  }))
                : [
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
          });
          setVariants(
            (prod.variants || []).map((v, index) => {
              // Generate variant name from variant.options object
              let variantName = `Variant ${index + 1}`;

              if (v.options && typeof v.options === "object") {
                const optionParts = [];

                // Build name from the variant's options object
                Object.entries(v.options).forEach(
                  ([optionName, optionValue]) => {
                    if (optionName && optionValue) {
                      optionParts.push(`${optionName}: ${optionValue}`);
                    }
                  }
                );

                if (optionParts.length > 0) {
                  variantName = optionParts.join(" / ");
                }
              }

              return {
                name: variantName,
                sku: v.sku || "",
                mrp: v.compareAtPrice || "",
                offerPrice: v.price || "",
                costPrice: v.costPerItem || "",
                description: "",
                images: v.images || [null, null, null, null],
                stockStatus: "instock",
                stockQuantity: v.quantity === 0 ? "0" : v.quantity || "",
                _id: v._id,
              };
            })
          );
        } catch (err) {
          toast.error("Failed to fetch product details");
        } finally {
          setIsLoadingProduct(false);
        }
      };
      fetchProduct();
    } else {
      // If no productId, ensure we are in create mode with a clean state
      setIsEditMode(false);
      dispatch(resetProductCreation());
    }
  }, [productId]);

  // Variant field change is now handled by the context

  // Remove a variant
  const handleRemoveVariant = async (idx) => {
    if (variants.length === 1) return; // Don't allow removing last variant
    const variant = variants[idx];

    if (isEditMode && variant._id) {
      setIsDeletingVariant(true);
      try {
        await deleteVariant(variant._id);
        // Optionally show a toast here for success
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to delete variant"
        );
        setIsDeletingVariant(false);
        setShowDeleteModal(false);
        return;
      }
      setIsDeletingVariant(false);
    }

    // Remove from UI state
    const newVariants = variants.filter((_, i) => i !== idx);
    let newActive = activeVariant;
    if (idx === activeVariant) {
      newActive = 0;
    } else if (idx < activeVariant) {
      newActive = activeVariant - 1;
    }
    setVariants(newVariants);
    setActiveVariant(newActive);
    setShowDeleteModal(false);
  };

  // Request delete for a single variant by index
  const requestDeleteVariant = (variantIndex) => {
    setVariantToDelete(variantIndex);
    setShowDeleteModal(true);
  };

  // Bulk remove variants by indices
  const handleBulkRemoveVariants = async (indices) => {
    if (!Array.isArray(indices) || indices.length === 0) {
      setShowDeleteModal(false);
      return;
    }
    // Sort descending so we can splice safely by index
    const sorted = [...indices].sort((a, b) => b - a);
    setIsDeletingVariant(true);
    try {
      if (isEditMode) {
        // Attempt API delete for any variant with _id
        for (const idx of sorted) {
          const v = variants[idx];
          if (v && v._id) {
            try {
              await deleteVariant(v._id);
            } catch (e) {
              // Continue deleting others, but notify
              toast.error(
                e?.response?.data?.message ||
                  `Failed to delete variant at index ${idx + 1}`
              );
            }
          }
        }
      }

      // Update UI state
      const toDelete = new Set(sorted);
      const newVariants = variants.filter((_, i) => !toDelete.has(i));
      setVariants(newVariants);
      // Reset active variant if needed
      setActiveVariant(0);
    } finally {
      setIsDeletingVariant(false);
      setShowDeleteModal(false);
      setVariantToDelete(null);
    }
  };

  // Request bulk delete (from table header)
  const requestBulkDeleteVariants = (indices) => {
    setVariantToDelete(Array.isArray(indices) ? indices : []);
    setShowDeleteModal(true);
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  console.log(productData, "productData");
  const {
    renderProductInfoStep,
    renderVariantInfoStep,
    renderPreviewStep,
    renderFeaturesStep,
  } = RenderedSteps({
    productData,
    categories,
    showSubcategory,
    labels,
    isLoadingProduct,
    goToStep,
    SPEC_CHAR_LIMIT,
    handleProductChange,
    getError,
    handlePasteIntoSpecInput,
    updateSpecification,
    variants,
    customFocusStyle,
    handleFocus,
    handleBlur,
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
    onRequestDeleteVariant: requestDeleteVariant,
    onRequestBulkDeleteVariants: requestBulkDeleteVariants,
  });
  return (
    <VariantProvider
      variants={variants}
      setVariants={setVariants}
      setActiveVariant={setActiveVariant}
      setProductData={setProductData}
      updateProductOptions={updateProductOptionsAction}
    >
      <div className="min-h-screen bg-white">
        {isLoadingProduct && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderBottomColor: "#3573BA" }}
              ></div>
              <p className="text-gray-600 font-medium">
                Loading product details...
              </p>
            </div>
          </div>
        )}

        <div className="w-full mx-auto">
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Side - Vertical Step Navigation */}
            <StepSidebar
              steps={steps}
              currentStep={currentStep}
              goToStep={goToStep}
            />
            {/* Right Side - Step Content with Gray Background */}
            <RightPanel
              currentStep={currentStep}
              renderProductInfoStep={renderProductInfoStep}
              renderFeaturesStep={renderFeaturesStep}
              renderVariantInfoStep={renderVariantInfoStep}
              renderPreviewStep={renderPreviewStep}
              productStatusValue={productData.activeStatus}
              onProductStatusChange={handleProductChange}
              isControlDisabled={isLoadingProduct}
              onCancel={() => navigate(-1)}
              onNext={nextStep}
              onCreate={handlePublishProduct}
              isFinalStep={currentStep === 4}
              isSaving={isSaving}
              isEditMode={isEditMode}
            />
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (Array.isArray(variantToDelete)) {
              return handleBulkRemoveVariants(variantToDelete);
            }
            return handleRemoveVariant(
              typeof variantToDelete === "number"
                ? variantToDelete
                : variants.findIndex((v) => v._id === variantToDelete)
            );
          }}
          title="Delete Variant"
          message={
            Array.isArray(variantToDelete) && variantToDelete.length > 1
              ? `Are you sure you want to delete ${variantToDelete.length} variants? This action cannot be undone.`
              : "Are you sure you want to delete this variant? This action cannot be undone."
          }
          confirmButtonText={
            isDeletingVariant
              ? "Deleting..."
              : Array.isArray(variantToDelete) && variantToDelete.length > 1
              ? "Delete variants"
              : "Delete"
          }
          confirmButtonColor="red"
          isLoading={isDeletingVariant}
          isDisabled={isDeletingVariant}
        />
      </div>
    </VariantProvider>
  );
}
