"use client";

import React, { useState, useEffect } from "react";
import { getUserOrders } from "@/lib/services/orderService";
import { toast } from "sonner";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Check if user is authenticated
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token") ||
              window.localStorage.getItem("userToken")
            : null;

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await getUserOrders();

        if (response && response.orders) {
          // Format orders for display
          const formattedOrders = response.orders.map((order) => ({
            _id: order._id,
            totalAmount: order.totalAmount || 0,
            // Use order status, fallback to "pending" if not set
            status: order.status || "pending",
            paymentStatus: order.paymentStatus || "pending",
            createdAt: order.createdAt,
            products: (order.products || []).map((product) => ({
              productId: {
                name:
                  product.productId?.name ||
                  product.product?.name ||
                  "Product",
                image:
                  product.productId?.images?.[0] ||
                  product.product?.images?.[0] ||
                  product.variantId?.images?.[0] ||
                  "/placeholder.png",
              },
              quantity: product.quantity || 1,
              price: product.price || 0,
              variantId: product.variantId,
            })),
            deliveryAddress: order.deliveryAddress,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
          }));

          setOrders(formattedOrders);

          // Also update localStorage for fallback
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              "userOrders",
              JSON.stringify(formattedOrders)
            );
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setIsError(true);
        toast.error(
          error?.response?.data?.message ||
            "Failed to load orders. Please try again."
        );

        // Fallback to localStorage if API fails
        try {
          if (typeof window !== "undefined") {
            const storedOrders = window.localStorage.getItem("userOrders");
            if (storedOrders) {
              setOrders(JSON.parse(storedOrders));
            }
          }
        } catch (e) {
          console.error("Failed to load orders from localStorage:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Listen for order updates (when new order is placed)
    const handleOrdersUpdate = () => {
      fetchOrders();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("orders-updated", handleOrdersUpdate);
      return () => {
        window.removeEventListener("orders-updated", handleOrdersUpdate);
      };
    }
  }, []);

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processed":
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "In Transit";
      case "processed":
      case "processing":
      case "pending":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          My Orders
        </h2>
        <p className="text-sm text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          My Orders
        </h2>
        <p className="text-sm text-red-600">
          Failed to load orders.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-600">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Order #{order._id?.slice(-6)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    ₹{(order.totalAmount || 0).toLocaleString()}
                  </p>
                  <span
                    className={`px-2 py-1 text-[10px] sm:text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {(order.products || []).map((item, index) => {
                  // Calculate item total (price * quantity)
                  const itemTotal = (item.price || 0) * (item.quantity || 1);
                  return (
                    <div
                      key={index}
                      className="flex justify-between text-xs sm:text-sm"
                    >
                      <span className="text-gray-600">
                        {item?.productId?.name || "Product"} (Qty:{" "}
                        {item.quantity || 1})
                      </span>
                      <span className="text-gray-900">
                        ₹{itemTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <button className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-xs sm:text-sm cursor-pointer">
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
