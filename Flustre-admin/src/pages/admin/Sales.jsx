import React, { useEffect, useState } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { BiExport } from "react-icons/bi";
import { getSalesReport } from "../../sevices/salesApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import Pagination from "../../components/Admin/Pagination";
import { FaSearch } from "react-icons/fa";
import { getStores } from "../../sevices/storeApis";
import { getAllBrands } from "../../sevices/brandApis";
import { useSelector } from "react-redux";

const Sales = ({ role }) => {
  const store = useSelector((state) => state.store.store);

  const [salesReport, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStore, setSelectedStore] = useState(
    role === "admin" ? "All Stores" : store?._id
  );
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  const convertToCSV = (data) => {
    const headers = [
      "Product Name",
      "Category",
      "Brand",
      "Price",
      "Offer Price",
      "Gross Price",
      "Units Sold",
      "Total Revenue",
      "Average Order Value",
    ];

    const rows = data.map((product) => [
      product.name,
      product?.category?.name || "N/A",
      product.brand?.name || "N/A",
      product.price || 0,
      product.offerPrice || 0,
      product.grossPrice || 0,
      product.salesMetrics?.totalQuantity || 0,
      product.salesMetrics?.totalRevenue || 0,
      product.salesMetrics?.averageOrderValue || 0,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const downloadCSV = async () => {
    try {
      setLoading(true);
      const response = await getSalesReport(1, 1000000, {
        storeId: selectedStore,
        brandId: selectedBrand,
        search: searchQuery,
      });

      const csvContent = convertToCSV(response.data.products);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      const url = window.URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const date = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `sales_report_${date}.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      const response = await getStores();
      setStores(response?.stores);
      setIsLoading(false);
    };
    if (role === "admin") {
      fetchStores();
    }
  }, []);

  const fetchSalesReport = async (pageNumber) => {
    try {
      setLoading(true);
      const filters = {
        storeId: selectedStore,
        brandId: selectedBrand,
        search: searchQuery,
      };
      const response = await getSalesReport(pageNumber, 10, filters);
      setSalesReport(response.data.products || []);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllBrands();
      setBrands(response.data.brands);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchSalesReport(1);
  }, [searchQuery, selectedStore, selectedBrand]);

  // Handle page changes
  useEffect(() => {
    fetchSalesReport(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {/* <PageHeader content="Sales" marginBottom="mb-0" /> */}
      {/* <div className="bg-white p-4 shadow flex gap-2">
        <div className="text-sm text-gray-600 space-y-1">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
            value={selectedStore}
            onChange={handleStoreChange}
            disabled={role === "store"}
          >
            {role === "admin" ? (
              <option value="All Stores">All Stores</option>
            ) : (
              <option value={store?._id}>{store?.store_name}</option>
            )}
            {role === "admin" &&
              stores?.map((store) => (
                <option key={store._id} value={store._id}>
                  {store?.store_name}
                </option>
              ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="All Brands">All Brands</option>
            {brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand?.name}
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
      </div> */}

      {/* Sales Table Section */}
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
                  <th className="p-2">Offer Price</th>
                  <th className="p-2">Gross Price</th>
                  <th className="p-2">Units Sold</th>
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
              ) : (
                <tbody>
                  {salesReport.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className="p-2 flex items-center gap-2"
                        title={product.name}
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {product.name.slice(0, 30)}
                        {product.name.length > 30 && (
                          <span className="text-xs ml-1">...</span>
                        )}
                      </td>
                      <td className="p-2">
                        {product?.category?.name || "N/A"}
                      </td>

                      <td className="p-2">
                        ₹ {product.price?.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <span className="text-green-600">
                          ₹ {product.offerPrice?.toLocaleString()}
                          {product.offerPrice && product.price && (
                            <span className="text-xs ml-1">
                              (
                              {Math.round(
                                (1 - product.offerPrice / product.price) * 100
                              )}
                              % off)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-2">
                        ₹ {product.grossPrice?.toLocaleString()}
                      </td>
                      <td className="p-2">
                        {product.salesMetrics?.totalQuantity || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {!loading && salesReport.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {!loading && salesReport.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No Records found matching your criteria
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sales;
