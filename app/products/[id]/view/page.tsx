import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { ArrowLeft, Edit, Package, ShoppingCart, Tag, BarChart, Image as ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";
// NEW: Imports for currency session
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper for currency symbols
const getSymbol = (code: string) => {
  switch (code) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "JPY": return "¥";
    default: return "$";
  }
};

export default async function ProductDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  await connectDB();
  
  // Fetch session for currency
  const session = await getServerSession(authOptions);
  const currencyCode = (session?.user as any)?.currency || "USD";
  const currencySymbol = getSymbol(currencyCode);

  const product = await Product.findById(id).lean() as any;

  if (!product) return notFound();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link href="/products" className="flex items-center text-gray-500 hover:text-gray-800 transition-all font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Catalog
        </Link>
        <Link 
          href={`/products/${product._id}`} 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Edit size={18} /> Update Info
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-gray-50/50 flex items-center justify-center p-12 lg:p-20 border-r border-gray-100">
          {product.imageUrl ? (
            <div className="relative group">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="max-h-[450px] w-auto object-contain drop-shadow-2xl rounded-2xl transform transition-transform group-hover:scale-105 duration-500" 
              />
            </div>
          ) : (
            <div className="w-80 h-80 bg-gray-200/50 rounded-3xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              <ImageIcon size={64} className="mb-4 opacity-20" />
              <p className="font-medium italic">No visual uploaded</p>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                {product.category}
              </span>
              {product.stock < 5 && (
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">
                  Low Stock
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
            <div>
              <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">MSRP / Price</p>
              {/* DYNAMIC CURRENCY APPLIED BELOW */}
              <p className="text-4xl font-black text-green-600">{currencySymbol}{product.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-black tracking-widest mb-1">Available Units</p>
              <p className={`text-4xl font-black ${product.stock < 5 ? "text-red-500" : "text-gray-900"}`}>
                {product.stock}
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tag size={14} className="text-blue-500" /> Narrative / Description
            </h3>
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg italic font-medium">
                {product.description || "The curator has not provided a description for this asset yet."}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6">
             <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart size={14} className="text-purple-500" /> Life-Cycle Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-100">
                <p className="text-blue-100 text-xs font-bold uppercase mb-1">Total Sold</p>
                <p className="text-3xl font-black">{product.sold || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl text-white shadow-lg shadow-purple-100">
                <p className="text-purple-100 text-xs font-bold uppercase mb-1">Net Revenue</p>
                {/* DYNAMIC CURRENCY APPLIED BELOW */}
                <p className="text-3xl font-black">
                  {currencySymbol}{((product.sold || 0) * product.price).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}