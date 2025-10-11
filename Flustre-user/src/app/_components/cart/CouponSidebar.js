"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import Button from "@/app/_components/common/Button";
// import { useCoupons, useApplyCoupon } from "@/lib/hooks/useCoupons"; // Removed API integration

export default function CouponSidebar({ isOpen, onClose }) {
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(couponCode.trim()), 300);
    return () => clearTimeout(id);
  }, [couponCode]);

  // Static data - no API integration
  const coupons = [];
  const isLoading = false;
  const queryError = null;

  const staticCoupons = useMemo(
    () => [
      {
        _id: "STATIC10",
        code: "SAVE10",
        description: "Get 10% off on your order (max ₹ 30)",
        discountType: "percentage",
        discountAmount: 10,
        maxDiscount: 30,
      },
      {
        _id: "STATIC25",
        code: "FLAT25",
        description: "Flat ₹ 25 off on orders above ₹ 150",
        discountType: "flat",
        discountAmount: 25,
      },
      {
        _id: "STATIC50",
        code: "WELCOME50",
        description: "50% off for new users (max ₹ 40)",
        discountType: "percentage",
        discountAmount: 50,
        maxDiscount: 40,
      },
      {
        _id: "STATIC15",
        code: "GROCER15",
        description: "15% off on groceries (max ₹ 25)",
        discountType: "percentage",
        discountAmount: 15,
        maxDiscount: 25,
      },
    ],
    []
  );

  const displayedCoupons = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    const source = Array.isArray(coupons) && coupons.length ? coupons : staticCoupons;
    if (!term) return source;
    return source.filter(
      (c) =>
        String(c.code || "").toLowerCase().includes(term) ||
        String(c.description || "").toLowerCase().includes(term)
    );
  }, [coupons, staticCoupons, debouncedTerm]);

  useEffect(() => {
    if (!selectedCouponId && displayedCoupons?.length) {
      setSelectedCouponId(String(displayedCoupons[0]._id));
    }
  }, [displayedCoupons, selectedCouponId]);

  const subtotal = useMemo(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("cartItems")
          : null;
      const items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items)) return 0;
      return items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
        0
      );
    } catch {
      return 0;
    }
  }, [isOpen]);

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
    return Math.min(amount, subtotal);
  }, [selectedCoupon, subtotal]);

  // Static apply coupon function - no API integration
  const applyCoupon = async (couponId) => {
    console.log('Apply coupon (static mode):', couponId);
    return Promise.resolve();
  };
  const isApplying = false;
  const applySelectedCoupon = async () => {
    if (!selectedCoupon) return;
    setError("");
    try {
      // If we're using static coupons (no API coupons), just close the drawer
      if (!coupons || coupons.length === 0) {
        onClose?.();
        return;
      }
      await applyCoupon(selectedCoupon._id);
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || "Something went wrong");
    }
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

            {/* Available Offers */
            }
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
          </div>
        </div>

        {/* Bottom Action Bar - Fixed height */}
        <div
          className="border-t border-gray-200 bg-white p-4 sm:p-3 md:p-4 flex-shrink-0"
          style={{
            width: "100%",
            backgroundColor: "white",
            height: "60px",
            minHeight: "60px",
            maxHeight: "60px",
            flexShrink: 0,
            "@media (min-width: 640px)": {
              height: "70px",
              minHeight: "70px",
              maxHeight: "70px",
            },
            "@media (min-width: 768px)": {
              height: "80px",
              minHeight: "80px",
              maxHeight: "80px",
            },
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
