import { Plus } from "lucide-react";
import { RiExportLine } from "react-icons/ri";
import { Button } from "@/components/common";
import SearchInput from "@/components/common/SearchInput";
import { Selector } from "@/components/common";

const OrdersSearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubCategoryChange,
  categories,
  currentSubcategories,
  onExport,
  onCreateOrder,
}) => {
  return (
    <div className=" bg-white p-4 pt-2 px-1 sticky top-0">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Bar */}
            <div className="w-full sm:w-64">
              <SearchInput
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search orders..."
                containerClassName="relative"
                inputClassName="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none shadow-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Categories Dropdown */}
              <div className="min-w-[140px]">
                <Selector
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  options={categories}
                  placeholder="All Categories"
                  containerClassName=""
                  className="text-sm"
                />
              </div>

              {/* Sub Categories Dropdown */}
              <div className="min-w-[140px]">
                <Selector
                  value={selectedSubcategory}
                  onChange={(e) => onSubCategoryChange(e.target.value)}
                  options={currentSubcategories}
                  placeholder="All Sub-categories"
                  disabled={!selectedCategory}
                  containerClassName=""
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="exportButton"
              className="text-sm"
              onClick={onExport}
            >
              <RiExportLine className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button
              variant="gradientRose"
              className="text-sm"
              onClick={onCreateOrder}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create order</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersSearchFilters;
