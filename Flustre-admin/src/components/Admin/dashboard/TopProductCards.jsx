import React from "react";

function TopProductCards({ item }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col h-[400px]">
      <div className="h-72 p-5">
        <img
          className="w-full h-full rounded-t-lg object-contain"
          src={Array.isArray(item?.image) ? item?.image?.[0] : item?.image}
          alt="product image"
        />
      </div>

      <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
        <div className="flex justify-between">
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
            {item?.name}
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white ml-2">
            ₹{item?.price}
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {item?.orderCount} Orders
          </p>
          <p className="text-sm font-semibold  text-gray-600 dark:text-white md:text-base">
            {item?.totalOrdered} quantity 
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopProductCards;
