import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const OrderProducts = ({ order }) => {
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
          Products ({order?.products?.length || 0})
        </span>
        <span className="text-[#000000]">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>

      {open && (
        <div className="divide-y divide-gray-200">
          {order?.products?.map((item) => (
            <div key={item._id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                <img
                  alt={item.productId?.name}
                  src={item.productId?.images?.[0]}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[16px] text-[#141414] truncate font-[600]">
                  {item.productId?.name}
                </div>
                <div className="text-[14px] text-[#00000099]">
                  Qty: {item.quantity} × ₹
                  {Number(item.price || 0).toLocaleString()}
                </div>
              </div>
              <div className="text-[16px] font-medium text-[#141414] ">
                ₹{Number(item.price * item.quantity || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderProducts;
