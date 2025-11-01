"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/app/_components/common/Button";
import { Modal } from "antd";
import { toast } from "sonner";
import { addItemToServerCart, getServerCart } from "@/lib/services/orderService";
import { placeOrder } from "@/lib/services/orderService";
import { applyCouponById } from "@/lib/services/couponService";

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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  const handleProceedToPay = async () => {
    if (isPlacingOrder) return; // Prevent multiple submissions

    try {
      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        toast.error("Your cart is empty. Please add items to cart.");
        return;
      }

      // Get address ID or address object from localStorage
      let address = null;
      if (typeof window !== "undefined") {
        const addressId = window.localStorage.getItem("currentAddressId");
        const currentAddress = window.localStorage.getItem("currentAddress");
        const checkoutAddressOverride = window.localStorage.getItem(
          "checkoutAddressOverride"
        );

        // Prefer address ID if available (MongoDB ObjectId)
        if (addressId) {
          address = addressId;
        } else if (checkoutAddressOverride) {
          // If checkout override exists, use it
          try {
            const overrideData = JSON.parse(checkoutAddressOverride);
            // Convert to backend expected format
            address = {
              fullName:
                overrideData.fullName ||
                `${overrideData.firstName || ""} ${overrideData.lastName || ""}`.trim(),
              phoneNumber: overrideData.phone || "",
              houseApartmentName: overrideData.houseApartment || "",
              street: overrideData.street || "",
              landmark: overrideData.landmark || "",
              city: overrideData.city || "",
              state: overrideData.state || "",
              pincode: overrideData.pincode || "",
              saveAddress: true, // Optionally save this address
            };
          } catch (e) {
            console.error("Failed to parse checkout address override:", e);
          }
        } else if (currentAddress) {
          // Try to parse the current address
          try {
            const addrData = JSON.parse(currentAddress);
            // If it has _id, use it as address ID
            if (addrData._id) {
              address = addrData._id;
            } else {
              // Otherwise use the address object
              address = {
                fullName: addrData.fullName || "",
                phoneNumber: addrData.phoneNumber || "",
                houseApartmentName: addrData.houseApartmentName || "",
                street: addrData.street || "",
                landmark: addrData.landmark || "",
                city: addrData.city || "",
                state: addrData.state || "",
                pincode: addrData.pincode || "",
                saveAddress: false,
              };
            }
          } catch (e) {
            console.error("Failed to parse current address:", e);
          }
        }
      }

      if (!address) {
        toast.error("Please select a delivery address.");
        Modal.info({
          title: "Address Required",
          content: "Please add or select a delivery address to continue.",
        });
        return;
      }

      // Handle online payment (not fully implemented yet)
      if (paymentMethod === "online") {
        Modal.info({
          title: "Online payment",
          content:
            "Online payment flow is not configured yet. Please choose Cash on Delivery.",
        });
        return;
      }

      setIsPlacingOrder(true);

      // Sync localStorage cart to server before placing order
      // This ensures the server has the cart items
      try {
        const isLoggedIn = typeof window !== "undefined" && (
          !!window.localStorage?.getItem("token") ||
          !!window.localStorage?.getItem("userToken")
        );

        if (isLoggedIn) {
          // Get cart items from localStorage (use current quantities from state)
          const localCartItems = typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("cartItems") || "[]")
            : [];

          // Check if server cart exists and has items
          let serverCartHasItems = false;
          try {
            const serverCart = await getServerCart();
            const serverItems = serverCart?.formattedCart?.items || [];
            serverCartHasItems = Array.isArray(serverItems) && serverItems.length > 0;
          } catch (cartCheckError) {
            // Server cart doesn't exist or is empty - we need to sync
            serverCartHasItems = false;
          }

          // Only sync if server cart is empty
          if (!serverCartHasItems && localCartItems && localCartItems.length > 0) {
            // Sync each item to server cart with current quantities
            for (const item of localCartItems) {
              const productId = item.productId || (item.id?.split('_')[0]);
              const variantId = item.variantId || (item.id?.includes('_') ? item.id.split('_')[1] : null);
              // Use quantity from quantities state (current checkout quantities) or fallback to item.quantity
              const quantity = quantities[item.id] !== undefined ? quantities[item.id] : (item.quantity || 1);

              if (productId && quantity > 0) {
                try {
                  await addItemToServerCart({
                    productId,
                    variantId: variantId || undefined,
                    quantity,
                  });
                } catch (syncError) {
                  // If sync fails, log but continue
                  const errorMsg = syncError?.response?.data?.message || "";
                  console.warn("Error syncing item to cart:", errorMsg || "Unknown error");
                }
              }
            }
          }

          // Apply coupon to server cart if one is applied locally (only if cart was synced)
          if (!serverCartHasItems && localCartItems && localCartItems.length > 0) {
            try {
              const couponData = typeof window !== "undefined"
                ? localStorage.getItem("cartCoupon")
                : null;

              if (couponData) {
                const coupon = JSON.parse(couponData);
                if (coupon?.couponId) {
                  try {
                    // Small delay to ensure cart is created
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await applyCouponById(coupon.couponId);
                  } catch (couponError) {
                    // If coupon application fails, continue
                    // The coupon discount will be handled on the frontend
                    console.log("Apply coupon to server cart:", couponError?.response?.data?.message || "Coupon may already be applied");
                  }
                }
              }
            } catch (couponSyncError) {
              console.error("Error syncing coupon to server:", couponSyncError);
              // Continue anyway
            }
          }

          // Small delay to ensure server cart is fully synced before placing order
          if (!serverCartHasItems) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } catch (syncError) {
        console.error("Error syncing cart to server:", syncError);
        // Continue anyway - try to place order, it might still work
      }

      // Convert payment method to backend format (COD or ONLINE)
      const backendPaymentMethod =
        paymentMethod === "cod" ? "COD" : "ONLINE";

      // Prepare quantities array for the backend
      // Format: [{ productId, variantId (optional), quantity }]
      const quantitiesArray = cartItems.map((item) => {
        const quantity = quantities[item.id] || item.quantity || 1;

        // Extract productId and variantId from item
        // item.id might be in format: "productId" or "productId_variantId"
        let productId = item.productId;
        let variantId = item.variantId;

        // If productId is not directly available, try to extract from id
        if (!productId && item.id) {
          const idParts = item.id.toString().split('_');
          productId = idParts[0];
          if (idParts.length > 1) {
            variantId = idParts[1];
          }
        }

        // If still no productId, use item.id as fallback
        if (!productId) {
          productId = item.id;
        }

        const payload = {
          productId: productId,
          quantity: quantity,
        };

        // Add variantId if available
        if (variantId) {
          payload.variantId = variantId;
        }

        return payload;
      });

      // Call the placeOrder API
      const response = await placeOrder({
        address: address,
        paymentMethod: backendPaymentMethod,
        quantities: quantitiesArray,
      });

      if (response.success) {
        toast.success(response.message || "Order placed successfully");

        // Clear cart from localStorage after successful order
        try {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("cartItems");
            window.localStorage.removeItem("cartCoupon");
            // Notify listeners (Nav, CartSidebar, etc.)
            window.dispatchEvent(new Event("coupon-updated"));
            window.dispatchEvent(new Event("cart-updated"));
            window.dispatchEvent(new Event("orders-updated")); // Notify orders updated
          }
        } catch (error) {
          console.error("Error clearing cart:", error);
        }

        // Redirect to My Orders after a short delay
        setTimeout(() => {
          router.push("/my-account?tab=my-orders");
        }, 1000);
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order. Please try again.";
      toast.error(errorMessage);
      Modal.error({
        title: "Failed to place order",
        content: errorMessage,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Items Section */}
      <div className="rounded-lg">
        <div className="flex justify-between items-center p-4 sm:p-5 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800">Items</h3>
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
                {(item.variantOptions &&
                  Object.keys(item.variantOptions).length > 0) ||
                item.variant?.options ||
                item.variant?.attributes ? (
                  <div className="text-sm text-gray-600 mb-2">
                    {Object.entries(
                      item.variantOptions ||
                        item.variant?.options ||
                        item.variant?.attributes ||
                        {}
                    ).map(([key, value], idx) => {
                      const optionLabel =
                        key.charAt(0).toUpperCase() + key.slice(1);
                      return (
                        <span
                          key={`${key}-${idx}`}
                          className={idx > 0 ? "ml-4" : ""}
                        >
                          {optionLabel}:{" "}
                          <span className="text-gray-800 font-medium">
                            {value}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ) : null}

                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Qty :</span>
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
                      ₹ {(item.price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹ {(item.originalPrice || 0).toLocaleString()}
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
          <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
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
                ₹ {(subtotal || 0).toLocaleString()}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-base text-gray-600">Discount</span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  -₹ {(discount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">Coupon Discount</span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  -₹ {(couponDiscount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">Delivery</span>
                <span className="text-base font-medium text-[var(--color-primary)]">
                  Free Shipping
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                <span className="text-base font-semibold text-gray-800">Total Payable</span>
                <span className="text-base font-bold text-gray-800">
                  ₹ {(total || 0).toLocaleString()}
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
          className="w-[80%] text-white py-3 px-4 rounded font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary)" }}
          onClick={handleProceedToPay}
          disabled={isPlacingOrder}
          onMouseOver={(e) => {
            if (!isPlacingOrder) {
              e.currentTarget.style.background = "var(--color-primary)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "var(--color-primary)";
          }}
        >
          {isPlacingOrder
            ? "Placing Order..."
            : paymentMethod === "cod"
            ? "Place Order"
            : "Proceed to Pay"}
        </Button>
      </div>
    </div>
  );
}
