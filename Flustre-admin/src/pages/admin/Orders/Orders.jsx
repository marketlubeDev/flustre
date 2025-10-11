import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrdersSearchFilters from "./Components/OrdersSearchFilters";
import OrdersTabs from "./Components/OrdersTabs";
import OrdersTable from "./Components/OrdersTable";
import OrdersDrawer from "./Components/OrdersDrawer";
import OrdersPagination from "./Components/OrdersPagination";
import { getOrders, getOrderStats } from "@/sevices/OrderApis";

// Mock data
const mockOrders = [
  {
    _id: "66f8b2c4d1a2b3e4f5g6h7i8",
    products: [
      {
        _id: "p1",
        productId: {
          name: "Premium Wireless Headphones",
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
          ],
        },
        quantity: 2,
        price: 2999,
      },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    deliveryAddress: {
      fullName: "John Doe",
      phoneNumber: "+91 9876543210",
      building: "A-101, Royal Apartments",
      street: "MG Road",
      landmark: "Near Metro Station",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    totalAmount: 6498,
    paymentStatus: "paid",
    status: "delivered",
  },
  {
    _id: "77g9c3d5e2b4f6h8i9j0k1l2",
    products: [
      {
        _id: "p2",
        productId: {
          name: "Smartphone Case with Stand",
          images: [
            "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop",
          ],
        },
        quantity: 1,
        price: 1299,
      },
    ],
    createdAt: "2024-01-14T15:45:00Z",
    deliveryAddress: {
      fullName: "Jane Smith",
      phoneNumber: "+91 8765432109",
      building: "B-205, Green Valley",
      street: "Whitefield Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
    },
    totalAmount: 1299,
    paymentStatus: "pending",
    status: "processing",
  },
  {
    _id: "88h0d4e6f3c5g7i9j1k2l3m4",
    products: [
      {
        _id: "p3",
        productId: {
          name: "Bluetooth Gaming Mouse",
          images: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
          ],
        },
        quantity: 3,
        price: 899,
      },
    ],
    createdAt: "2024-01-13T09:15:00Z",
    deliveryAddress: {
      fullName: "Mike Johnson",
      phoneNumber: "+91 7654321098",
      building: "C-302, Tech Park",
      street: "Electronic City",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560100",
    },
    totalAmount: 2697,
    paymentStatus: "paid",
    status: "shipped",
  },
  {
    _id: "99i1e5f7g4d6h8j0k2l3m4n5",
    products: [
      {
        _id: "p4",
        productId: {
          name: "Wireless Mechanical Keyboard",
          images: [
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
          ],
        },
        quantity: 1,
        price: 4599,
      },
    ],
    createdAt: "2024-01-12T14:20:00Z",
    deliveryAddress: {
      fullName: "Sarah Wilson",
      phoneNumber: "+91 6543210987",
      building: "D-401, Sunrise Heights",
      street: "Koramangala 5th Block",
      landmark: "Near Forum Mall",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560095",
    },
    totalAmount: 4599,
    paymentStatus: "paid",
    status: "delivered",
  },
  {
    _id: "00j2f6g8h5e7i9k1l3m4n5o6",
    products: [
      {
        _id: "p5",
        productId: {
          name: "Smart Fitness Watch",
          images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
          ],
        },
        quantity: 2,
        price: 12999,
      },
    ],
    createdAt: "2024-01-11T11:30:00Z",
    deliveryAddress: {
      fullName: "David Brown",
      phoneNumber: "+91 5432109876",
      building: "E-102, Lake View Apartments",
      street: "Ulsoor Lake Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560008",
    },
    totalAmount: 25998,
    paymentStatus: "pending",
    status: "processing",
  },
];

const orderStats = {
  statusCounts: {
    pending: 12,
    processed: 8,
    shipped: 15,
    delivered: 25,
    cancelled: 3,
    onrefund: 2,
    refunded: 5,
  },
};

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
    console.log("Export CSV clicked");
  };

  const handleCreateOrder = () => {
    // TODO: Implement create order functionality
    console.log("Create order clicked");
  };

  // Mock categories and subcategories data
  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "books", name: "Books" },
    { id: "home", name: "Home & Garden" },
    { id: "sports", name: "Sports" },
  ];

  const subcategories = {
    electronics: [
      { id: "smartphones", name: "Smartphones" },
      { id: "laptops", name: "Laptops" },
      { id: "headphones", name: "Headphones" },
      { id: "cameras", name: "Cameras" },
    ],
    clothing: [
      { id: "mens", name: "Men's Clothing" },
      { id: "womens", name: "Women's Clothing" },
      { id: "kids", name: "Kids Clothing" },
      { id: "accessories", name: "Accessories" },
    ],
    books: [
      { id: "fiction", name: "Fiction" },
      { id: "non-fiction", name: "Non-Fiction" },
      { id: "educational", name: "Educational" },
      { id: "children", name: "Children's Books" },
    ],
    home: [
      { id: "furniture", name: "Furniture" },
      { id: "decor", name: "Home Decor" },
      { id: "kitchen", name: "Kitchen & Dining" },
      { id: "garden", name: "Garden Tools" },
    ],
    sports: [
      { id: "fitness", name: "Fitness Equipment" },
      { id: "outdoor", name: "Outdoor Gear" },
      { id: "team-sports", name: "Team Sports" },
      { id: "water-sports", name: "Water Sports" },
    ],
  };

  // Get current subcategories based on selected category
  const currentSubcategories = selectedCategory
    ? subcategories[selectedCategory] || []
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
  }, [currentPage, selectedCategory, selectedStatus, activeTab, dateRange]);

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
