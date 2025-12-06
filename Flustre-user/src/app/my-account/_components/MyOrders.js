"use client";

import React, { useState, useEffect } from "react";
import { getUserOrders, cancelOrder as cancelOrderApi } from "@/lib/services/orderService";
import { toast } from "sonner";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Helper function to format orders
  const formatOrders = (ordersArray) => {
    if (!ordersArray || ordersArray.length === 0) return [];
    
    return ordersArray.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount || 0,
      subTotal: order.subTotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      tax: order.tax,
      status: typeof order.status === "string" ? order.status.toLowerCase().trim() : "pending",
      paymentStatus: order.paymentStatus || "pending",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      estimatedDelivery: order.expectedDelivery || order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      carrier: order.carrier,
      orderType: order.orderType,
      phone: order.phone || order.deliveryAddress?.phoneNumber,
      products: (order.products || order.items || []).map((product) => {
        const productData = product.productId || product.product || {};
        const variantData = product.variantId || product.variant || {};
        
        return {
          productId: {
            name:
              productData?.name ||
              product.name ||
              "Product",
            image:
              productData?.images?.[0] ||
              productData?.image ||
              product?.image ||
              variantData?.images?.[0] ||
              variantData?.image ||
              "/placeholder.png",
            brand: productData?.brand || product.brand,
            category: productData?.category || product.category,
          },
          quantity: product.quantity || 1,
          price: product.price || product.unitPrice || 0,
          originalPrice: product.originalPrice || product.originalUnitPrice,
          variantId: variantData || product.variantId,
        };
      }),
      deliveryAddress: order.deliveryAddress ? {
        name: order.deliveryAddress.fullName || order.deliveryAddress.name,
        phone: order.deliveryAddress.phoneNumber || order.deliveryAddress.phone,
        addressLine1: order.deliveryAddress.street || order.deliveryAddress.addressLine1 || order.deliveryAddress.address,
        addressLine2: order.deliveryAddress.houseApartmentName || order.deliveryAddress.addressLine2,
        city: order.deliveryAddress.city,
        state: order.deliveryAddress.state,
        zip: order.deliveryAddress.pincode || order.deliveryAddress.zip,
        country: order.deliveryAddress.country,
        landmark: order.deliveryAddress.landmark,
        ...order.deliveryAddress,
      } : null,
      shippingAddress: order.shippingAddress || order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    }));
  };

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


        // Handle different response structures
        const ordersArray = response?.orders || response?.data?.orders || (Array.isArray(response) ? response : []);

        if (ordersArray && ordersArray.length > 0) {
          // Format orders for display
          const formattedOrders = formatOrders(ordersArray);

    
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
      case "pending":
        return "Pending";
      case "processed":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
        case "cancelled": 
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const handleCancelOrder = async (order) => {
    if (!order?._id) return;
    
    const confirmText = "Are you sure you want to cancel this order?";
    if (typeof window !== "undefined" && !window.confirm(confirmText)) return;
    
    setProcessingId(order._id);
    try {
      await cancelOrderApi(order._id);
      toast.success("Order cancelled successfully");
      
      // Refresh orders after cancellation
      const response = await getUserOrders();
      const ordersArray = response?.orders || response?.data?.orders || (Array.isArray(response) ? response : []);
      
      if (ordersArray && ordersArray.length > 0) {
        const formattedOrders = formatOrders(ordersArray);
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to cancel order. Please try again."
      );
    } finally {
      setProcessingId(null);
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
                <button
                  onClick={() =>
                    setExpandedOrderId((prev) =>
                      prev === order._id ? null : order._id
                    )
                  }
                  aria-expanded={expandedOrderId === order._id}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-xs sm:text-sm cursor-pointer"
                >
                  {expandedOrderId === order._id ? "Hide" : "View"} Order Details
                </button>

                {expandedOrderId === order._id && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 space-y-4">
                    {/* Order Status Section */}
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Order Status
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500">Current Status</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Order Date</p>
                          <p className="text-gray-900">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "-"}
                          </p>
                        </div>
                        {order.updatedAt && (
                          <div>
                            <p className="text-gray-500">Last Updated</p>
                            <p className="text-gray-900">
                              {new Date(order.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div>
                            <p className="text-gray-500">Estimated Delivery</p>
                            <p className="text-gray-900">
                              {new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Product Details
                      </h4>
                      <div className="space-y-3">
                        {(order.products || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                          >
                            {item?.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt={item?.productId?.name || "Product"}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {item?.productId?.name || "Product"}
                              </h5>
                              {item?.productId?.brand && (
                                <p className="text-xs text-gray-500">
                                  Brand:{" "}
                                  {typeof item.productId.brand === "string"
                                    ? item.productId.brand
                                    : item.productId.brand?.name || "-"}
                                </p>
                              )}
                              {item?.productId?.category && (
                                <p className="text-xs text-gray-500">
                                  Category:{" "}
                                  {typeof item.productId.category === "string"
                                    ? item.productId.category
                                    : item.productId.category?.name || "-"}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    Qty:
                                  </span>
                                  <span className="text-sm font-medium">
                                    {item.quantity || 1}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                  </p>
                                  {item.originalPrice &&
                                    item.originalPrice !== item.price && (
                                      <p className="text-xs text-gray-500 line-through">
                                        ₹{item.originalPrice.toLocaleString()}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {item?.variantId && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">
                                    Variant:{" "}
                                    {typeof item.variantId === "string"
                                      ? item.variantId
                                      : item.variantId?.name ||
                                        item.variantId?.label ||
                                        item.variantId?.value ||
                                        "-"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Information Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-gray-500">Order ID</p>
                        <p className="text-gray-900 break-all text-xs">
                          {order._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Method</p>
                        <p className="text-gray-900">
                          {typeof order.paymentMethod === "string"
                            ? order.paymentMethod
                            : order.paymentMethod?.name ||
                              order.paymentMethod?.label ||
                              "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Status</p>
                        <p className="text-gray-900">
                          {typeof order.paymentStatus === "string"
                            ? order.paymentStatus
                            : order.paymentStatus?.name ||
                              order.paymentStatus?.label ||
                              "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Order Type</p>
                        <p className="text-gray-900">
                          {typeof order.orderType === "string"
                            ? order.orderType
                            : order.orderType?.name ||
                              order.orderType?.label ||
                              "Standard"}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900 whitespace-pre-line">
                          {order?.deliveryAddress?.name ||
                          order?.deliveryAddress?.fullName
                            ? `${order.deliveryAddress.name || order.deliveryAddress.fullName}\n`
                            : ""}
                          {order?.deliveryAddress?.addressLine1 ||
                            order?.deliveryAddress?.street ||
                            order?.deliveryAddress?.address ||
                            ""}
                          {order?.deliveryAddress?.addressLine2 ||
                          order?.deliveryAddress?.houseApartmentName
                            ? `, ${order.deliveryAddress.addressLine2 || order.deliveryAddress.houseApartmentName}`
                            : ""}
                          {order?.deliveryAddress?.landmark
                            ? `, ${order.deliveryAddress.landmark}`
                            : ""}
                          {order?.deliveryAddress?.city
                            ? `, ${order.deliveryAddress.city}`
                            : ""}
                          {order?.deliveryAddress?.state
                            ? `, ${order.deliveryAddress.state}`
                            : ""}
                          {order?.deliveryAddress?.zip ||
                          order?.deliveryAddress?.pincode
                            ? `, ${order.deliveryAddress.zip || order.deliveryAddress.pincode}`
                            : ""}
                          {order?.deliveryAddress?.country
                            ? `\n${order.deliveryAddress.country}`
                            : ""}
                          {!order?.deliveryAddress && "-"}
                        </p>
                        {(order?.deliveryAddress?.phone ||
                          order?.deliveryAddress?.phoneNumber ||
                          order?.phone) && (
                          <p className="text-gray-900 mt-1">
                            Phone:{" "}
                            {order?.deliveryAddress?.phone ||
                              order?.deliveryAddress?.phoneNumber ||
                              order?.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tracking Information */}
                    {order.trackingNumber && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Tracking Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-blue-700 text-sm">
                              Tracking Number
                            </p>
                            <p className="text-blue-900 font-medium">
                              {order.trackingNumber}
                            </p>
                          </div>
                          {order.carrier && (
                            <div>
                              <p className="text-blue-700 text-sm">Carrier</p>
                              <p className="text-blue-900">
                                {typeof order.carrier === "string"
                                  ? order.carrier
                                  : order.carrier?.name ||
                                    order.carrier?.label ||
                                    "-"}
                              </p>
                            </div>
                          )}
                        </div>
                        {order.trackingUrl && (
                          <div className="mt-3">
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              Track Package
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          ₹
                          {typeof order.subTotal === "number"
                            ? order.subTotal.toLocaleString()
                            : (order.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      {typeof order.shippingCost === "number" && (
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-gray-900">
                            ₹{order.shippingCost.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {typeof order.discount === "number" &&
                        order.discount > 0 && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-gray-900">
                              - ₹{order.discount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      {typeof order.tax === "number" && (
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Tax</span>
                          <span className="text-gray-900">
                            ₹{order.tax.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          ₹{(order.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Cancel Order Button - Only show for pending orders */}
                    {String(order?.status || "").toLowerCase() ===
                      "pending" && (
                      <div className="pt-3 sm:pt-4 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => handleCancelOrder(order)}
                          disabled={processingId === order._id}
                          aria-busy={processingId === order._id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          {processingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
