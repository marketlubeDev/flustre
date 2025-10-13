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
    try {
      const rawCart = localStorage.getItem("cartItems");
      const rawCheckout = localStorage.getItem("checkout_items");
      const cart = rawCart ? JSON.parse(rawCart) : [];
      const checkout = rawCheckout ? JSON.parse(rawCheckout) : [];

      // Merge by id, sum quantities
      const byId = new Map();
      const pushItem = (it) => {
        if (!it) return;
        const id = it.id;
        const existing = byId.get(id);
        const qty = Number(it.quantity) > 0 ? Number(it.quantity) : 1;
        if (existing) {
          byId.set(id, {
            ...existing,
            quantity: (existing.quantity || 1) + qty,
          });
        } else {
          byId.set(id, {
            id: it.id,
            name: it.name,
            color: it.color,
            plug: it.plug,
            price: it.price,
            originalPrice: it.originalPrice,
            image: it.image,
            quantity: qty,
          });
        }
      };
      (Array.isArray(cart) ? cart : []).forEach(pushItem);
      (Array.isArray(checkout) ? checkout : []).forEach(pushItem);

      const merged = Array.from(byId.values());
      setCartItems(merged);

      const initialQty = {};
      merged.forEach((it) => {
        initialQty[it.id] = it.quantity || 1;
      });
      setQuantities(initialQty);

      // Optional: clear the one-time buy-now payload so refresh doesn't duplicate
      localStorage.removeItem("checkout_items");
    } catch {}
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (quantities[item.id] || 1),
    0
  );
  const total = subtotal + 0; // Delivery Free
  const discount = 0;
  const couponDiscount = 0;

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
