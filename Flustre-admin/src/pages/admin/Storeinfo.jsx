import React, { useState } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import PageHeader from "../../components/Admin/PageHeader";
import { useEffect } from "react";
import { getStoreAndProducts } from "../../sevices/storeApis";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import Pagination from "../../components/Admin/Pagination";
import { toast } from "react-toastify";

function Storeinfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store, stores } = useLocation().state;
  const [selectedStore, setSelectedStore] = useState(id);
  const [storeInfo, setStoreInfo] = useState(store);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [cardState, setCardState] = useState({
    TotalSales: 0,
    MonthlyRevenue: 0,
    Profit: 0,
    TotalStoreValue: 0,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    setSelectedStore(id);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStoreAndProducts = async () => {
    try {
      setLoading(true);
      const response = await getStoreAndProducts(
        selectedStore,
        currentPage,
        itemsPerPage,
        debouncedSearchQuery
      );
      setProducts(response?.data?.products);
      setTotalPages(response?.data?.totalPages);
      setCardState({
        TotalSales: response?.data?.cardStats?.totalSales,
        MonthlyRevenue: response?.data?.cardStats?.monthlyRevenue,
        Profit: response?.data?.cardStats?.monthlyProfit,
        TotalStoreValue: response?.data?.cardStats?.totalStoreValue,
      });
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStoreInfo(() => {
      return stores.find((store) => store._id === selectedStore);
    });
    fetchStoreAndProducts();
  }, [id, selectedStore, currentPage, debouncedSearchQuery]);

  const handleStoreChange = (e) => {
    const newStoreId = e.target.value;
    setSelectedStore(newStoreId);
    setCurrentPage(1); // Reset to first page when changing stores
  };

  const handleEdit = (id) => {
    navigate(`/admin/product/addproduct`, { state: { productId: id } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <>
      {/* <PageHeader content="Store Information" marginBottom="mb-0" /> */}

      <div className="bg-white p-4  shadow flex justify-between ">
        <div className="text-sm text-gray-600 space-y-1">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            onChange={handleStoreChange}
            value={selectedStore}
          >
            {stores?.map((store) => (
              <option key={store._id} value={store._id}>
                {store?.store_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-2 space-y-6">
        {/* Store Info Header */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 space-y-1 cursor-pointer">
            <p>
              Store Name:{" "}
              <span className="font-bold">{storeInfo?.store_name}</span>
            </p>
            <p>
              Email address:{" "}
              <span className="text-green-600 font-bold">
                {storeInfo?.email}
              </span>
            </p>
            <p>
              Contact:{" "}
              <span className="font-bold">{storeInfo?.store_number}</span>
            </p>
            <p>
              Created on:{" "}
              <span className="font-bold">
                {new Date(storeInfo?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Metric Card */}
            <div className="bg-white flex items-center gap-3 p-4 rounded-xl cursor-pointer">
              <div className="w-4 h-4 bg-green-700 rounded-sm"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Sales</p>
                <p className="font-bold text-lg">
                    {cardState?.TotalSales}
                </p>
              </div>
            </div>
            <div className="bg-white flex items-center gap-3 p-4 rounded-xl cursor-pointer">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Monthly Revenue
                </p>
                <p className="font-bold text-lg">
                  ₹{cardState?.MonthlyRevenue}
                </p>
              </div>
            </div>
            <div className="bg-white flex items-center gap-3 p-4 rounded-xl cursor-pointer">
              <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Profit</p>
                <p className="font-bold text-lg">
                    ₹{cardState?.Profit}
                </p>
              </div>
            </div>
            <div className="bg-white  flex items-center gap-3 p-4 rounded-xl cursor-pointer">
              <div className="w-4 h-4 bg-red-300 rounded-sm"></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total store value
                </p>
                <p className="font-bold text-lg">₹{cardState?.TotalStoreValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
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
            <button
              className=" text-green-600 px-4 py-2 rounded-md border border-green-600"
              onClick={() =>
                navigate("/admin/product/addproduct", {
                  state: { storeId: selectedStore },
                })
              }
            >
              + Add Product
            </button>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left border-t">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Brand</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Last Updated on</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <tbody>
                  {products?.map((product) => (
                    <tr
                      key={product?._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2 flex items-center gap-2 ">
                        {/* <img
                          src={product?.mainImage}
                          alt="product"
                          className=" w-10 h-10 rounded-full"
                        /> */}
                        <span
                          title={product?.name}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {product?.name.slice(0, 40)}
                          {product?.name.length > 40 && "..."}
                        </span>
                      </td>
                      <td className="p-2">{product?.brand?.name}</td>
                      <td className="p-2">{product?.category?.name}</td>
                      <td className="p-2">
                        {new Date(product?.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <FaEdit
                          className="text-green-600 cursor-pointer"
                          onClick={() => handleEdit(product?._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          {!loading && products?.length > 0 && (
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
}

export default Storeinfo;
