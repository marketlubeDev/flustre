import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listProducts,
  searchProducts,
  deleteProduct,
  bulkUpdateProductStatus,
} from "../../../sevices/ProductApis";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

import PageHeader from "../../../components/Admin/PageHeader";
import ProductTable from "../../../components/Admin/Product/components/Table/ProductTable";
import Pagination from "../../../components/Admin/Product/components/Pagination/Pagination";
import { Modal } from "../../../components/shared/Modal";
import { BulkOfferForm } from "../../../components/Admin/Product/components/Forms/BulkOfferForm";
import ProductViewHeader from "../../../components/Admin/Product/components/ProductViewHeader";
import { useSelector } from "react-redux";
import { adminUtilities } from "../../../sevices/adminApis";
import { triggerProductDeleted } from "../../../utils/menuCountUtils";

function Products({ role }) {
  // const stores = useSelector((state) => state.adminUtilities.stores);
  // const brands = useSelector((state) => state.adminUtilities.brands);
  // const categories = useSelector((state) => state.adminUtilities.categories);
  const store = useSelector((state) => state.store.store);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageRender, setPageRender] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStore, setSelectedStore] = useState(store?._id);
  const [selectedActiveStatus, setSelectedActiveStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [productCounts, setProductCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0,
    drafts: 0,
  });
  const navigate = useNavigate();

  const [showBulkOfferModal, setShowBulkOfferModal] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const selectedProductsCount = selectedProducts?.length;

  // handleIsProductSelected
  useEffect(() => {
    const handleIsProductSelected = () => {
      if (selectedProducts.length > 0) {
        setIsProductSelected(true);
      } else {
        setIsProductSelected(false);
      }
    };
    handleIsProductSelected();
  }, [selectedProducts]);

  // Fetch products when page changes or on initial load
  useEffect(() => {
    const fetchAdminUtilities = async () => {
      try {
        const res = await adminUtilities();
        setStores(res?.data?.stores);
      } catch (err) {
        toast.error("Failed to fetch admin utilities");
      }
    };
    fetchAdminUtilities();
  }, []);

  useEffect(() => {
    let filter = {};
    if (selectedStore) {
      filter.store = selectedStore;
    }

    // Handle tab-based filtering
    if (activeTab !== "all") {
      if (activeTab === "active") {
        filter.activeStatus = "active";
      } else if (activeTab === "inactive") {
        filter.activeStatus = "inactive";
      } else if (activeTab === "outOfStock") {
        filter.stock = 0;
      } else if (activeTab === "drafts") {
        filter.isDraft = true;
      }
    }

    fetchProducts(currentPage, filter);
  }, [currentPage, pageRender, pageSize, selectedStore, activeTab]);

  const fetchProducts = async (page, filter) => {
    try {
      setIsLoading(true);

      const res = await listProducts(page, pageSize, filter);
      setProducts(res?.data?.data?.products);
      setTotalPages(res?.data?.data?.totalPages);

      // Update product counts (this would ideally come from the API)
      setProductCounts({
        all: res?.data?.data?.totalProducts || 0,
        active: res?.data?.data?.activeCount || 0,
        inactive: res?.data?.data?.inactiveCount || 0,
        outOfStock: res?.data?.data?.outOfStockCount || 0,
        drafts: res?.data?.data?.draftsCount || 0,
      });
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle All products checkbox selection
  const handleSelectAll = (e, currentPage) => {
    if (e.target.checked) {
      // Select all products on the current page
      setSelectedProducts((prevSelected) => [
        ...prevSelected,
        ...products.map((product) => product._id),
      ]);
      setIsProductSelected(true);
    } else {
      // Deselect only the products from the current page
      setSelectedProducts((prevSelected) =>
        prevSelected.filter(
          (productId) => !products.some((product) => product._id === productId)
        )
      );
      setIsProductSelected(false);
    }
  };

  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    setIsProductSelected(false);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.warning("Please select products to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} product(s)?`
      )
    ) {
      try {
        setIsLoading(true);

        // Delete all selected products
        const deletePromises = selectedProducts.map((productId) =>
          deleteProduct(productId)
        );
        await Promise.all(deletePromises);

        toast.success(
          `${selectedProducts.length} product(s) deleted successfully`
        );

        // Trigger menu count updates
        triggerProductDeleted();

        // Clear selection and refresh products
        clearSelectedProducts();
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting products:", error);
        toast.error(
          error?.response?.data?.message || "Failed to delete products"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkStatusUpdate = async (productIds, activeStatus) => {
    if (productIds.length === 0) {
      toast.warning("Please select products to update");
      return;
    }

    try {
      setIsLoading(true);

      // Update status for all selected products
      await bulkUpdateProductStatus(productIds, activeStatus);

      const statusText = activeStatus ? "active" : "inactive";
      toast.success(
        `${productIds.length} product(s) set to ${statusText} successfully`
      );

      // Clear selection and refresh products
      clearSelectedProducts();
      await fetchProducts();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update product status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStoreChange = (storeId) => {
    setSelectedStore(storeId);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
    navigate("addproduct", {
      state: {
        storeId: store?._id,
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Product View Header */}
      <div className="flex-shrink-0">
        <ProductViewHeader
          productCounts={productCounts}
          selectedStore={selectedStore}
          stores={stores}
          onStoreChange={handleStoreChange}
          role={role}
          onAddProduct={handleAddProduct}
        />
      </div>

      <div className="flex flex-col flex-1 mx-6 mb-6 overflow-auto min-h-0">
        <div className="bg-white rounded-lg shadow-sm border flex flex-col min-h-0">
          {/* Tab Navigation */}
          <div className="bg-white rounded-t-lg flex-shrink-0">
            <div className="flex space-x-8 px-6 pb-0">
              <button
                onClick={() => handleTabChange("all")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-[#6D0D26] text-[#6D0D26]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Products{" "}
                <span className="ml-2 bg-[#6D0D261F] text-[#6D0D26] py-1 px-2 rounded-full text-xs">
                  {productCounts.all}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-[#6D0D26] text-[#6D0D26]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active{" "}
                <span className="ml-2 bg-[#6D0D261F] text-[#6D0D26] py-1 px-2 rounded-full text-xs">
                  {productCounts.active}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("inactive")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "inactive"
                    ? "border-[#6D0D26] text-[#6D0D26]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Inactive{" "}
                <span className="ml-2 bg-[#6D0D261F] text-[#6D0D26] py-1 px-2 rounded-full text-xs">
                  {productCounts.inactive}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("outOfStock")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "outOfStock"
                    ? "border-[#6D0D26] text-[#6D0D26]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Out of stock{" "}
                <span className="ml-2 bg-[#6D0D261F] text-[#6D0D26] py-1 px-2 rounded-full text-xs">
                  {productCounts.outOfStock}
                </span>
              </button>
              <button
                onClick={() => handleTabChange("drafts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "drafts"
                    ? "border-[#6D0D26] text-[#6D0D26]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Drafts{" "}
                <span className="ml-2 bg-[#6D0D261F] text-[#6D0D26] py-1 px-2 rounded-full text-xs">
                  {productCounts.drafts}
                </span>
              </button>
            </div>
          </div>
          {/* Table section with loading state */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner color="primary" text="Loading..." fullScreen />
              </div>
            )}
            {!isLoading && products?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new product.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() =>
                      navigate("addproduct", {
                        state: {
                          storeId: store?._id,
                        },
                      })
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    + Add Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <ProductTable
                  products={products}
                  onSelectAll={handleSelectAll}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  isProductSelected={isProductSelected}
                  selectedProductsCount={selectedProductsCount}
                  role={role}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={productCounts.all}
                  itemsPerPage={pageSize}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  onPageChange={handlePageChange}
                  refetchProducts={fetchProducts}
                  onBulkDelete={handleBulkDelete}
                  onBulkStatusUpdate={handleBulkStatusUpdate}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Offer Modal */}
      <Modal
        isOpen={showBulkOfferModal}
        onClose={() => setShowBulkOfferModal(false)}
      >
        <BulkOfferForm
          onClose={() => setShowBulkOfferModal(false)}
          isProductSelected={isProductSelected}
          selectedProducts={selectedProducts}
          setPageRender={setPageRender}
          clearSelectedProducts={clearSelectedProducts}
        />
      </Modal>
    </div>
  );
}

export default Products;
