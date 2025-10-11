import React from "react";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status, type = "order" }) => {
  const getStatusConfig = (status, type) => {
    const configs = {
      order: {
        pending: {
          bg: "bg-status-pending/10",
          text: "text-status-pending",
          border: "border-status-pending/20",
        },
        processed: {
          bg: "bg-status-processing/10",
          text: "text-status-processing",
          border: "border-status-processing/20",
        },
        processing: {
          bg: "bg-status-processing/10",
          text: "text-status-processing",
          border: "border-status-processing/20",
        },
        shipped: {
          bg: "bg-status-shipped/10",
          text: "text-status-shipped",
          border: "border-status-shipped/20",
        },
        delivered: {
          bg: "bg-status-delivered/10",
          text: "text-status-delivered",
          border: "border-status-delivered/20",
        },
        cancelled: {
          bg: "bg-status-cancelled/10",
          text: "text-status-cancelled",
          border: "border-status-cancelled/20",
        },
        onrefund: {
          bg: "bg-status-refund/10",
          text: "text-status-refund",
          border: "border-status-refund/20",
        },
        refunded: {
          bg: "bg-muted/10",
          text: "text-muted-foreground",
          border: "border-muted/20",
        },
      },
      payment: {
        pending: {
          bg: "bg-status-pending/10",
          text: "text-status-pending",
          border: "border-status-pending/20",
        },
        paid: {
          bg: "bg-status-delivered/10",
          text: "text-status-delivered",
          border: "border-status-delivered/20",
        },
        failed: {
          bg: "bg-status-cancelled/10",
          text: "text-status-cancelled",
          border: "border-status-cancelled/20",
        },
      },
    };
    const group = configs[type] || configs.order;
    return (group && group[status]) || (group && group.pending);
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.text} ${config.border} border font-medium capitalize`}
    >
      {status}
    </Badge>
  );
};

const OrdersTable = ({ orders, onOpenOrder }) => {
  const headers = [
    "Order ID",
    "Customer",
    "Date",
    "Product",
    "Total",
    "Payment",
    "Status",
    "Actions",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-t border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left border-r border-gray-200">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#6D0D26] focus:ring-[#6D0D26]"
              />
            </th>
            {headers.map((label, idx) => (
              <th
                key={label}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  idx < headers.length - 1 ? "border-r border-gray-200" : ""
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, index) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#6D0D26] focus:ring-[#6D0D26]"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  #{order._id.slice(-6).toUpperCase()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="text-sm text-gray-900">
                  {order?.deliveryAddress?.fullName ||
                    order?.user?.username ||
                    "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {order?.deliveryAddress?.phoneNumber ||
                    order?.user?.phonenumber ||
                    ""}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="text-sm text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="text-sm text-gray-900">
                  {order?.products?.[0]?.productId?.name || "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {order?.products && order.products.length > 1
                    ? `+${order.products.length - 1} more`
                    : ""}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  ₹{Number(order?.totalAmount ?? 0).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      (order?.paymentStatus || "pending") === "paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-900 capitalize">
                    {order?.paymentStatus || "pending"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <StatusBadge status={order?.status || "pending"} type="order" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => onOpenOrder?.(order)}
                  aria-label="Open order actions"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
