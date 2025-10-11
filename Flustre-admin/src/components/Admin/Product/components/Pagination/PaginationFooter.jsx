import React from "react";

const PaginationFooter = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onItemsPerPageChange,
  onPageChange 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const rowsPerPageOptions = [5, 10, 20, 50];

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center px-6 py-3 bg-white border-t border-gray-200">
      {/* Left side - Rows per page */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-700">Rows per page</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="text-xs border border-gray-300 rounded pl-1 pr-0 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-15"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Center - Empty space */}
      <div className="flex-1"></div>

      {/* Right side - Showing information and Page navigation */}
      <div className="flex items-center space-x-4">
        {/* Showing information */}
        <div className="text-xs text-gray-700">
          Showing <span className="px-2 py-0.5 border border-gray-300 rounded bg-gray-50 text-xs">{startItem}</span> of {totalPages} pages
        </div>

        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === "..." ? (
                  <span className="px-1 py-0.5 text-xs text-[#141414E5]">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(pageNumber)}
                    className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                      currentPage === pageNumber
                        ? "bg-[#6D0D2612] text-white"
                        : "text-[#141414E5] hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationFooter; 