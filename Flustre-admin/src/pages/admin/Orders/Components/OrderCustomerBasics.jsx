import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const OrderCustomerBasics = ({ order }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(53, 115, 186, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#3573BA]">
          Customer Information
        </span>
        <span className="text-[#000000]">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>

      {open && (
        <div className="p-4 text-gray-700">
          {/* Customer name */}
          <div className="text-[14px] text-[#14141499] font-medium">
            Customer name
          </div>
          <div className="mt-1 text-[18px] font-medium text-[#141414]">
            {order?.deliveryAddress?.fullName || "—"}
          </div>

          {/* Email & phone */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[14px] text-[#14141499] font-medium">
                Email
              </div>
              <div className="mt-1 flex items-center gap-2 text-[16px] text-[#141414]">
                <HiOutlineMail className="text-[#14141499]" />
                <span className="text-[#141414] text-[16px] font-medium">
                  {order?.email || "sarahjohnson@gmail.com"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#14141499] font-medium">
                Phone number
              </div>
              <div className="mt-1 flex items-center gap-2 text-[16px] text-[#141414]">
                <HiOutlinePhone className="text-[#14141499]" />
                <span className="text-[#141414] text-[16px] font-medium">
                  {order?.deliveryAddress?.phoneNumber || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="mt-5 text-[14px] text-[#14141499] font-medium">
            Shipping address
          </div>
          <div className="mt-1 flex items-start gap-2 text-[16px] text-[#141414] ">
            <HiOutlineLocationMarker className="mt-[2px] text-[#14141499]" />
            <span className="text-[#141414] text-[16px] font-medium">
              {[
                order?.deliveryAddress?.building,
                order?.deliveryAddress?.street,
                order?.deliveryAddress?.landmark,
                order?.deliveryAddress?.city,
                order?.deliveryAddress?.state,
                order?.deliveryAddress?.pincode,
                order?.deliveryAddress?.country,
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCustomerBasics;
