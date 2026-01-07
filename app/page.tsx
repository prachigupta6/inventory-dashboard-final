export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Activity from "@/models/Activity";
import DashboardChart from "@/components/DashboardChart";
import { Package, DollarSign, AlertTriangle, Activity as ActivityIcon, TrendingUp } from "lucide-react";

// ✅ FIXED IMPORT: Point to the library, not the route handler
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const getSymbol = (code: string) => {
  switch (code) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "JPY": return "¥";
    default: return "$";
  }
};

export default async function Home() {
  await connectDB();
  
  // Fetch session and identify currency
  const session = await getServerSession(authOptions);
  const currencyCode = (session?.user as any)?.currency || "USD";
  const currencySymbol = getSymbol(currencyCode);

  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(100).lean();

  const formatToMonth = (dateObj: Date) => 
    new Date(dateObj).toLocaleString('default', { month: 'short', year: '2-digit' });

  // ... (Your existing data processing logic remains exactly the same)
  const salesByMonth: Record<string, number> = {};
  activities.filter(a => a.action === "SALE").forEach((act: any) => {
    const month = formatToMonth(act.createdAt);
    salesByMonth[month] = (salesByMonth[month] || 0) + (act.amount || 0);
  });
  const salesOverTime = Object.entries(salesByMonth).map(([name, sales]) => ({ name, sales }));

  const catCounts: Record<string, number> = {};
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  const productsByCategory = Object.entries(catCounts).map(([name, count]) => ({ name, count }));

  const stockStatus = [
    { name: "In Stock", value: products.filter(p => p.stock >= 5).length, color: "#22c55e" },
    { name: "Low Stock", value: products.filter(p => p.stock < 5 && p.stock > 0).length, color: "#f59e0b" },
    { name: "Out of Stock", value: products.filter(p => p.stock === 0).length, color: "#ef4444" },
  ];

  const topSelling = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5)
    .map(p => ({ name: p.name.substring(0, 12), sold: p.sold || 0 }));

  const revByCat: Record<string, number> = {};
  activities.filter(a => a.action === "SALE").forEach((act: any) => {
    revByCat[act.category || "General"] = (revByCat[act.category || "General"] || 0) + (act.amount || 0);
  });
  const revenueByCategory = Object.entries(revByCat).map(([name, revenue]) => ({ name, revenue }));

  const stockVsSales = products.slice(0, 8).map(p => ({
    name: p.name.substring(0, 10),
    remaining: p.stock,
    sold: p.sold || 0
  }));

  const addsByMonth: Record<string, number> = {};
  activities.filter(a => a.action === "CREATE").forEach((act: any) => {
    const month = formatToMonth(act.createdAt);
    addsByMonth[month] = (addsByMonth[month] || 0) + 1;
  });
  const additionsOverTime = Object.entries(addsByMonth).map(([month, count]) => ({ month, count }));

  const lowStockByMonth: Record<string, number> = {};
  products.filter(p => p.stock < 5).forEach(p => {
    const month = formatToMonth(p.createdAt as any);
    lowStockByMonth[month] = (lowStockByMonth[month] || 0) + 1;
  });
  const lowStockData = Object.entries(lowStockByMonth).map(([month, count]) => ({ month, count }));

  const totalProducts = products.length;
  const totalValue = products.reduce((acc, product) => acc + (product.price * product.stock), 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const totalSalesRevenue = activities.filter((a: any) => a.action === "SALE").reduce((acc, curr: any) => acc + (curr.amount || 0), 0);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advanced Inventory Analytics</h1>
        <p className="text-gray-500">Real-time performance metrics with monthly trend analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package size={28} /></div>
          <div><p className="text-sm font-medium text-gray-600">Total Products</p><h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={28} /></div>
          <div><p className="text-sm font-medium text-gray-600">Inventory Value</p><h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{totalValue.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp size={28} /></div>
          <div><p className="text-sm font-medium text-gray-600">Total Sales</p><h3 className="text-2xl font-bold text-purple-600">{currencySymbol}{totalSalesRevenue.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${lowStockCount > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}><AlertTriangle size={28} /></div>
          <div><p className="text-sm font-medium text-gray-600">Low Stock Items</p><h3 className="text-2xl font-bold text-gray-900">{lowStockCount}</h3></div>
        </div>
      </div>

      <DashboardChart 
        salesOverTime={salesOverTime}
        productsByCategory={productsByCategory}
        stockStatus={stockStatus}
        topSelling={topSelling}
        revenueByCategory={revenueByCategory}
        stockVsSales={stockVsSales}
        additionsOverTime={additionsOverTime}
        lowStockData={lowStockData}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[500px] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white pb-2 z-10 border-b">
          <ActivityIcon className="text-blue-500" />
          <h3 className="text-lg font-bold text-gray-700">Detailed Audit Log (Last 50)</h3>
        </div>
        <ul className="space-y-4">
          {activities.map((log: any) => (
            <li key={log._id} className="flex flex-col border-b border-gray-100 pb-2 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.action === "CREATE" ? "bg-green-100 text-green-700" : log.action === "DELETE" ? "bg-red-100 text-red-700" : log.action === "SALE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{log.action}</span>
                <span className="text-xs text-gray-400">{formatTime(log.createdAt)}</span>
              </div>
              <div className="mt-1">
                <span className="font-medium text-gray-800">{log.productName} {log.action === "SALE" && <span className="text-purple-600 ml-1">({currencySymbol}{log.amount})</span>}</span>
                <p className="text-xs text-gray-500 truncate">{log.details}</p>
                <p className="text-xs text-blue-600 font-bold mt-1">By {log.user || "Unknown"}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
//forcing update