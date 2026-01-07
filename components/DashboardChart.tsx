"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

interface AnalyticsProps {
  salesOverTime: any[];
  productsByCategory: any[];
  stockStatus: any[];
  topSelling: any[];
  revenueByCategory: any[];
  stockVsSales: any[];
  additionsOverTime: any[];
  lowStockData: any[];
}

export default function DashboardChart(props: AnalyticsProps) {
  const chartClass = "bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[350px]";
  const titleClass = "text-sm font-bold text-gray-500 uppercase tracking-wider mb-4";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* 1. Monthly Sales Over Time */}
      <div className={chartClass}>
        <h3 className={titleClass}>Monthly Sales Revenue</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={props.salesOverTime}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Products by Category */}
      <div className={chartClass}>
        <h3 className={titleClass}>Catalog Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={props.productsByCategory}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Stock Status Overview */}
      <div className={chartClass}>
        <h3 className={titleClass}>Inventory Health</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={props.stockStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {props.stockStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Top Selling Products */}
      <div className={chartClass}>
        <h3 className={titleClass}>Top 5 Best Sellers (Units)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={props.topSelling} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="sold" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Revenue by Category */}
      <div className={chartClass}>
        <h3 className={titleClass}>Revenue by Category</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={props.revenueByCategory}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 6. Stock vs Sales */}
      <div className={chartClass}>
        <h3 className={titleClass}>Stock vs Sales Comparison</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={props.stockVsSales}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="remaining" fill="#3b82f6" name="Stock" />
            <Bar yAxisId="right" dataKey="sold" fill="#f59e0b" name="Sold" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 7. Catalog Growth (Monthly) */}
      <div className={chartClass}>
        <h3 className={titleClass}>Monthly Catalog Growth</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={props.additionsOverTime}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Line type="stepAfter" dataKey="count" stroke="#ec4899" strokeWidth={2} name="New Products" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 8. Low Stock Trend (Monthly) */}
      <div className={chartClass}>
        <h3 className={titleClass}>Monthly Low-Stock Risk</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={props.lowStockData}>
            <defs>
              <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#ef4444" fillOpacity={1} fill="url(#colorLow)" name="Risk Count" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}