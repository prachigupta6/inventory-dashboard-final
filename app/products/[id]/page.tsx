"use client";

import { useState, useEffect, use } from "react"; // 1. Added 'use'
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react"; 

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) { // 2. Fixed Type
  const router = useRouter();
  const resolvedParams = use(params); // 3. Unwrap the ID so it actually exists
  const id = resolvedParams?.id;

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Electronics", 
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        // Look for data in either data.product or data directly
        const product = data.product || data; 

        if (product) {
          setFormData({
            name: product.name || "",
            price: product.price?.toString() || "", // Convert to string for input
            stock: product.stock?.toString() || "", // Convert to string for input
            category: product.category || "Electronics",
            description: product.description || "",
            imageUrl: product.imageUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to load product", error);
      }
    };
    if (id) getProduct();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Photo is too large. Please select an image under 5MB.");
      return;
    }

    setImageUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");
    const cloudName = "dva3r9you";         

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: fileData.secure_url }));
      }
    } catch (error) {
      alert("Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        }),
      });

      if (response.ok) {
        router.push("/products");
        router.refresh();
      } else {
        alert("Failed to update.");
      }
    } catch (error) {
      alert("Error updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-20">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg text-gray-700">
        <div className="mb-6">
          <label className="block font-bold mb-2">Product Image</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-300" size={24} />
              )}
            </div>
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageUploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Product Name</label>
          <input 
            type="text" name="name" 
            value={formData.name} onChange={handleChange} 
            className="w-full border border-gray-300 p-2 rounded text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-bold mb-2">Price ($)</label>
            <input 
              type="number" name="price" step="0.01" 
              value={formData.price} onChange={handleChange} 
              className="w-full border border-gray-300 p-2 rounded text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Stock</label>
            <input 
              type="number" name="stock" 
              value={formData.stock} onChange={handleChange} 
              className="w-full border border-gray-300 p-2 rounded text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Category</label>
          <select 
            name="category" 
            value={formData.category} onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-black bg-white"
          >
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Home</option>
            <option>Beauty</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Description</label>
          <textarea 
            name="description" 
            value={formData.description} onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-black bg-white h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        
        <div className="flex justify-between mt-6">
           <Link href="/products" className="text-gray-500 hover:text-gray-700 py-2">Cancel</Link>
           <button 
             type="submit" 
             disabled={loading || imageUploading}
             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold disabled:bg-gray-400"
           >
             {loading ? "Updating..." : "Update Product"}
           </button>
        </div>
      </form>
    </div>
  );
}