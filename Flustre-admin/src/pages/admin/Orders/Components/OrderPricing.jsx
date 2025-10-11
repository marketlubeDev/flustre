import React, { useMemo, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const OrderPricing = ({ order }) => {
  const [open, setOpen] = useState(true);

  const subtotal = useMemo(() => {
    if (!order?.products) return 0;
    return order.products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
      0
    );
  }, [order?.products]);

  const gst = useMemo(() => {
    const explicit = order?.taxAmount;
    if (typeof explicit === "number") return explicit;
    const computed = subtotal * 0.18;
    return Math.round(computed * 100) / 100; // round to 2 decimals
  }, [order?.taxAmount, subtotal]);

  const shipping = order?.shippingAmount ?? 0;
  const grandTotal = useMemo(
    () => subtotal + gst + shipping,
    [subtotal, gst, shipping]
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(109, 13, 38, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#6D0D26]">
          Pricing
        </span>
        <span className="text-[#000000]">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      {open && (
        <div className="p-4 text-[14px] text-[#141414] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">Subtotal</span>
            <span className="text-[#141414] text-[16px]">
              ₹{subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">GST</span>
            <span className="text-[#141414] text-[16px]">
              ₹
              {gst.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">Shipping</span>
            <span className="text-[#141414] text-[16px]">
              ₹
              {Number(shipping || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3 mt-2 flex items-center justify-between font-semibold">
            <span className="text-[#14141499] text-[16px]">Total</span>
            <span className="text-[#6D0D26] text-[16px]">
              ₹
              {(
                Math.round((subtotal + gst + shipping) * 100) / 100
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPricing;
