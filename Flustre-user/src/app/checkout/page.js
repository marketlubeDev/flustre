"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import CheckoutLeft from "./_components/CheckoutLeft";
import CheckoutRight from "./_components/CheckoutRight";

export default function CheckoutPage() {
  const router = useRouter();
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Check authentication on page load
  useEffect(() => {
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
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const rawCart = localStorage.getItem("cartItems");
        const rawCheckout = localStorage.getItem("checkout_items");

        console.log("Checkout page - Raw cart:", rawCart);
        console.log("Checkout page - Raw checkout:", rawCheckout);

        let cart = [];
        let checkout = [];

        // Parse cart items
        if (rawCart) {
          try {
            cart = JSON.parse(rawCart);
            if (!Array.isArray(cart)) cart = [];
          } catch (e) {
            console.error("Failed to parse cartItems:", e);
            cart = [];
          }
        }

        // Parse checkout items
        if (rawCheckout) {
          try {
            checkout = JSON.parse(rawCheckout);
            if (!Array.isArray(checkout)) checkout = [];
            console.log("Checkout page - Parsed checkout items:", checkout);
          } catch (e) {
            console.error("Failed to parse checkout_items:", e);
            checkout = [];
          }
        }

        // Merge by id, sum quantities
        const byId = new Map();
        const pushItem = (it) => {
          if (!it) return;

          // Ensure we have required fields
          if (!it.id && !it.productId) {
            console.warn("Item missing id and productId:", it);
            return;
          }

          const id = it.id || it.productId;
          const existing = byId.get(id);
          const qty = Number(it.quantity) > 0 ? Number(it.quantity) : 1;

          if (existing) {
            byId.set(id, {
              ...existing,
              quantity: (existing.quantity || 1) + qty,
            });
          } else {
            // Extract productId and variantId from id if not explicitly provided
            let productId = it.productId;
            let variantId = it.variantId;

            if (!productId && id) {
              const idParts = id.toString().split('_');
              productId = idParts[0];
              if (idParts.length > 1) {
                variantId = idParts[1];
              }
            }

            byId.set(id, {
              id: id,
              productId: productId,
              variantId: variantId || null,
              name: it.name || "Product",
              variantOptions:
                it.variantOptions ||
                it.variant?.options ||
                it.variant?.attributes ||
                {},
              price: Number(it.price) || 0,
              originalPrice: Number(it.originalPrice) || Number(it.price) || 0,
              image: it.image || "/banner1.png",
              quantity: qty,
            });
          }
        };

        // Process cart items
        (Array.isArray(cart) ? cart : []).forEach(pushItem);

        // Process checkout items (these take priority)
        (Array.isArray(checkout) ? checkout : []).forEach(pushItem);

        const merged = Array.from(byId.values());

        // Debug log
        console.log("Checkout page - Merged items:", merged);

        setCartItems(merged);

        const initialQty = {};
        merged.forEach((it) => {
          initialQty[it.id] = it.quantity || 1;
        });
        setQuantities(initialQty);

        // Clear the one-time buy-now payload after processing
        // This prevents duplicate items on refresh
        // Use setTimeout to ensure state is set before clearing
        if (checkout.length > 0) {
          setTimeout(() => {
            localStorage.removeItem("checkout_items");
          }, 500);
        }
      } catch (error) {
        console.error("Error loading checkout items:", error);
        setCartItems([]);
        setQuantities({});
      }
    };

    // Load data immediately
    loadCheckoutData();

    // Also listen for storage events in case data is added after page load
    const handleStorageChange = (e) => {
      if (e.key === "checkout_items") {
        console.log("Storage change detected for checkout_items");
        loadCheckoutData();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      // Also check again after a short delay in case of race conditions
      const timeout = setTimeout(() => {
        loadCheckoutData();
      }, 200);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearTimeout(timeout);
      };
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
    }
  };

  const removeItem = (itemId) => {
    setCartItems((prev) =>
      prev.filter((it) => String(it.id) !== String(itemId))
    );
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    try {
      const raw = localStorage.getItem("cartItems");
      const arr = raw ? JSON.parse(raw) : [];
      const next = (Array.isArray(arr) ? arr : []).filter(
        (it) => String(it.id) !== String(itemId)
      );
      localStorage.setItem("cartItems", JSON.stringify(next));
    } catch {}
  };

  // Load coupon details from localStorage
  const [couponDetails, setCouponDetails] = useState(null);

  useEffect(() => {
    const loadCoupon = () => {
      try {
        const raw = localStorage.getItem("cartCoupon");
        if (raw) {
          const coupon = JSON.parse(raw);
          setCouponDetails(coupon);
        } else {
          setCouponDetails(null);
        }
      } catch (error) {
        console.error("Failed to load coupon:", error);
        setCouponDetails(null);
      }
    };

    loadCoupon();

    // Listen for coupon updates
    const handleCouponUpdate = () => loadCoupon();
    if (typeof window !== "undefined") {
      window.addEventListener("coupon-updated", handleCouponUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("coupon-updated", handleCouponUpdate);
      }
    };
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (quantities[item.id] || 1),
    0
  );
  const discount = 0;
  const couponDiscount = couponDetails?.discountAmount || 0;
  const total = subtotal - discount - couponDiscount; // Delivery Free

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Gray Background */}
        <div className="w-full lg:w-1/2 bg-[#F5F5F5] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
          <CheckoutLeft
            cartItems={cartItems}
            quantities={quantities}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            subtotal={subtotal}
            total={total}
            discount={discount}
            couponDiscount={couponDiscount}
            paymentMethod={paymentMethod}
          />
        </div>

        {/* Right Column - White Background */}
        <div className="w-full lg:w-1/2 bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
          <Suspense
            fallback={
              <div className="animate-pulse">Loading checkout form...</div>
            }
          >
            <CheckoutRight
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
