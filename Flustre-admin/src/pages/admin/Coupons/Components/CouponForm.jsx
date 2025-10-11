import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../../sevices/categoryApis";
import { getAllSubCategories } from "../../../../sevices/subcategoryApis";
import { searchProducts } from "../../../../sevices/ProductApis";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CouponBasicsFields from "./CouponBasicsFields";
import CouponApplicabilityValidity from "./CouponApplicabilityValidity";

const CouponForm = ({
  onSubmit,
  initialData,
  isSubmitting,
  formId = "coupon-form",
}) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,
          expiryDate: new Date(initialData.expiryDate)
            .toISOString()
            .split("T")[0],
          isActive: initialData?.isActive ?? true,
          usageLimit: initialData?.usageLimit ?? "",
          applyTo: initialData?.applyTo ?? "",
          categoryId: initialData?.categoryId ?? "",
          subcategoryId: initialData?.subcategoryId ?? "",
          productIds: Array.isArray(initialData?.productIds)
            ? initialData.productIds
            : initialData?.productId
            ? [initialData.productId]
            : [],
        }
      : {
          code: "",
          discountType: "percentage",
          discountAmount: "",
          minPurchase: "",
          maxDiscount: "",
          expiryDate: "",
          description: "",
          isActive: true,
          usageLimit: "",
          applyTo: "",
          categoryId: "",
          subcategoryId: "",
          productIds: [],
        }
  );

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [basicsOpen, setBasicsOpen] = useState(true);
  const [validityOpen, setValidityOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    // Ensure minPurchase is set for backend requirement
    if (payload.applyTo === "order") {
      payload.minPurchase = Number(payload.minPurchase || 0);
    } else {
      payload.minPurchase = 0;
    }
    if (payload.applyTo !== "product") {
      payload.productIds = [];
    }
    onSubmit(payload);
  };

  // Function to handle discount type change
  const handleDiscountTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      discountType: newType,
      discountAmount: "", // Reset discount amount when type changes
    }));
  };

  // Function to handle discount amount change
  const handleDiscountAmountChange = (e) => {
    const value = e.target.value;
    if (formData.discountType === "percentage") {
      // For percentage, limit between 0 and 100
      if (value >= 0 && value <= 100) {
        setFormData((prev) => ({ ...prev, discountAmount: value }));
      }
    } else {
      // For fixed amount, any positive number
      if (value >= 0) {
        setFormData((prev) => ({ ...prev, discountAmount: value }));
      }
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getAllCategories();
        if (isMounted)
          setCategories(
            res?.categories ||
              res?.data?.categories ||
              res?.envelop?.data ||
              res?.data?.envelop?.data ||
              []
          );
      } catch (err) {
        // fail silently; category is optional in backend schema
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lazy load subcategories when needed
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (formData.applyTo === "subcategory") {
        try {
          const res = await getAllSubCategories();
          if (isMounted)
            setSubcategories(
              res?.subcategories || res?.data?.subcategories || res || []
            );
        } catch (_) {}
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [formData.applyTo]);

  const handleApplyToChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      applyTo: value,
      // Reset related selections when switching type
      productIds: [],
      categoryId: "",
      subcategoryId: "",
      minPurchase: value === "order" ? prev.minPurchase : "",
    }));
    setProductSearchTerm("");
    setProductResults([]);
    setSelectedProducts([]);
  };

  const handleProductSearch = async (keyword) => {
    setProductSearchTerm(keyword);
    if (!keyword || keyword.trim().length < 2) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    try {
      const res = await searchProducts({ keyword, page: 1, limit: 5 });
      const products = res?.data?.data?.products || [];
      setProductResults(products);
    } catch (_) {
      setProductResults([]);
    } finally {
      setSearchingProducts(false);
    }
  };

  const toggleProductSelection = (product) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev.productIds) ? prev.productIds : [];
      const isSelected = existing.includes(product._id);
      const next = isSelected
        ? existing.filter((id) => id !== product._id)
        : [...existing, product._id];
      return { ...prev, productIds: next };
    });
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      return exists
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, { _id: product._id, name: product.name }];
    });
  };

  const removeSelectedProduct = (id) => {
    setFormData((prev) => ({
      ...prev,
      productIds: (prev.productIds || []).filter((pid) => pid !== id),
    }));
    setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      {/* Coupon basics */}
      <CouponBasicsFields
        formData={formData}
        setFormData={setFormData}
        basicsOpen={basicsOpen}
        setBasicsOpen={setBasicsOpen}
        handleDiscountTypeChange={handleDiscountTypeChange}
        handleDiscountAmountChange={handleDiscountAmountChange}
      />

      {/* Applicability & Validity */}
      <CouponApplicabilityValidity
        validityOpen={validityOpen}
        setValidityOpen={setValidityOpen}
        formData={formData}
        setFormData={setFormData}
        minDate={minDate}
        handleApplyToChange={handleApplyToChange}
        productSearchTerm={productSearchTerm}
        handleProductSearch={handleProductSearch}
        selectedProducts={selectedProducts}
        removeSelectedProduct={removeSelectedProduct}
        searchingProducts={searchingProducts}
        productResults={productResults}
        toggleProductSelection={toggleProductSelection}
        categories={categories}
        subcategories={subcategories}
      />
    </form>
  );
};

export default CouponForm;
