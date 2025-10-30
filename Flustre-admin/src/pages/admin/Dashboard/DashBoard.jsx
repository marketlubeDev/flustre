import React, { useState } from "react";
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
import DashboardMetrics from "../../../components/Admin/dashboard/DashboardMetrics";

const Dashboard = () => {
  const [salesPeriod, setSalesPeriod] = useState("Monthly");
  const [ordersPeriod, setOrdersPeriod] = useState("Monthly");
  const [topProductsPeriod, setTopProductsPeriod] = useState("This month");

  // Sample data for charts
  const salesData = [
    { name: "Feb", value: 45 },
    { name: "Mar", value: 95 },
    { name: "Apr", value: 85 },
    { name: "May", value: 98 },
    { name: "Jun", value: 75 },
    { name: "Jul", value: 65 },
  ];

  const ordersData = [
    { name: "Jan", value: 350 },
    { name: "Feb", value: 380 },
    { name: "Mar", value: 420 },
    { name: "Apr", value: 450 },
    { name: "May", value: 480 },
    { name: "Jun", value: 510 },
    { name: "Jul", value: 490 },
  ];

  const recentOrders = [
    {
      id: "#401222",
      customer: "Lindsey Straker",
      product: "iPhone 12 Pro Max - Natural Titanium",
      date: "16/10/2025",
      status: "Processing",
      amount: "₹789",
    },
    {
      id: "#401233",
      customer: "Lindsey Straker",
      product: "L'Oreal Paris Shampoo",
      date: "05/10/2025",
      status: "Shipped",
      amount: "₹1,299",
    },
  ];

  const topProducts = [
    {
      name: "iPhone 12 Pro Max - Natural Titanium",
      brand: "iPhone",
      sales: "₹92,913",
    },
    {
      name: "L'Oreal Paris Revitalift",
      brand: "L'Oreal",
      sales: "₹12,398",
    },
    {
      name: "Flat Pedestal Cake",
      brand: "Bakers",
      sales: "-",
    },
  ];

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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#3573BA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            <button className="text-sm text-blue-600 hover:text-blue-700">
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
                {recentOrders.map((order, index) => (
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
                        <p className="text-sm text-gray-500">{order.product}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">{order.date}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {order.amount}
                    </td>
                  </tr>
                ))}
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
            {topProducts.map((product, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
