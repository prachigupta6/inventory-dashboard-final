"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Trash2, Edit, Plus, Image as ImageIcon, Search, ShoppingCart, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  imageUrl?: string;
}

const getSymbol = (code: string) => {
  switch (code) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "JPY": return "¥";
    default: return "$";
  }
};

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const currencyCode = (session?.user as any)?.currency || "USD";
  const currencySymbol = getSymbol(currencyCode);

  const handleSell = async (productId: string, productName: string) => {
    const qty = window.prompt(`How many units of "${productName}" were sold?`);
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) return;

    try {
      const res = await fetch(`/api/products/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: Number(qty) }),
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => 
          p._id === productId 
            ? { ...p, stock: p.stock - Number(qty), sold: (p.sold || 0) + Number(qty) } 
            : p
        ));
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Sale failed");
      }
    } catch (error) {
      alert("Error processing sale");
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
        router.refresh();
      }
    } catch (error) {
      alert("Error deleting product.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          <Link href="/products/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shrink-0">
              <Plus size={20} /> Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="px-4 py-4 text-center">#</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price ({currencyCode})</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center text-blue-600">Sold</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product, index) => (
              <tr key={product._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-4 text-center text-gray-400 font-mono text-sm">{index + 1}</td>
                <td className="px-6 py-4">
                  <Link href={`/products/${product._id}/view`} className="cursor-pointer">
                    <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm hover:border-blue-300 transition-all">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={32} />
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 text-lg">
                  {/* CLICKABLE NAME LINK */}
                  <Link 
                    href={`/products/${product._id}/view`} 
                    className="hover:text-blue-600 hover:underline transition-colors block"
                  >
                    {highlightText(product.name, searchTerm)}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{product.category}</span></td>
                <td className="px-6 py-4 text-green-600 font-bold text-lg">{currencySymbol}{product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock < 5 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>{product.stock}</span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">{product.sold || 0}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/* NEW VIEW ACTION */}
                  <Link href={`/products/${product._id}/view`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg inline-flex transition-colors" title="View Details">
                    <Eye size={18} />
                  </Link>
                  <button onClick={() => handleSell(product._id, product.name)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg inline-flex transition-colors" title="Sell Units"><ShoppingCart size={18} /></button>
                  <Link href={`/products/${product._id}`} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg inline-flex transition-colors" title="Edit"><Edit size={18} /></Link>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg inline-flex transition-colors" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-lg">No products match "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:underline mt-2">Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}