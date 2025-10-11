import React from "react";
import { FaCheckToSlot, FaListCheck, FaTruck } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { TbCreditCardRefund } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
function Ordercards({ data, count }) {
  const Icon = () => {
    switch (data) {
      case "Pending Orders":
        return (
          <div className="bg-[#FFA500] p-2 flex items-center">
            <BiTime className="text-xl text-white" />
          </div>
        );
      case "Processing Orders":
        return (
          <div className="bg-[#3B82F6] p-2 flex items-center">
            <FaListCheck className="text-xl text-white" />
          </div>
        );
      case "Shipped Orders":
        return (
          <div className="bg-[#8B5CF6] p-2 flex items-center">
            <FaTruck className="text-xl text-white" />
          </div>
        );
      case "Delivered Orders":
        return (
          <div className="bg-[#10B981] p-2 flex items-center">
            <FaCheckToSlot className="text-xl text-white" />
          </div>
        );
      case "On Refund Orders":
        return (
          <div className="bg-[#F59E0B] p-2 flex items-center">
            <MdOutlineSettingsBackupRestore className="text-xl text-white" />
          </div>
        );
      case "Refunded Orders":
        return (
          <div className="bg-[#6B7280] p-2 flex items-center">
            <TbCreditCardRefund className="text-xl text-white" />
          </div>
        );
      case "Cancelled Orders":
        return (
          <div className="bg-[#EF4444] p-2 flex items-center">
            <TiCancel className="text-2xl text-white" />
          </div>
        );
      case "Confirmed Orders":
        return (
          <div className="bg-[#3B82F6] p-2 flex items-center">
            <GiConfirmed className="text-xl text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-4 max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <Icon />
        <div>
          <h5 className="text-lg font-medium tracking-tight text-gray-900 dark:text-white">
            {count}
          </h5>
          <p className="font-medium text-xs text-gray-700 dark:text-gray-400">
            {data}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Ordercards;
