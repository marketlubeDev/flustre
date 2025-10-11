import React, { useMemo, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { PiPackage } from "react-icons/pi";
import { LuCircleDashed } from "react-icons/lu";

const OrderStatusTimeline = ({ createdAt, status }) => {
  const [open, setOpen] = useState(true);

  const createdAtLabel = useMemo(() => {
    if (!createdAt) return "";
    try {
      const d = new Date(createdAt);
      const day = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace("AM", "am")
        .replace("PM", "pm");
      return `${day} • ${time}`;
    } catch (_) {
      return "";
    }
  }, [createdAt]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between  px-4 py-2 text-left"
        style={{ background: "rgba(109, 13, 38, 0.06)" }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-[600] text-[#6D0D26]">
          Order status
        </span>
        <span className="text-[#000000]">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      {open && (
        <div className="p-4 pl-14 relative">
          {(() => {
            const steps = [
              { label: "Order Placed", time: createdAtLabel },
              { label: "Payment Confirmed", time: createdAtLabel },
              { label: "Processing", time: createdAtLabel },
              { label: "Shipped", time: createdAtLabel },
              { label: "Delivered", time: createdAtLabel },
            ];
            const normalized = String(status || "processing").toLowerCase();
            const statusToIndex = {
              pending: 0,
              processing: 2,
              shipped: 3,
              delivered: 4,
              cancelled: 2,
            };
            const currentIndex =
              typeof statusToIndex[normalized] === "number"
                ? statusToIndex[normalized]
                : 2;
            return steps.map((step, i) => {
              const isCompleted = i <= currentIndex;
              const isFuture = i > currentIndex;
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={i}
                  className={`relative pb-7 ${isLast ? "pb-0" : ""}`}
                >
                  {/* status dot - outer ring with inner dot */}
                  <span
                    className={`absolute -left-6 -translate-x-1/2 top-0 flex items-center justify-center w-6 h-6 rounded-full border-[1px] ${
                      isCompleted
                        ? "border-[#6D0D26] bg-[#6D0D26]"
                        : "border-[#6D0D2699] bg-white"
                    }`}
                  >
                    <span className="flex items-center justify-center ">
                      {isFuture ? (
                        <LuCircleDashed size={14} className="text-[#6D0D26]" />
                      ) : (
                        <PiPackage
                          size={14}
                          className={
                            isCompleted ? "text-white " : "text-gray-400"
                          }
                        />
                      )}
                    </span>
                  </span>
                  {/* connector line to next icon (only between icons) */}
                  {!isLast && (
                    <span
                      className={`absolute -left-6 -translate-x-1/2 top-8 bottom-2 w-[2px] ${
                        i < currentIndex ? "bg-[#6D0D26]" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`text-[16px] font-[600] ${
                      isCompleted
                        ? "text-[#141414] font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-[12px] font-[500] ${
                      isCompleted ? "text-[#000000B2]" : "text-gray-300"
                    }`}
                  >
                    {isCompleted ? step.time : "—"}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
};

export default OrderStatusTimeline;
