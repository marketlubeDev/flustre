import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardMetrics from "../../../components/Admin/dashboard/DashboardMetrics";
import {
  adminDashdoard,
  getMonthlySalesReport,
} from "../../../sevices/adminApis";
import { getOrders } from "../../../sevices/OrderApis";

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesPeriod, setSalesPeriod] = useState("Monthly");
  const [ordersPeriod, setOrdersPeriod] = useState("Monthly");
  const [topProductsPeriod, setTopProductsPeriod] = useState("This month");
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Calculate date ranges based on selected period
        const getDateRange = (period) => {
          const today = new Date();
          const endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);

          let startDate = new Date();
          if (period === "Monthly") {
            // Always fetch 12 months for monthly view
            startDate.setMonth(startDate.getMonth() - 12);
          } else if (period === "Weekly") {
            startDate.setDate(startDate.getDate() - 28);
          } else {
            startDate.setDate(startDate.getDate() - 7);
          }
          startDate.setHours(0, 0, 0, 0);

          return { startDate, endDate };
        };

        const { startDate: salesStart, endDate: salesEnd } =
          getDateRange(salesPeriod);
        const { startDate: ordersStart, endDate: ordersEnd } =
          getDateRange(ordersPeriod);

        // Fetch all data in parallel
        const [dashboardRes, salesReportRes, ordersReportRes, recentOrdersRes] =
          await Promise.all([
            adminDashdoard(),
            getMonthlySalesReport(
              salesStart.toISOString(),
              salesEnd.toISOString()
            ),
            getMonthlySalesReport(
              ordersStart.toISOString(),
              ordersEnd.toISOString()
            ),
            getOrders("?page=1&limit=5").catch((err) => {
              console.error("Error fetching recent orders:", err);
              return { orders: [] }; // Return empty orders on error
            }),
          ]);

        const dashboardData = dashboardRes?.data || dashboardRes;
        const salesReport = salesReportRes?.data?.monthlySalesReport || [];
        const ordersReport = ordersReportRes?.data?.monthlySalesReport || [];

        // Debug: Log the dashboard data structure
        console.log("Full dashboard response:", dashboardRes);
        console.log("Dashboard data object:", dashboardData);
        console.log("Top products from backend:", dashboardData.topProducts);

        // Helper function to process chart data for all 12 months
        const processChartData = (reportData, isMonthly, isOrders = false) => {
          if (!isMonthly) {
            // For Weekly/Daily, just show the available data
            return reportData.map((item) => {
              const [year, month] = item.month.split("-");
              const date = new Date(year, parseInt(month) - 1);
              return {
                name: date.toLocaleString("en-US", { month: "short" }),
                value: isOrders
                  ? item.totalNumberOfOrders || 0
                  : item.totalRevenueFromDeliveredOrders ||
                    item.totalSalesAmount ||
                    0,
              };
            });
          }

          // For Monthly, always show all 12 months (JAN-DEC)
          const monthNames = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ];

          // Create a map of existing data
          const dataMap = new Map();
          reportData.forEach((item) => {
            const [year, month] = item.month.split("-");
            const key = `${year}-${month}`;
            dataMap.set(key, item);
          });

          // Get current date to determine last 12 months
          const today = new Date();
          const processedData = [];

          for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthKey = `${year}-${String(month).padStart(2, "0")}`;
            const monthLabel = monthNames[date.getMonth()];

            const monthData = dataMap.get(monthKey);
            processedData.push({
              name: monthLabel,
              value: monthData
                ? isOrders
                  ? monthData.totalNumberOfOrders || 0
                  : monthData.totalRevenueFromDeliveredOrders ||
                    monthData.totalSalesAmount ||
                    0
                : 0,
            });
          }

          return processedData;
        };

        // Process sales data for chart (all 12 months for Monthly view)
        const processedSalesData = processChartData(
          salesReport,
          salesPeriod === "Monthly",
          false
        );

        // Process orders data for chart (all 12 months for Monthly view)
        const processedOrdersData = processChartData(
          ordersReport,
          ordersPeriod === "Monthly",
          true
        );

        // Process recent orders
        // The getOrders API returns res.data which should be { orders, totalOrders, totalPages }
        // Handle different response structures - getOrders already returns res.data
        let orders = [];
        if (recentOrdersRes) {
          // getOrders returns res.data, so recentOrdersRes is already the response object
          if (Array.isArray(recentOrdersRes)) {
            orders = recentOrdersRes;
          } else if (
            recentOrdersRes.orders &&
            Array.isArray(recentOrdersRes.orders)
          ) {
            orders = recentOrdersRes.orders;
          } else if (
            recentOrdersRes.data?.orders &&
            Array.isArray(recentOrdersRes.data.orders)
          ) {
            orders = recentOrdersRes.data.orders;
          }
        }

        console.log("Recent orders response:", recentOrdersRes);
        console.log("Extracted orders:", orders);

        // Sort orders by creation date (newest first) and take only the last 5
        const sortedOrders = orders
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA; // Newest first
          })
          .slice(0, 5); // Take only the last 5 orders

        console.log("Sorted and limited orders:", sortedOrders);

        const formattedRecentOrders = sortedOrders.map((order) => {
          const product = order.products?.[0];
          const productName =
            product?.productId?.name || product?.product?.name || "Product";
          const variantTitle = product?.variantId?.attributes?.title;
          const fullProductName = variantTitle
            ? `${productName} - ${variantTitle}`
            : productName;

          const orderDate = new Date(order.createdAt);
          const formattedDate = orderDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return {
            id: `#${order._id?.toString().slice(-6) || order._id || "N/A"}`,
            customer:
              order.user?.username || order.userId?.username || "Customer",
            product: fullProductName,
            date: formattedDate,
            status: order.status || "pending",
            amount: `₹${order.totalAmount?.toLocaleString("en-IN") || 0}`,
          };
        });

        // Process top products from dashboard data
        // The backend returns topProducts with: name, price, totalOrdered, orderCount
        const topProductsData = dashboardData.topProducts || [];
        console.log("Raw top products data:", topProductsData);
        console.log("Top products array length:", topProductsData.length);

        // Process top products - show ALL products from backend, NO filtering
        const formattedTopProducts = (
          Array.isArray(topProductsData) ? topProductsData : []
        ).map((product, idx) => {
          // Handle different field names from backend
          // Backend returns: name (from displayName), price (from displayPrice), totalOrdered, orderCount
          const productName =
            product.name || product.displayName || `Product ${idx + 1}`;
          const productPrice = Number(
            product.price || product.displayPrice || 0
          );
          const totalQuantity = Number(product.totalOrdered || 0);
          const orderCount = Number(product.orderCount || 0);

          // Calculate total sales: totalOrdered (quantity) * price
          const totalRevenue = totalQuantity * productPrice;

          console.log(`Processing product ${idx + 1}:`, {
            original: product,
            name: productName,
            price: productPrice,
            totalOrdered: totalQuantity,
            orderCount,
            totalRevenue,
          });

          // Always show product, even with 0 sales - remove all filters
          return {
            name: productName,
            brand: productName?.split(" ")[0] || productName || "Brand",
            sales:
              totalRevenue > 0
                ? `₹${totalRevenue.toLocaleString("en-IN")}`
                : `₹0`, // Always show ₹0 instead of "-"
            orderCount: orderCount || totalQuantity || 0,
          };
        });

        // NO FILTERING - show all products that backend returns

        console.log("Formatted top products:", formattedTopProducts);
        console.log(
          "Formatted top products length:",
          formattedTopProducts.length
        );

        // If no formatted products but we have raw data, log details for debugging
        if (formattedTopProducts.length === 0 && topProductsData.length > 0) {
          console.warn(
            "Top products were filtered out. Raw data:",
            topProductsData
          );
        }

        // Debug logging
        console.log("Dashboard data:", dashboardData);
        console.log("Recent orders response:", recentOrdersRes);
        console.log("Formatted recent orders:", formattedRecentOrders);
        console.log("Top products data:", topProductsData);
        console.log("Formatted top products:", formattedTopProducts);

        setSalesData(processedSalesData);
        setOrdersData(processedOrdersData);
        setRecentOrders(formattedRecentOrders);
        setTopProducts(formattedTopProducts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [salesPeriod, ordersPeriod]);

  return (
    <div className="min-h-screen bg-white p-6 pb-12">
      {/* Metrics Cards */}
      <DashboardMetrics />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Sales Performance
              </h3>
              <p className="text-sm text-gray-600">
                Check out each column for more details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={salesPeriod}
                onChange={(e) => setSalesPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Loading chart data...
              </div>
            ) : salesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No sales data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Bar dataKey="value" fill="#3573BA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#3573BA" }}
            ></div>
            <span className="text-sm text-gray-600">Sales</span>
            <div className="w-3 h-3 bg-gray-300 rounded-full ml-4"></div>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Orders Trend
              </h3>
              <p className="text-sm text-gray-600">
                Track orders and profits over time period
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={ordersPeriod}
                onChange={(e) => setOrdersPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Loading chart data...
              </div>
            ) : ordersData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                No orders data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3573BA"
                    strokeWidth={3}
                    dot={{ fill: "#3573BA", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Recent orders
              </h3>
              <p className="text-sm text-gray-600">
                Keep track of vendors and their order status
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/order")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Product name
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {order.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.customer}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.product}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "pending" ||
                            order.status === "processed"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {order.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Top Selling Products
              </h3>
              <p className="text-sm text-gray-600">
                Keep track of top selling products among all orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={topProductsPeriod}
                onChange={(e) => setTopProductsPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
              >
                <option>This month</option>
                <option>This week</option>
                <option>Today</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                Loading products...
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No top products found
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {product.sales}
                    </p>
                    <p className="text-xs text-gray-500">Sales</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
