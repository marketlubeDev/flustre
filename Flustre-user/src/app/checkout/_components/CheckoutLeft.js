"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
import { Modal } from "antd";
import { toast } from "sonner";
// import axiosInstance from "@/lib/axios/axiosInstance"; // Removed API integration
// import {
//   placeOrder,
//   getServerCart,
//   addItemToServerCart,
// } from "@/lib/services/orderService"; // Removed API integration

export default function CheckoutLeft({
  cartItems,
  quantities,
  updateQuantity,
  removeItem,
  subtotal,
  total,
  discount,
  couponDiscount,
  paymentMethod,
}) {
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
  const router = useRouter();

  const handleProceedToPay = async () => {
    try {
      const addressId =
        typeof window !== "undefined"
          ? window.localStorage.getItem("currentAddressId")
          : null;

      if (paymentMethod === "online") {
        Modal.info({
          title: "Online payment",
          content:
            "Online payment flow is not configured yet. Please choose Cash on Delivery.",
        });
        return;
      }

      // Static cart functionality - no API integration
      const ensureServerCart = async () => {
        console.log('Cart sync (static mode)');
        return;
      };

      await ensureServerCart();

      // Static order placement - save to localStorage
      const orderData = {
        _id: `ORD${Date.now()}`,
        products: cartItems.map(item => ({
          productId: {
            name: item.name,
            image: item.image
          },
          quantity: quantities[item.id] || 1,
          price: item.price * (quantities[item.id] || 1)
        })),
        totalAmount: total - couponDiscount,
        status: "pending",
        createdAt: new Date().toISOString(),
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online",
        subtotal: subtotal,
        discount: discount,
        couponDiscount: couponDiscount
      };

      // Save order to localStorage
      try {
        if (typeof window !== "undefined") {
          const existingOrders = JSON.parse(window.localStorage.getItem("userOrders") || "[]");
          existingOrders.unshift(orderData); // Add new order at the beginning
          window.localStorage.setItem("userOrders", JSON.stringify(existingOrders));
        }
      } catch (error) {
        console.error("Failed to save order:", error);
      }

      toast.success("Order placed successfully");

      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("cartItems");
          window.localStorage.removeItem("cartCoupon");
          // Notify listeners (Nav, CartSidebar, etc.)
          window.dispatchEvent(new Event("coupon-updated"));
          window.dispatchEvent(new Event("cart-updated"));
          window.dispatchEvent(new Event("orders-updated")); // Notify orders updated
        }
      } catch {}

      // redirect to My Orders
      router.push("/my-account?tab=my-orders");
    } catch (error) {
      Modal.error({
        title: "Failed to place order",
        content:
          error?.response?.data?.message || "Please try again in a moment.",
      });
    }
  };

  return (
    <div className="space-y-6 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Items Section */}
      <div className="rounded-lg">
        <div className="flex justify-between items-center p-4 sm:p-5 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Items
          </h3>
          <span className="text-sm text-gray-600">
            {cartItems.length} products
          </span>
        </div>

        <div className="divide-y divide-dashed divide-gray-200">
          {cartItems.map((item, idx) => (
            <div key={item.id} className="relative flex p-4 sm:p-5 md:p-6">
              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Product Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mr-4 sm:mr-5 md:mr-6 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/96x96?text=Product";
                  }}
                  unoptimized={item.image?.includes("amazonaws.com")}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1">
                  {item.name}
                </h4>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="mr-4">
                    Type:{" "}
                    <span className="text-gray-800 font-medium">
                      {item.color}
                    </span>
                  </span>
                  <span>
                    Size:{" "}
                    <span className="text-gray-800 font-medium">
                      {item.plug}
                    </span>
                  </span>
                </div>

                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">
                      Qty :
                    </span>
                    <div className="flex items-center border border-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, quantities[item.id] - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-semibold text-[var(--color-primary)] min-w-[20px] text-center">
                        {String(quantities[item.id]).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, quantities[item.id] + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-semibold text-[var(--color-primary)]">
                      ₹ {item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹ {item.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg">
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Order Summary
          </h3>
          <button
            onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          >
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                orderSummaryOpen ? "rotate-0" : "-rotate-90"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {orderSummaryOpen && (
          <div className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-4">
            <div className="flex justify-between">
              <span className="text-base font-medium text-gray-800">
                Subtotal
              </span>
              <span className="text-lg font-bold text-gray-800">
                ₹ {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-base text-gray-600">
                  Total
                </span>
                <span className="text-base font-medium text-gray-800">
                  ₹ {total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">
                  Discount
                </span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  -₹ {discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">
                  Delivery
                </span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  Free Shipping
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">
                  Coupon Discount
                </span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  -₹ {couponDiscount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proceed to Pay Button Section */}
      <div className="rounded-lg flex justify-center">
        <Button
          variant="primary"
          size="large"
          className="w-[80%] text-white py-3 px-4 rounded font-medium transition-colors cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)" }}
          onClick={handleProceedToPay}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-primary)")}
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--color-primary)")
          }
        >
          {paymentMethod === "cod"
            ? "Place Order"
            : "Proceed to Pay"}
        </Button>
      </div>
    </div>
  );
}
