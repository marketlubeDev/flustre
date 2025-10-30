import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const OrderPaymentStatus = ({ order }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(53, 115, 186, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#3573BA]">
          Payment status
        </span>
        <span className="text-[#000000]">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      {open && (
        <div className="p-4 text-[14px] text-[#141414] space-y-4">
          {/* Payment status */}
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">Payment status</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[12px]">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {(() => {
                const raw = (
                  order?.paymentStatus ||
                  order?.payment_status ||
                  order?.payment?.status ||
                  order?.paymentInfo?.status ||
                  order?.paymentDetails?.status ||
                  "Paid"
                )
                  .toString()
                  .trim();
                return raw || "Paid";
              })()}
            </span>
          </div>

          {/* Payment method */}
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">Payment method</span>
            <span className="text-[16px] font-medium text-[#141414]">
              {order?.paymentMethod || "Credit Card (**** 4532)"}
            </span>
          </div>

          {/* Transaction ID */}
          <div className="flex items-center justify-between">
            <span className="text-[#14141499] text-[16px]">Transaction ID</span>
            <span className="text-[16px] font-medium text-[#141414]">
              {order?.transactionId || "TXN-ABC123456"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPaymentStatus;
