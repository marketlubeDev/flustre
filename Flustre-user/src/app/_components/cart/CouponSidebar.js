"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import Button from "@/app/_components/common/Button";
import { useCoupons, useApplyCoupon } from "@/lib/hooks/useCoupons";

export default function CouponSidebar({ isOpen, onClose }) {
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(couponCode.trim()), 300);
    return () => clearTimeout(id);
  }, [couponCode]);

  // Fetch coupons from API
  const { data: allCoupons = [], isLoading, error: queryError } = useCoupons(debouncedTerm || null);
  const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon();

  // Get cart items and calculate subtotal
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? window.localStorage.getItem("cartItems")
            : null;
        setCartItems(raw ? JSON.parse(raw) : []);
      } catch {
        setCartItems([]);
      }
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    if (typeof window !== "undefined") {
      window.addEventListener("cart-updated", handleCartUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart-updated", handleCartUpdate);
      }
    };
  }, [isOpen]);

  const subtotal = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
      0
    );
  }, [cartItems]);

  // Filter eligible coupons based on cart items
  const eligibleCoupons = useMemo(() => {
    if (!Array.isArray(allCoupons) || allCoupons.length === 0) {
      return [];
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return [];
    }

    return allCoupons.filter((coupon) => {
      if (!coupon || !coupon.isActive) return false;

      // Check expiry date
      const expiryDate = new Date(coupon.expiryDate);
      if (expiryDate.getTime() <= Date.now()) return false;

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;

      // Filter based on applyTo type
      switch (coupon.applyTo) {
        case "product":
          // Check if any cart item's productId is in the coupon's productIds array
          if (Array.isArray(coupon.productIds) && coupon.productIds.length > 0) {
            return cartItems.some((item) =>
              coupon.productIds.some(
                (pid) => String(pid) === String(item.productId || item.id)
              )
            );
          }
          return false;

        case "category":
          // Check if any cart item's category matches coupon's categoryId
          if (coupon.categoryId) {
            return cartItems.some((item) => {
              const itemCategoryId = item.categoryId ||
                (typeof item.category === 'object' ? item.category?._id || item.category?.id : null);
              return itemCategoryId && String(coupon.categoryId) === String(itemCategoryId);
            });
          }
          return false;

        case "subcategory":
          // Check if any cart item's subcategory matches coupon's categoryId
          // Note: For subcategory type, coupon uses categoryId field
          if (coupon.categoryId) {
            return cartItems.some((item) => {
              const itemSubcategoryId = item.subcategoryId ||
                (typeof item.subcategory === 'object' ? item.subcategory?._id || item.subcategory?.id : null);
              return itemSubcategoryId && String(coupon.categoryId) === String(itemSubcategoryId);
            });
          }
          return false;

        case "above price":
          // Check if subtotal is above minPurchase
          if (coupon.minPurchase !== undefined && coupon.minPurchase !== null) {
            return subtotal >= coupon.minPurchase;
          }
          return false;

        default:
          return false;
      }
    });
  }, [allCoupons, cartItems, subtotal]);

  // Filter displayed coupons based on search term
  const displayedCoupons = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return eligibleCoupons;
    return eligibleCoupons.filter(
      (c) =>
        String(c.code || "").toLowerCase().includes(term) ||
        String(c.description || "").toLowerCase().includes(term)
    );
  }, [eligibleCoupons, debouncedTerm]);

  useEffect(() => {
    if (!selectedCouponId && displayedCoupons?.length) {
      setSelectedCouponId(String(displayedCoupons[0]._id));
    }
  }, [displayedCoupons, selectedCouponId]);

  const selectedCoupon = displayedCoupons.find(
    (c) => String(c._id) === String(selectedCouponId)
  );
  const estimatedDiscount = useMemo(() => {
    if (!selectedCoupon) return 0;
    const type = selectedCoupon.discountType;
    const amount = Number(selectedCoupon.discountAmount) || 0;
    if (type === "percentage") {
      const max = selectedCoupon.maxDiscount
        ? Number(selectedCoupon.maxDiscount)
        : Infinity;
      return (
        Math.min(
          Math.floor((subtotal * amount) / 100),
          isFinite(max) ? max : Infinity
        ) || 0
      );
    }
    // Handle "fixed" or "flat" discount types
    return Math.min(amount, subtotal);
  }, [selectedCoupon, subtotal]);

  // Apply selected coupon
  const applySelectedCoupon = async () => {
    if (!selectedCoupon) return;
    setError("");

    // Don't show error for "Cart not found" if we have cart items locally
    // The hook will handle fallback to local calculation
    applyCoupon(
      {
        couponId: selectedCoupon._id,
        cartItems: cartItems
      },
      {
        onSuccess: () => {
          // Clear any previous errors
          setError("");
          onClose?.();
        },
        onError: (err) => {
          // Only show error if it's not a "Cart not found" error when we have local cart items
          const errorMessage = err?.response?.data?.message || err?.message || "";
          const isCartNotFoundError =
            errorMessage.includes("Cart not found") ||
            errorMessage.includes("Cart is empty");

          // If we have cart items locally and it's a cart not found error,
          // the hook should have handled it locally, so don't show error
          if (isCartNotFoundError && cartItems && cartItems.length > 0) {
            // The hook should have applied it locally, so don't show error
            setError("");
            onClose?.();
            return;
          }

          // Show other errors
          setError(
            errorMessage ||
            "Failed to apply coupon. Please try again."
          );
        },
      }
    );
  };

  return (
    <Drawer
      title={null}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={550}
      className="coupon-drawer-custom"
      styles={{
        body: {
          padding: 0,
          backgroundColor: "#F5F5F5",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        },
        header: {
          display: "none",
        },
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
        wrapper: {
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        },
        content: {
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        },
      }}
      closeIcon={null}
    >
      {/* Header - Fixed height */}
      <div
        className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white flex-shrink-0"
        style={{
          backgroundColor: "white",
          height: "80px",
          minHeight: "80px",
          maxHeight: "80px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            style={{ cursor: "pointer" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2
            className="text-[18px] font-[600] sm:text-sm md:text-lg lg:text-xl"
            style={{
              color: "#333333",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              letterSpacing: "-0.44px",
            }}
          >
            Apply Coupon & Offers
          </h2>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{ maxHeight: "100vh" }}
      >
        {/* Content Section - Flexible height to fit 100vh */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            height: "calc(100vh - 80px - 60px)", // Header (80px) + Bottom (60px on mobile, 80px on desktop)
            maxHeight: "calc(100vh - 80px - 60px)",
            overflow: "hidden",
          }}
        >
          {/* Main Content Wrapper */}
          <div className="bg-white">
            {/* Coupon Code Input */}
            <div className="mb-4 sm:mb-6 px-3 sm:px-4">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
              {error || queryError ? (
                <div className="mt-2 text-xs text-red-600">{error}</div>
              ) : null}
            </div>

            {/* Available Offers */}
            {isLoading ? (
              <div className="px-3 sm:px-4 py-8 text-center text-gray-500">
                Loading coupons...
              </div>
            ) : displayedCoupons.length === 0 ? (
              <div className="px-3 sm:px-4 py-8 text-center text-gray-500">
                {cartItems.length === 0
                  ? "Add items to your cart to see eligible coupons"
                  : debouncedTerm
                  ? "No coupons found matching your search"
                  : "No eligible coupons available for your cart"}
              </div>
            ) : (
              <div>
                {displayedCoupons.map((coupon, idx) => (
                <div
                  key={coupon._id}
                  className="py-3 sm:py-4 px-3 sm:px-4"
                  style={{
                    backgroundColor:
                      String(selectedCouponId) === String(coupon._id)
                        ? "#F4F8FB"
                        : "transparent",
                    borderBottom:
                      idx !== displayedCoupons.length - 1
                        ? "1px dashed rgba(229, 231, 235, 1)"
                        : "none",
                  }}
                >
                  <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="coupon"
                      value={coupon._id}
                      checked={String(selectedCouponId) === String(coupon._id)}
                      onChange={(e) => setSelectedCouponId(e.target.value)}
                      className="mt-1 w-4 h-4 border-transparent focus:outline-none"
                      style={{
                        accentColor: "var(--color-primary)",
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 text-xs sm:text-xs md:text-sm lg:text-base">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-xs sm:text-xs md:text-sm text-gray-600">
                        {coupon.description}
                      </p>
                    </div>
                  </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar - Fixed height */}
        <div
          className="border-t border-gray-200 bg-white p-4 sm:p-3 md:p-4 flex-shrink-0 h-[60px] min-h-[60px] max-h-[60px] sm:h-[70px] sm:min-h-[70px] sm:max-h-[70px] md:h-[80px] md:min-h-[80px] md:max-h-[80px]"
          style={{
            width: "100%",
            backgroundColor: "white",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-sm md:text-base lg:text-lg font-semibold" style={{ color: "#2B73B8" }}>
                  ₹ <span style={{ color: "#000000" }}>{subtotal.toLocaleString()}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs sm:text-xs md:text-sm"
                  style={{ color: "#2B73B8" }}
                >
                  - ₹ <span style={{ color: "#000000" }}>{Number(estimatedDiscount || 0).toLocaleString()}</span>
                </span>
              </div>
            </div>
            <div className="ml-2 sm:ml-3 md:ml-4">
              <Button
                variant="primary"
                size="small"
                onClick={applySelectedCoupon}
                className="whitespace-nowrap text-sm sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 h-7 sm:h-9 md:h-11 min-w-[60px] sm:min-w-[80px] md:min-w-[100px]"
                style={{ borderRadius: "4px" }}
                disabled={isLoading || isApplying || !selectedCoupon}
              >
                {isLoading || isApplying ? "Loading" : "Apply"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
