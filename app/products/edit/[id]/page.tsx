"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        
        const data = await res.json();
        
        // FIX: Ensuring all values are strings prevents the "Locked/No Cursor" bug
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ? data.price.toString() : "",
          category: data.category || "",
          stock: data.stock ? data.stock.toString() : "",
          imageUrl: data.imageUrl || "",
        });

        if (data.imageUrl) setPreview(data.imageUrl);
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Error loading product data");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "ml_default");
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: imageFormData }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const fileData = await uploadRes.json();
        finalImageUrl = fileData.secure_url;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: finalImageUrl,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      router.push("/products");
      router.refresh();

    } catch (error: any) {
      alert("Update Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-black mb-6">
        <ArrowLeft size={20} className="mr-2" /> Cancel Edit
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Edit Product Details</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Product Image</label>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
              </div>
              <label className="cursor-pointer bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Product Name</label>
            <input 
              name="name" 
              type="text"
              value={formData.name} 
              onChange={handleChange}
              required 
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home & Garden</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              required 
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Price ($)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01"
                value={formData.price} 
                onChange={handleChange}
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Stock</label>
              <input 
                name="stock" 
                type="number" 
                value={formData.stock} 
                onChange={handleChange}
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-all disabled:opacity-50 shadow-md">
              {loading ? (
                <><Loader2 className="animate-spin mr-2"/> Updating Database...</>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}