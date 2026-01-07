"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- DEBUG VERSION OF SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // DEBUG: Log keys to Console (Press F12 -> Console to view)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
      console.log("🔍 Debug - Cloud Name:", cloudName);
      console.log("🔍 Debug - Preset:", preset);

      if (!cloudName || !preset) {
        throw new Error("Missing Cloudinary Keys! Check your .env file.");
      }

      // 1. Upload Image to Cloudinary
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("upload_preset", preset); // Using the variable directly

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: imageFormData }
        );

        if (!uploadRes.ok) {
          // CAPTURE THE REAL ERROR
          const cloudError = await uploadRes.json();
          console.error("Cloudinary Error Details:", cloudError);
          throw new Error("Cloudinary Error: " + (cloudError.error?.message || JSON.stringify(cloudError)));
        }
        
        const fileData = await uploadRes.json();
        imageUrl = fileData.secure_url;
      }

      // 2. Prepare Payload
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: imageUrl,
      };

      console.log("🚀 Submitting Payload:", payload);

      // 3. Send to API
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData.error));
      }

      // Success
      router.push("/products");
      router.refresh();

    } catch (error: any) {
      // POPUP THE ERROR
      alert("⚠️ Request Failed: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back to Products
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product (Debug Mode)</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Choose Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              placeholder="e.g., Wireless Headphones"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home & Garden</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              required 
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              placeholder="Describe your product..."
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange}
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input 
                name="stock" 
                type="number" 
                value={formData.stock} 
                onChange={handleChange}
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
              {loading ? (
                <><Loader2 className="animate-spin mr-2"/> Creating...</>
              ) : (
                "Create Product"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}