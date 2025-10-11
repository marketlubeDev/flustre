"use client";

import { useState, useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { Drawer } from "antd";
import CouponSidebar from "./CouponSidebar";
import Button from "@/app/_components/common/Button";
import CartSidebarHeader from "./components/CartSidebarHeader";
import ItemsHeader from "./components/ItemsHeader";
import EmptyCartMessage from "./components/EmptyCartMessage";
import CartItemRow from "./components/CartItemRow";
import CouponSection from "./components/CouponSection";
import OrderSummary from "./components/OrderSummary";
import BottomActionBar from "./components/BottomActionBar";
// import useCart from "@/lib/hooks/useCart";
// import { useSelector } from "react-redux";

export default function CartSidebar({ isOpen, onClose }) {
  // Static data - no backend dependencies
  const isLoggedIn = false; // Static for demo
  const cartLoading = false; // Static for demo
  
  // Static remove from cart function
  const removeFromCart = async (itemId) => {
    try {
      const existingCart = typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem("cartItems") || "[]") 
        : [];
      
      const updatedCart = existingCart.filter(item => item.id !== itemId);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cart-updated"));
      }
      
      // Reload cart to update UI
      loadCart();
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };
  const [quantities, setQuantities] = useState({
    1: 1,
    2: 1,
  });
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
  const [showCouponSidebar, setShowCouponSidebar] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(550);
  const [cartItems, setCartItems] = useState([]);
  const [couponDetails, setCouponDetails] = useState(null);

  const loadCart = () => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("cartItems")
          : null;
      const parsed = raw ? JSON.parse(raw) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
      const initialQuantities = {};
      (Array.isArray(parsed) ? parsed : []).forEach((item) => {
        initialQuantities[item.id] =
          Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      });
      setQuantities((prev) => ({ ...prev, ...initialQuantities }));
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
      setCartItems([]);
    }
  };

  const persistCart = (items) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cartItems", JSON.stringify(items));
        // Notify listeners
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err) {
      console.error("Failed to persist cart to localStorage", err);
    }
  };

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // Add a small delay to prevent jarring transition
      const timer = setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 300); // Match the animation duration

      return () => clearTimeout(timer);
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Update drawer width responsively on client only
  useEffect(() => {
    const updateWidth = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      setDrawerWidth(isMobile ? "100%" : 550);
    };

    updateWidth();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWidth);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, []);

  // Load cart when opened and when external updates happen
  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  useEffect(() => {
    const onCartUpdated = () => loadCart();
    const onCouponUpdated = () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? window.localStorage.getItem("cartCoupon")
            : null;
        setCouponDetails(raw ? JSON.parse(raw) : null);
      } catch {
        setCouponDetails(null);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("cart-updated", onCartUpdated);
      window.addEventListener("coupon-updated", onCouponUpdated);
      // initial
      onCouponUpdated();
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart-updated", onCartUpdated);
        window.removeEventListener("coupon-updated", onCouponUpdated);
      }
    };
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
      // Also persist to localStorage
      setCartItems((prev) => {
        const next = prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        persistCart(next);
        return next;
      });
    }
  };

  const removeItem = async (itemId) => {
    if (isLoggedIn) {
      // Use the useCart hook for logged-in users to sync with server
      await removeFromCart(itemId);
    } else {
      // For non-logged-in users, just update localStorage
      const next = cartItems.filter((item) => item.id !== itemId);
      setCartItems(next);
      const { [itemId]: _, ...rest } = quantities;
      setQuantities(rest);
      persistCart(next);
    }
  };

  const handleProceedToCheckout = () => {
    // Check if user is authenticated
    const isAuthenticated = () => {
      if (typeof window === "undefined") return false;
      const token =
        window.localStorage?.getItem("token") ||
        window.localStorage?.getItem("userToken");
      return !!token;
    };

    if (!isAuthenticated()) {
      // Store the intended checkout URL for redirect after login
      if (typeof window !== "undefined") {
        window.localStorage.setItem("intendedCheckoutUrl", "/checkout");
      }
      onClose();
      window.location.href = "/login";
      return;
    }

    onClose();
    window.location.href = "/checkout";
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price || 0) * (quantities[item.id] || item.quantity || 1),
    0
  );
  const total = subtotal; // Free shipping: no delivery charge added
  const discount = 0; // Do not show phantom discount for free shipping
  const couponDiscount = Number(couponDetails?.discountAmount || 0);

  return (
    <>
      <Drawer
        title={null}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={drawerWidth}
        overflow="hidden"
        className="cart-drawer-custom"
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
        <CartSidebarHeader
          onClose={onClose}
          title={"Your Cart"}
        />

        {/* Cart Content */}
        <div
          className="flex flex-col h-screen overflow-hidden"
          style={{ maxHeight: "100vh" }}
        >
          {/* Items Section - Flexible height to fit 100vh */}
          <div
            className="flex-1 overflow-hidden py-2 sm:py-4"
            style={{
              height: "calc(100vh - 80px - 80px)", // Header (80px) + Bottom (80px on mobile, 100px on desktop) = 160px on mobile
              maxHeight: "calc(100vh - 80px - 80px)",
              overflow: "hidden",
              paddingBottom: "80px", // Add padding to prevent content from being hidden behind fixed bottom bar on mobile
            }}
          >
            {/* Items Header */}
            <ItemsHeader
              title={"Items"}
              count={`${cartItems.length} products`}
            />

            {/* Cart Items - Arranged in a single white card, separated by dotted borders, full width */}
            <div
              className="w-full bg-white"
              style={{
                borderRadius: "0px",
                boxShadow: "none",
                padding: 0,
                margin: 0,
                overflow: "hidden",
                minHeight:
                  cartItems.length === 0 ? "calc(100vh - 160px)" : "auto",
              }}
            >
              {cartItems.length === 0 ? (
                <EmptyCartMessage
                  title={"Your cart is empty"}
                  description={"Looks like you haven’t added anything yet."}
                  ctaText={"Shop Now"}
                  onClose={onClose}
                  onCta={() => (window.location.href = "/products")}
                />
              ) : (
                cartItems.map((item, idx) => (
                  <CartItemRow
                    key={idx}
                    item={item}
                    index={idx}
                    isLast={idx === cartItems.length - 1}
                    quantities={quantities}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    renderMeta={(it) => (
                      <div
                        className="mb-1 text-[12px] sm:text-[14px]"
                        style={{
                          display: "block",
                          overflow: "hidden",
                          color: "rgba(51, 51, 51, 0.70)",
                          fontWeight: 500,
                          lineHeight: "140%",
                          letterSpacing: "-0.28px",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ marginRight: "16px" }}>
                          {"Type"}:{" "}
                          <span style={{ color: "#222", fontWeight: 500 }}>
                            {it.color || "Standard"}
                          </span>
                        </span>
                        <span>
                          {"Size"}:{" "}
                          <span style={{ color: "#222", fontWeight: 500 }}>
                            {it.plug || "Default"}
                          </span>
                        </span>
                      </div>
                    )}
                    renderPrice={(it) => (
                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className="text-[14px] sm:text-[16px]"
                          style={{
                            overflow: "hidden",
                            color: "var(--color-primary)",
                            textOverflow: "ellipsis",
                            fontStyle: "normal",
                            fontWeight: 600,
                            lineHeight: "100%",
                            letterSpacing: "-0.32px",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            background: "white",
                            padding: "0 2px",
                          }}
                        >
                          <FaRupeeSign color="#2B73B8" style={{ display: "inline", marginRight: 4 }} />
                          {(it.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          <FaRupeeSign color="#2B73B8" style={{ display: "inline", marginRight: 4 }} />
                          {(it.originalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                  />
                ))
              )}
            </div>

            {/* Coupon Section - Only show when cart has items */}
            {cartItems.length > 0 && (
              <CouponSection
                title={"Coupons & Offers"}
                description={{
                  title: "Apply Coupons & Offers",
                  subtitle: "Use a coupon code or explore available offers.",
                }}
                onOpen={() => setShowCouponSidebar(true)}
              />
            )}

            {/* Order Summary - Only show when cart has items */}
            {cartItems.length > 0 && (
              <OrderSummary
                title={"Order Summary"}
                subtotal={subtotal}
                total={total}
                discount={discount}
                couponDiscount={couponDiscount}
                labels={{
                  subtotal: "Subtotal",
                  total: "Total",
                  discount: "Discount",
                  delivery: "Delivery",
                  freeShipping: "Free shipping",
                  couponDiscount: "Coupon Discount",
                  expand: "Show details",
                  collapse: "Hide details",
                }}
                open={orderSummaryOpen}
                onToggle={() => setOrderSummaryOpen((open) => !open)}
              />
            )}
          </div>

          {/* Bottom Action Bar - Fixed height */}
          <BottomActionBar
            hasItems={cartItems.length !== 0}
            totalPayable={total - discount - couponDiscount}
            viewLabel={"View"}
            detailsLabel={"Details"}
            onCheckout={handleProceedToCheckout}
          />
        </div>
      </Drawer>

      {/* Coupon Sidebar */}
      <CouponSidebar
        isOpen={showCouponSidebar}
        onClose={() => setShowCouponSidebar(false)}
      />
    </>
  );
}
