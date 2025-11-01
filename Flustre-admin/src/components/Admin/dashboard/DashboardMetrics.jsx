import React, { useEffect, useState } from "react";
import {
  adminDashdoard,
  getMonthlySalesReport,
} from "../../../sevices/adminApis";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState([
    {
      label: "Total sales (last 28 days)",
      value: "₹0",
      change: "0%",
      changeType: "positive",
      chartData: [],
    },
    {
      label: "Total orders",
      value: "0",
      change: "0%",
      changeType: "positive",
      chartData: [],
    },
    {
      label: "Total customers",
      value: "0",
      change: "0%",
      changeType: "positive",
      chartData: [],
    },
    {
      label: "Total visitors",
      value: "0",
      change: "0%",
      changeType: "positive",
      chartData: [],
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data and monthly report for charts (12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const today = new Date();

        const [dashboardRes, monthlyReportRes] = await Promise.all([
          adminDashdoard(),
          getMonthlySalesReport(
            twelveMonthsAgo.toISOString(),
            today.toISOString()
          ),
        ]);

        const dashboardData = dashboardRes?.data || dashboardRes;
        const monthlyData = monthlyReportRes?.data?.monthlySalesReport || [];

        // Process monthly data for charts (last 12 months)
        // Always ensure we have data for 12 months (JAN-DEC)
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

        // Create a map of month data
        const dataMap = new Map();
        monthlyData.forEach((item) => {
          const [year, month] = item.month.split("-");
          const monthIndex = parseInt(month) - 1;
          const key = `${year}-${month}`;
          dataMap.set(key, item);
        });

        // Get current date to determine last 12 months
        const last12MonthsData = [];
        const monthLabels = [];

        for (let i = 11; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const monthKey = `${year}-${String(month).padStart(2, "0")}`;
          const monthLabel = monthNames[date.getMonth()];

          monthLabels.push(monthLabel);

          // Get data for this month or use zero
          const monthData = dataMap.get(monthKey);
          if (monthData) {
            last12MonthsData.push(monthData);
          } else {
            // Create empty data entry for months without data
            last12MonthsData.push({
              month: monthKey,
              totalRevenueFromDeliveredOrders: 0,
              totalSalesAmount: 0,
              totalNumberOfOrders: 0,
            });
          }
        }

        // Extract sales data for chart
        const salesChartData = last12MonthsData.map(
          (item) =>
            item.totalRevenueFromDeliveredOrders || item.totalSalesAmount || 0
        );

        // Extract orders data for chart
        const ordersChartData = last12MonthsData.map(
          (item) => item.totalNumberOfOrders || 0
        );

        // Format metrics from dashboard data
        const metricsData = dashboardData.metrics || {};

        // Calculate normalized values for charts (0-100 scale)
        const normalizeChartData = (data) => {
          if (!data || data.length === 0) return Array(12).fill(30);
          const max = Math.max(...data, 1);
          return data.map((val) => (val / max) * 100);
        };

        const formattedMetrics = [
          {
            label: "Total sales (last 28 days)",
            value: `₹${(metricsData.totalSalesLast28Days || 0).toLocaleString(
              "en-IN"
            )}`,
            change: `${
              metricsData.totalSalesLast28DaysChange >= 0 ? "+" : ""
            }${(metricsData.totalSalesLast28DaysChange || 0).toFixed(1)}%`,
            changeType:
              metricsData.totalSalesLast28DaysChange >= 0
                ? "positive"
                : "negative",
            chartData: normalizeChartData(salesChartData),
            labels: monthLabels,
          },
          {
            label: "Total orders",
            value: (metricsData.totalOrdersLast28Days || 0).toLocaleString(
              "en-IN"
            ),
            change: `${metricsData.totalOrdersChange >= 0 ? "+" : ""}${(
              metricsData.totalOrdersChange || 0
            ).toFixed(1)}%`,
            changeType:
              metricsData.totalOrdersChange >= 0 ? "positive" : "negative",
            chartData: normalizeChartData(ordersChartData),
            labels: monthLabels,
          },
          {
            label: "Total customers",
            value: (metricsData.totalCustomers || 0).toLocaleString("en-IN"),
            change: `${metricsData.totalCustomersChange >= 0 ? "+" : ""}${(
              metricsData.totalCustomersChange || 0
            ).toFixed(1)}%`,
            changeType:
              metricsData.totalCustomersChange >= 0 ? "positive" : "negative",
            chartData: normalizeChartData(ordersChartData),
            labels: monthLabels,
          },
          {
            label: "Total visitors",
            value: (metricsData.totalVisitors || 0).toLocaleString("en-IN"),
            change: `${metricsData.totalVisitorsChange >= 0 ? "+" : ""}${(
              metricsData.totalVisitorsChange || 0
            ).toFixed(1)}%`,
            changeType:
              metricsData.totalVisitorsChange >= 0 ? "positive" : "negative",
            chartData: normalizeChartData(ordersChartData),
            labels: monthLabels,
          },
        ];

        setMetrics(formattedMetrics);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mini chart component
  const MiniChart = ({ chartData, labels = [] }) => {
    const defaultLabels = [
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
    // Always use all 12 months (JAN-DEC) or provided labels
    const chartLabels = labels.length >= 12 ? labels : defaultLabels;
    const dataPoints = chartLabels.length; // Always 12

    const width = 180;
    const chartHeight = 48;
    const labelAreaHeight = 14;
    const totalHeight = chartHeight + labelAreaHeight;
    const padding = 4; // Reduced padding to fit all 12 labels

    // Ensure we have 12 data points, pad if necessary
    let values;
    if (chartData.length >= 12) {
      values = chartData.slice(0, 12);
    } else if (chartData.length > 0) {
      // Pad with zeros or last value if data is shorter
      values = [...chartData, ...Array(12 - chartData.length).fill(0)];
    } else {
      // Generate default values for all 12 months
      values = Array.from({ length: 12 }).map((_, idx) => 30 + idx * 2);
    }

    const xStep = (width - padding * 2) / (dataPoints - 1);
    const yScale = (val) => {
      const minVal = 0;
      const maxVal = 100;
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      return (
        padding +
        (1 - (clamped - minVal) / (maxVal - minVal)) *
          (chartHeight - padding * 2)
      );
    };

    const points = values
      .map((val, i) => `${padding + i * xStep},${yScale(val)}`)
      .join(" ");

    return (
      <div className="h-20 w-full">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${totalHeight}`}
          preserveAspectRatio="none"
        >
          {/* baseline */}
          <line
            x1={padding}
            x2={width - padding}
            y1={chartHeight - 1}
            y2={chartHeight - 1}
            stroke="#E1E4EA"
            strokeWidth="1"
          />

          {/* optional vertical guides */}
          {chartLabels.map((_, i) => (
            <line
              key={`guide-${i}`}
              x1={padding + i * xStep}
              x2={padding + i * xStep}
              y1={padding}
              y2={chartHeight - 2}
              stroke="#2B73B8"
              strokeWidth="1"
              opacity="0.08"
              strokeDasharray="2 4"
            />
          ))}

          {/* line */}
          <polyline
            points={points}
            fill="none"
            stroke="#2B73B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* month labels */}
          {chartLabels.map((label, i) => (
            <text
              key={`label-${label}-${i}`}
              x={padding + i * xStep}
              y={totalHeight - 1}
              textAnchor="middle"
              fontSize="6"
              fill="#2B73B8"
              opacity="0.6"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-6"
            style={{
              borderRadius: "var(--radius-16, 16px)",
              border: "1px solid var(--stroke-soft-200, #E1E4EA)",
              background: "rgba(53, 115, 186, 0.02)",
              boxShadow: "0 1px 2px 0 rgba(10, 13, 20, 0.03)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {metric.value}
                </h3>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  metric.changeType === "positive"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <MiniChart chartData={metric.chartData} labels={metric.labels} />
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center py-4 text-gray-500">Loading metrics...</div>
      )}
    </div>
  );
};

export default DashboardMetrics;
