import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrdersPagination = ({
  currentPage,
  totalPages,
  orders,
  onPageChange,
  getPageNumbers,
}) => {
  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Rows per page</span>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D0D26] focus:border-transparent"
          value="9"
          onChange={(e) =>
            console.log("Rows per page changed:", e.target.value)
          }
        >
          <option value="5">5</option>
          <option value="9">9</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Showing {(currentPage - 1) * 9 + 1} to{" "}
          {Math.min(currentPage * 9, orders.length)} of {orders.length} results
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === pageNumber
                ? "bg-[#6D0D26] text-white"
                : "text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OrdersPagination;
