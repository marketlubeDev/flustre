"use client";

import React from "react";
// import { useQuery } from "@tanstack/react-query"; // Removed API integration
// import { getUserOrders } from "@/lib/services/orderService"; // Removed API integration

export default function MyOrders() {

  // Static data - no API integration
  const data = [];
  const isLoading = false;
  const isError = false;
  const orders = [];

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
                    AED {order.totalAmount}
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
                {(order.products || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-xs sm:text-sm"
                  >
                    <span className="text-gray-600">
                      {item?.productId?.name || "Product"} (Qty: {item.quantity}
                      )
                    </span>
                    <span className="text-gray-900">AED {item.price}</span>
                  </div>
                ))}
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
