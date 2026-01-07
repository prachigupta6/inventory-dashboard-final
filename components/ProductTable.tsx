"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteBtn from "@/components/DeleteBtn";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string; // Added this back
}

export default function ProductTable({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Highlights text matching the search term
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      
      {/* Search Bar */}
      <div className="p-4 border-b bg-gray-50">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No products found matching "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">
                    {highlightMatch(product.name, searchTerm)}
                  </td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4 font-semibold text-green-600">${product.price}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock} items
                    </span>
                  </td>
                  <td className="p-4 flex gap-4 items-center">
                    {/* Link to the Edit Page we will build next */}
                    <Link
                      href={`/products/edit/${product._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    
                    {/* Delete Button Component */}
                    <DeleteBtn id={product._id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}