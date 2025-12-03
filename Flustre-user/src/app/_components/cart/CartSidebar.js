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
import useCart from "@/lib/hooks/useCart";
import { useSelector } from "react-redux";
import { updateCartItemQuantityApi } from "@/lib/services/cartService";

export default function CartSidebar({ isOpen, onClose }) {
  const { isLoggedIn } = useSelector((state) => state.user);
  const {
    removeFromCart: removeFromCartHook,
    syncCartFromServer,
    isLoading: cartLoading,
  } = useCart();
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
        // Notify listeners in a separate task to avoid React warning
        // "Cannot update a component while rendering a different component"
        setTimeout(() => {
          window.dispatchEvent(new Event("cart-updated"));
        }, 0);
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
    if (isOpen) {
      // For logged-in users, first sync from server so modal reflects DB state,
      // then load from localStorage (which syncCartFromServer updates).
      if (isLoggedIn) {
        syncCartFromServer?.();
      }
      loadCart();
    }
  }, [isOpen, isLoggedIn]);

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

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    if (isLoggedIn) {
      // Logged-in: update quantity on server via API
      const currentItem = cartItems.find(
        (item) => String(item.id) === String(itemId)
      );
      if (!currentItem) return;

      const currentQty =
        quantities[itemId] || currentItem.quantity || Number(1);
      const action = newQuantity > currentQty ? "increment" : "decrement";

      try {
        const response = await updateCartItemQuantityApi({
          productId: currentItem.productId,
          variantId: currentItem.variantId,
          action,
        });
        const formattedCart = response?.data;

        if (formattedCart && Array.isArray(formattedCart.items)) {
          const itemsForUi = formattedCart.items.map((it) => {
            const productId = it?.product?._id || it?.product;
            const variantId = it?.variant?._id || it?.variant;
            const id = variantId ? `${productId}_${variantId}` : productId;
            const name = it?.product?.name;
            const image =
              it?.mainImage || it?.images?.[0] || it?.product?.mainImage;
            const price =
              it?.offerPrice ||
              it?.price ||
              it?.variant?.offerPrice ||
              it?.variant?.price;
            const originalPrice = it?.price || it?.variant?.price || price;
            const qty = Number(it?.quantity) > 0 ? Number(it.quantity) : 1;
            const variantOptions =
              it?.variant?.options || it?.variant?.attributes || {};
            return {
              id: String(id),
              productId,
              variantId,
              name,
              image,
              price,
              originalPrice,
              quantity: qty,
              variantOptions,
            };
          });

          // Persist and sync UI
          persistCart(itemsForUi);
          setCartItems(itemsForUi);
          setQuantities((prev) => {
            const next = { ...prev };
            itemsForUi.forEach((it) => {
              next[it.id] = it.quantity || 1;
            });
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to update cart quantity:", err);
      }
    } else {
      // Guest: update only localStorage
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
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
      await removeFromCartHook(itemId);
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
  const discount = 0; // Do not show phantom discount for free shipping
  const couponDiscount = Number(couponDetails?.discountAmount || 0);
  const total = subtotal - discount - couponDiscount; // Free shipping: no delivery charge added

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
        <CartSidebarHeader onClose={onClose} title={"Your Cart"} />

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
                    renderMeta={(it) => {
                      // Get variant options from the cart item
                      const variantOptions =
                        it.variantOptions ||
                        it.variant?.options ||
                        it.variant?.attributes ||
                        {};
                      const optionEntries = Object.entries(variantOptions);

                      // If no variant options, don't show anything (or show a default message)
                      if (optionEntries.length === 0) {
                        return null;
                      }

                      return (
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
                          {optionEntries.map(([key, value], idx) => {
                            // Capitalize first letter of option name
                            const optionLabel =
                              key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                              <span
                                key={`${key}-${idx}`}
                                style={{ marginRight: "16px" }}
                              >
                                {optionLabel}:{" "}
                                <span
                                  style={{ color: "#222", fontWeight: 500 }}
                                >
                                  {value}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      );
                    }}
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
                          <FaRupeeSign
                            color="#2B73B8"
                            style={{ display: "inline", marginRight: 4 }}
                          />
                          {(it.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          <FaRupeeSign
                            color="#2B73B8"
                            style={{ display: "inline", marginRight: 4 }}
                          />
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
            totalPayable={total}
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
