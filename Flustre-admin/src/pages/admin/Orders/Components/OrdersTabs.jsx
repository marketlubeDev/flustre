import React from "react";

const OrdersTabs = ({ activeTab, onTabChange, orderCounts }) => {
  const tabs = [
    { key: "all", label: "All Orders", count: orderCounts.all },
    { key: "processing", label: "Processing", count: orderCounts.processing },
    { key: "shipped", label: "Shipped", count: orderCounts.shipped },
    { key: "delivered", label: "Delivered", count: orderCounts.delivered },
    { key: "cancelled", label: "Cancelled", count: orderCounts.cancelled },
  ];

  return (
    <div className="bg-white rounded-t-lg flex-shrink-0">
      <div className="flex space-x-8 px-6 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.key
                ? "border-[#3573BA] text-[#3573BA]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}{" "}
            <span className="ml-2 bg-[#3573BA1F] text-[#3573BA] py-1 px-2 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersTabs;
