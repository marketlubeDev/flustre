import React, { useState, useEffect } from "react";

const ProductTableHeader = ({
  onSelectAll,
  selectedProducts,
  products,
  currentPage,
  onBulkDelete,
  onBulkStatusUpdate,
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedCount = selectedProducts?.length || 0;

  useEffect(() => {
    const currentProductIds = products.map((product) => product._id);
    const isAllCurrentSelected = currentProductIds.every((id) =>
      selectedProducts?.includes(id)
    );
    setIsAllSelected(isAllCurrentSelected);
  }, [selectedProducts, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Show bulk actions header when products are selected
  if (selectedCount > 0) {
    return (
      <thead className="bg-[#F8F8F8] border-b border-gray-200" style={{ height: '52px' }}>
        <tr style={{ height: '52px' }}>
          <th colSpan="7" className="px-6 py-1 text-left text-sm font-medium text-[#141414CC] tracking-normal" style={{ height: '52px', verticalAlign: 'middle' }}>
            <div className="flex items-center justify-between" style={{ height: '28px' }}>
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e, currentPage)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-[#141414CC]">
                  {selectedCount} products selected
                </span>
              </div>
                  <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-normal">Set to:</span>
                  <div className="relative">
                    <select 
                      className="text-sm font-normal bg-white border border-gray-300 rounded-lg px-2 py-1 text-[#141414CC] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer appearance-none pr-6 min-w-[100px]"
                      onChange={(e) => {
                        const status = e.target.value === 'Active';
                        onBulkStatusUpdate(selectedProducts, status);
                        // Reset to default after action
                        e.target.value = 'Active';
                      }}
                      defaultValue="Active"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* 3-dots dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <img 
                        src="/icons/3-dots.svg" 
                        alt="More options" 
                        className="w-5 h-5"
                      />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            // Handle archive product action
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Archive product
                        </button>
                        <button
                          onClick={() => {
                            onBulkDelete();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm font-normal hover:bg-red-50 transition-colors"
                          style={{ color: '#FB3748' }}
                        >
                          Delete product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </th>
        </tr>
      </thead>
    );
  }

  // Default header when no products are selected
  return (
    <thead className="bg-[#F8F8F8] border-b border-gray-200">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e, currentPage)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </th>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          Product name
        </th>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          Status
        </th>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          Category
        </th>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          Sub Category
        </th>
        <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-[#141414CC] tracking-normal border-r border-[#F0F0F0]">
          Last updated on
        </th>
        <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-[#141414CC] tracking-normal">
          
        </th>
      </tr>
    </thead>
  );
};

export default ProductTableHeader;
