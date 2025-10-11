import React from 'react';

const DashboardMetrics = () => {
  // Mini chart component
  const MiniChart = () => {
    const labels = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
    const dataPoints = labels.length;

    const width = 180;
    const chartHeight = 48;
    const labelAreaHeight = 14;
    const totalHeight = chartHeight + labelAreaHeight;
    const padding = 6;

    // Generate gently increasing values to resemble trend
    const values = Array.from({ length: dataPoints }).map((_, idx) => 30 + idx * 8 + Math.random() * 6);

    const xStep = (width - padding * 2) / (dataPoints - 1);
    const yScale = (val) => {
      const minVal = 0;
      const maxVal = 100;
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      return padding + (1 - (clamped - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);
    };

    const points = values
      .map((val, i) => `${padding + i * xStep},${yScale(val)}`)
      .join(' ');

    return (
      <div className="h-20 w-full">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${totalHeight}`} preserveAspectRatio="none">
          {/* baseline */}
          <line x1={padding} x2={width - padding} y1={chartHeight - 1} y2={chartHeight - 1} stroke="#E1E4EA" strokeWidth="1" />

          {/* optional vertical guides */}
          {labels.map((_, i) => (
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
          {labels.map((label, i) => (
            <text
              key={`label-${label}`}
              x={padding + i * xStep}
              y={totalHeight - 2}
              textAnchor="middle"
              fontSize="8"
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

  const metrics = [
    {
      label: "Total sales (last 28 days)",
      value: "₹4,25,000",
      change: "+2%",
      changeType: "positive",
      chartColor: "bg-blue-200"
    },
    {
      label: "Total orders",
      value: "₹1,10,000", 
      change: "-3%",
      changeType: "negative",
      chartColor: "bg-red-200"
    },
    {
      label: "Total customers",
      value: "1,260",
      change: "+7%", 
      changeType: "positive",
      chartColor: "bg-blue-200"
    },
    {
      label: "Total visitors",
      value: "22,500",
      change: "+12%",
      changeType: "positive", 
      chartColor: "bg-red-200"
    }
  ];

  return (
    <div className="p-6" style={{backgroundColor: '#ffffff'}}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="p-6"
            style={{
              borderRadius: 'var(--radius-16, 16px)',
              border: '1px solid var(--stroke-soft-200, #E1E4EA)',
              background: 'rgba(109, 13, 38, 0.02)',
              boxShadow: '0 1px 2px 0 rgba(10, 13, 20, 0.03)'
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
              </div>
              <span 
                className={`text-xs px-2 py-1 rounded ${
                  metric.changeType === 'positive' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <MiniChart />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMetrics; 