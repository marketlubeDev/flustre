import { useEffect, useState,  } from "react";
import OrdersSearchFilters from "./Components/OrdersSearchFilters";
import OrdersTabs from "./Components/OrdersTabs";
import OrdersTable from "./Components/OrdersTable";
import OrdersDrawer from "./Components/OrdersDrawer";
import OrdersPagination from "./Components/OrdersPagination";
import { getOrders, getOrderStats } from "@/sevices/OrderApis";
import { getAllCategories } from "@/sevices/categoryApis";
import { getAllSubCategories } from "@/sevices/subcategoryApis";



const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Handler functions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSubcategory("");
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSubcategory(value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // also reflect tab into status filter for server
    const map = {
      processing: "processed",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    setSelectedStatus(map[tab] || "");
    setCurrentPage(1);
  };

  const handleExport = () => {
    // TODO: Implement export functionality

  };

  const handleCreateOrder = () => {
    // TODO: Implement create order functionality
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await getAllCategories();
        const categoriesData = 
          response?.categories ||
          response?.data?.categories ||
          response?.envelop?.data ||
          response?.data?.envelop?.data ||
          [];
        
        // Transform to match Selector component format
        const formattedCategories = categoriesData.map((category) => ({
          id: category._id,
          value: category._id,
          name: category.name,
          label: category.name,
        }));
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories from backend
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await getAllSubCategories();
        // Handle different response structures - API may return array directly or wrapped
        const subcategoriesData = Array.isArray(response)
          ? response
          : response?.subcategories ||
            response?.data?.subcategories ||
            response?.data ||
            [];
        
        // Transform to match Selector component format
        const formattedSubcategories = subcategoriesData.map((subcategory) => ({
          id: subcategory._id,
          value: subcategory._id,
          name: subcategory.name,
          label: subcategory.name,
          categoryId: subcategory.category?._id || subcategory.category,
        }));
        
        setSubcategories(formattedSubcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, []);

  // Get current subcategories based on selected category
  const currentSubcategories = selectedCategory
    ? subcategories.filter(
        (subcat) => subcat.categoryId === selectedCategory
      )
    : [];

  // Order counts for tabs
  const orderCounts = stats?.statusCounts
    ? {
        all:
          (stats?.statusCounts?.pending || 0) +
          (stats?.statusCounts?.processed || 0) +
          (stats?.statusCounts?.shipped || 0) +
          (stats?.statusCounts?.delivered || 0) +
          (stats?.statusCounts?.cancelled || 0),
        processing: stats?.statusCounts?.processed || 0,
        shipped: stats?.statusCounts?.shipped || 0,
        delivered: stats?.statusCounts?.delivered || 0,
        cancelled: stats?.statusCounts?.cancelled || 0,
      }
    : {
        all: orders.length,
        processing: orders.filter((order) => order.status === "processed")
          .length,
        shipped: orders.filter((order) => order.status === "shipped").length,
        delivered: orders.filter((order) => order.status === "delivered")
          .length,
        cancelled: orders.filter((order) => order.status === "cancelled")
          .length,
      };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openOrderDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeOrderDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdate = () => {
    // Refresh orders list after status update
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = [];
        params.push(`page=${currentPage}`);
        params.push(`limit=10`);
        
        const statusForServer =
          selectedStatus ||
          (activeTab === "processing" ? "processed" : activeTab);
        if (statusForServer && statusForServer !== "all") {
          params.push(`status=${encodeURIComponent(statusForServer)}`);
        }
        if (selectedCategory) {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (selectedSubcategory) {
          params.push(`subcategory=${encodeURIComponent(selectedSubcategory)}`);
        }
        const [start, end] = dateRange || [];
        if (start && end) {
          const startIso = new Date(
            new Date(start).setHours(0, 0, 0, 0)
          ).toISOString();
          const endIso = new Date(
            new Date(end).setHours(23, 59, 59, 999)
          ).toISOString();
          params.push(`startDate=${encodeURIComponent(startIso)}`);
          params.push(`endDate=${encodeURIComponent(endIso)}`);
        }
        const queryString = `?${params.join("&")}`;
        const [ordersRes, statsRes] = await Promise.all([
          getOrders(queryString),
          getOrderStats(),
        ]);
        const apiOrders = ordersRes?.data?.orders || ordersRes?.orders || [];
        const apiPagination = ordersRes?.data?.pagination || {};
        const apiTotalPages =
          apiPagination?.totalPages || ordersRes?.totalPages || 1;
        setOrders(apiOrders);
        setTotalPages(apiTotalPages);
        setStats(statsRes?.stats || statsRes || null);
        
        // Update selectedOrder if it exists
        if (selectedOrder?._id) {
          const updatedOrder = apiOrders.find(
            (o) => o._id === selectedOrder._id
          );
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Build query params and fetch orders/stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const params = [];
        params.push(`page=${currentPage}`);
        // default limit
        params.push(`limit=10`);

        // map activeTab/selectedStatus to server values
        const statusForServer =
          selectedStatus ||
          (activeTab === "processing" ? "processed" : activeTab);
        if (statusForServer && statusForServer !== "all") {
          params.push(`status=${encodeURIComponent(statusForServer)}`);
        }

        if (selectedCategory) {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (selectedSubcategory) {
          params.push(`subcategory=${encodeURIComponent(selectedSubcategory)}`);
        }

        const [start, end] = dateRange || [];
        if (start && end) {
          const startIso = new Date(
            new Date(start).setHours(0, 0, 0, 0)
          ).toISOString();
          const endIso = new Date(
            new Date(end).setHours(23, 59, 59, 999)
          ).toISOString();
          params.push(`startDate=${encodeURIComponent(startIso)}`);
          params.push(`endDate=${encodeURIComponent(endIso)}`);
        }

        const queryString = `?${params.join("&")}`;

        const [ordersRes, statsRes] = await Promise.all([
          getOrders(queryString),
          getOrderStats(),
        ]);

        // ordersRes shape follows services usage in Enquiry.jsx
        const apiOrders = ordersRes?.data?.orders || ordersRes?.orders || [];
        const apiPagination = ordersRes?.data?.pagination || {};
        const apiTotalPages =
          apiPagination?.totalPages || ordersRes?.totalPages || 1;
        setOrders(apiOrders);
        setTotalPages(apiTotalPages);
        setStats(statsRes?.stats || statsRes || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedCategory, selectedSubcategory, selectedStatus, activeTab, dateRange]);

  return (
    <div className="bg-gradient-to-br from-background via-muted/30 to-brand-lighter/20 h-[calc(100dvh-64px)] overflow-hidden flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0">
        <OrdersSearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedSubcategory={selectedSubcategory}
          onSubCategoryChange={handleSubCategoryChange}
          categories={categories}
          currentSubcategories={currentSubcategories}
          onExport={handleExport}
          onCreateOrder={handleCreateOrder}
        />
      </div>

      <div className="flex flex-col flex-1 mx-6 mb-6 min-h-0">
        <div className="bg-white rounded-lg shadow-sm border flex flex-col min-h-0">
          <OrdersTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            orderCounts={orderCounts}
          />
          <div className="flex flex-col min-h-0">
            <div className="flex-1 overflow-auto">
              <OrdersTable
                orders={orders}
                onOpenOrder={openOrderDrawer}
                isLoading={isLoading}
              />
            </div>
            <OrdersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              orders={orders}
              onPageChange={handlePageChange}
              getPageNumbers={getPageNumbers}
            />
          </div>
        </div>
      </div>
      <OrdersDrawer
        open={drawerOpen}
        onClose={closeOrderDrawer}
        order={selectedOrder}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default Orders;
