import React, { useMemo, useState, useEffect } from "react";
import { Drawer, Select } from "antd";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import OrderCustomerBasics from "./OrderCustomerBasics";
import OrderProducts from "./OrderProducts";
import OrderPaymentStatus from "./OrderPaymentStatus";
import OrderPricing from "./OrderPricing";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/common";
import { ChevronDown, Printer } from "lucide-react";
import { IoPrintOutline } from "react-icons/io5";
import { updateOrderStatus } from "@/sevices/OrderApis";
import { toast } from "react-toastify";
import { triggerOrderUpdated } from "@/utils/menuCountUtils";

const OrdersDrawer = ({ open, onClose, order, onOrderUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [localOrder, setLocalOrder] = useState(order || null);

  // Update local order when order prop changes
  useEffect(() => {
    setLocalOrder(order || null);
  }, [order]);

  const title = localOrder
    ? `Order #${localOrder?._id?.slice(-6)?.toUpperCase()}`
    : "Order details";

  // Local state moved into dedicated section components
  const createdAtParts = useMemo(() => {
    if (!localOrder?.createdAt) return null;
    try {
      const d = new Date(localOrder.createdAt);
      const day = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return { day, time };
    } catch (_) {
      return null;
    }
  }, [localOrder?.createdAt]);

  const subtotal = useMemo(() => {
    if (!localOrder?.products) return 0;
    return localOrder.products.reduce(
      (sum, p) => sum + ((p?.price || 0) * (p?.quantity || 0)),
      0
    );
  }, [localOrder?.products]);

  const gst = useMemo(() => {
    // example 18% GST if not provided
    const explicit = localOrder?.taxAmount;
    if (typeof explicit === "number") return explicit;
    return Math.round(subtotal * 0.18);
  }, [localOrder?.taxAmount, subtotal]);

  const shipping = localOrder?.shippingAmount ?? 0;
  const grandTotal = useMemo(
    () => subtotal + gst + shipping,
    [subtotal, gst, shipping]
  );

  const renderStatusBadge = (value) => {
    const map = {
      shipped: {
        bg: "bg-status-shipped/10",
        text: "text-status-shipped",
        dot: "bg-status-shipped",
        label: "Shipped",
      },
      delivered: {
        bg: "bg-status-delivered/10",
        text: "text-status-delivered",
        dot: "bg-status-delivered",
        label: "Delivered",
      },
      processing: {
        bg: "bg-status-processing/10",
        text: "text-status-processing",
        dot: "bg-status-processing",
        label: "Processing",
      },
      pending: {
        bg: "bg-status-pending/10",
        text: "text-status-pending",
        dot: "bg-status-pending",
        label: "Pending",
      },
      cancelled: {
        bg: "bg-status-cancelled/10",
        text: "text-status-cancelled",
        dot: "bg-status-cancelled",
        label: "Cancelled",
      },
    };
    const c = map[value] || map.processing;
    return (
      <span
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  };

0


  const printInvoice = () => {
    window.print();
  };

  const handleStatusChange = async (newStatus) => {
    if (!localOrder?._id) return;

    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(localOrder._id, newStatus, "order");
      
      // Update local order immediately for instant UI feedback
      setLocalOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
        };
      });
      
      toast.success("Order status updated successfully");

      // Trigger menu count updates
      triggerOrderUpdated();

      // Notify parent to refresh orders list
      if (onOrderUpdate) {
        onOrderUpdate();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processed", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <Drawer
      title={
        localOrder ? (
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-base font-semibold text-[#000000] text-[28px]">
                #{localOrder._id?.slice(-6)?.toUpperCase()}
              </div>
              <div className="text-[12px] text-gray-500 font-[500] mt-0.5 flex items-center">
                {createdAtParts ? (
                  <>
                    <span>{createdAtParts.day}</span>
                    <span className="mx-2 inline-block w-1.5 h-1.5 rounded-full bg-[#3573BA]" />
                    <span>{createdAtParts.time}</span>
                  </>
                ) : null}
              </div>
            </div>
            {renderStatusBadge(localOrder?.status)}
          </div>
        ) : (
          <span>{title}</span>
        )
      }
      closeIcon={
        <span className="text-gray-600 hover:text-gray-800 text-xl leading-none">
          <IoClose />
        </span>
      }
      open={open}
      onClose={onClose}
      placement="right"
      width="28vw"
      destroyOnClose
      maskClosable
      rootClassName="orders-drawer"
      styles={{
        header: {
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          borderRadius: "12px 12px 0 0",
        },
        body: {
          padding: 0,
          borderRadius: "0 0 12px 12px",
        },
        wrapper: {
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
      footer={
        localOrder ? (
          <div className="px-4 py-2">
            <Button
              onClick={printInvoice}
              className="w-full flex items-center justify-center gap-2 border border-[#3573BA] text-[#3573BA] hover:bg-[#3573BA10]"
              variant="whiteWithBorder"
            >
              <span className="inline-block ">
                <IoPrintOutline />
              </span>
              <span>Print invoice</span>
            </Button>
          </div>
        ) : null
      }
    >
      {!localOrder ? (
        <div className="text-sm text-gray-500">No order selected.</div>
      ) : (
        <div className="space-y-3">
          {/* Status Update Section */}
          <div className="px-4 pt-4 pb-3 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Order Status
            </label>
            <Select
              value={localOrder?.status}
              onChange={handleStatusChange}
              loading={isUpdatingStatus}
              disabled={isUpdatingStatus}
              className="w-full"
              size="large"
              options={statusOptions}
            />
          </div>

          {/* Customer Information */}
          <OrderCustomerBasics order={localOrder} />

          {/* Products */}
          <OrderProducts order={localOrder} />

          {/* Payment status */}
          <OrderPaymentStatus order={localOrder} />

          {/* Pricing */}
          <OrderPricing order={localOrder} />

          {/* Order status timeline */}
          <OrderStatusTimeline
            createdAt={localOrder?.createdAt}
            status={localOrder?.status}
          />
        </div>
      )}
    </Drawer>
  );
};

export default OrdersDrawer;
