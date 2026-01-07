"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // Simple, separate state variables to avoid bugs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

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
      let imageUrl = "";

      // 1. Upload Image to Cloudinary
      if (imageFile) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("upload_preset", uploadPreset!);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: uploadData }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const fileData = await uploadRes.json();
        imageUrl = fileData.secure_url;
      }

      // 2. Prepare Data
      const payload = {
        name: name,
        description: description,
        category: category,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl,
      };

      // 3. Send to API
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }

      // Success!
      router.push("/products");
      router.refresh();

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">MY TEST PAGE (V3)</h1>
        {/*<h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h1>*/}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded text-black" 
              placeholder="Product Name" 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded bg-white text-black"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded text-black" 
              rows={3} 
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input 
                type="number" required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded text-black" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input 
                type="number" required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border p-2 rounded text-black" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            {loading ? "Saving..." : "Create Product"}
          </button>

        </form>
      </div>
    </div>
  );
}