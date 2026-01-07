"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";

// 1. Define my new detailed categories here
const CATEGORIES = [
  "Electronics",
  "Clothing & Apparel",
  "Footwear",
  "Food & Beverages",
  "Home & Furniture",
  "Beauty & Personal Care",
  "Accessories",
  "Sports & Fitness",
  "Books & Stationery",
  "Toys & Games",
  "Health & Wellness",
  "Automotive & Tools",
  "Pet Supplies",
  "Miscellaneous",
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0], // Default to first category
    price: "",
    stock: "",
    description: "",
    imageUrl: "", 
  });

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //  SAFETY CHECK: 5MB LIMIT
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo is too large. Please select an image under 5MB.");
      return;
    }

    setImageUploading(true);
    const data = new FormData();
    data.append("file", file);
    
    //  MY CLOUDINARY DETAILS 
    const uploadPreset = "ml_default"; 
    const cloudName = "dva3r9you"; 
    // ----------------------- 

    data.append("upload_preset", uploadPreset);

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
      console.error("Upload error:", error);
      alert("Image upload failed. Check your Cloudinary settings.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/products"); 
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create product");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/products" className="flex items-center text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back to Products
      </Link>

      <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* IMAGE UPLOAD SECTION */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              {/* Preview Box */}
              <div className="w-24 h-24 border rounded flex items-center justify-center bg-gray-50 overflow-hidden relative">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-300" size={32} />
                )}
              </div>
              
              {/* Upload Button */}
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageUploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                {!imageUploading && formData.imageUrl && <p className="text-xs text-green-600 mt-1">Image uploaded!</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              type="text" 
              required
              className="w-full border p-2 rounded text-black"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price </label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full border p-2 rounded text-black"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input 
                type="number" 
                required
                min="0"
                className="w-full border p-2 rounded text-black"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border p-2 rounded text-black"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required
              className="w-full border p-2 rounded text-black h-24"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || imageUploading}
            className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2 mt-4 disabled:bg-gray-400"
          >
            <Save size={20} /> {loading ? "Saving..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}