import React, { useEffect, useState } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { BiExport } from "react-icons/bi";
import { getInventory } from "../../sevices/inventoryApi";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import Pagination from "../../components/Admin/Pagination";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getAllCategories } from "../../sevices/categoryApis";
import { toast } from "react-toastify";

const Inventory = ({ role }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const convertToCSV = (data) => {
    const headers = [
      "Product Name",
      "Category",
      "Price",
      "Gross Price",
      "SKU",
      "Quantity",
      "Total Stock",
    ];

    const rows = data.map((product) => [
      product.name,
      product?.category?.name || "N/A",
      product.price || 0,
      product.grossPrice || 0,
      product.sku || "N/A",
      product.stock || 0,
      product.totalStock || 0,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const downloadCSV = async () => {
    try {
      setLoading(true);
      const response = await getInventory({
        search: searchQuery,
        categoryId: selectedCategory,
        page: 1,
        limit: 1000000,
      });

      const csvContent = convertToCSV(response.data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      const url = window.URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const date = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `inventory_report_${date}.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (pageNumber, isFilterChange = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageNumber,
        limit: 10,
        categoryId:
          selectedCategory !== "All Categories" ? selectedCategory : undefined,
        search: searchQuery || undefined,
      };

      const response = await getInventory(params);

      if (response.success) {
        setInventory(response.data);
        setTotalPages(response.pagination.totalPages);
        if (!isFilterChange) {
          setCurrentPage(pageNumber);
        }
      } else {
        setError(response.message || "Failed to fetch inventory");
        setInventory([]);
        setTotalPages(1);
      }
    } catch (error) {
      setError(error?.message || "Failed to fetch inventory");
      setInventory([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
    else fetchInventory(1, false);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchInventory(currentPage, false);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.envelop.data);
    } catch (error) {
      toast.error(error?.message || "Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* <PageHeader content="Inventory" marginBottom="mb-0" /> */}
      <div className="bg-white p-4 shadow flex gap-2">
        <div className="text-sm text-gray-600 space-y-1">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All Categories">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 space-y-1 ml-auto">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md flex gap-1 items-center justify-center text-md"
            onClick={downloadCSV}
            disabled={loading}
          >
            <BiExport className="text-md" />
            {loading ? "Exporting..." : "Export sheet"}
          </button>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/5">
              <input
                type="text"
                placeholder="Search by product name, SKU..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-t">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Gross Price</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Total Stock</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <LoadingSpinner size="sm" />
                    </td>
                  </tr>
                </tbody>
              ) : !isLoading && inventory.length > 0 ? (
                <tbody>
                  {inventory.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="p-2" title={product.name}>
                        {product.name.slice(0, 30)}
                        {product.name.length > 30 && "..."}
                      </td>
                      <td className="p-2">
                        {product?.category?.name || "N/A"}
                      </td>
                      <td className="p-2">
                        ₹ {product.price?.toLocaleString()}
                      </td>
                      <td className="p-2">
                        ₹ {product.grossPrice?.toLocaleString()}
                      </td>
                      <td className="p-2">{product.sku}</td>
                      <td className="p-2">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                !isLoading &&
                inventory.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No products found matching your criteria
                  </div>
                )
              )}
            </table>
          </div>

          {!loading && !error && inventory.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Inventory;
