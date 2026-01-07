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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          category: data.category || "",
          stock: data.stock?.toString() || "",
          imageUrl: data.imageUrl || "",
        });

        if (data.imageUrl) setPreview(data.imageUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      router.push("/products");
      router.refresh();
    } catch (error) {
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white shadow-xl rounded-2xl mt-10">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 mb-5"><ArrowLeft size={16} /> Back</button>
      <h1 className="text-2xl font-bold mb-5 text-black">Edit Product Details</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-black font-semibold">Product Name</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full border p-2 rounded text-black bg-gray-50 focus:ring-2 focus:ring-blue-500" 
            placeholder="Type name here..."
            required 
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Price ($)</label>
          <input 
            name="price" 
            type="number"
            value={formData.price} 
            onChange={handleChange} 
            className="w-full border p-2 rounded text-black bg-gray-50" 
            required 
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Stock Quantity</label>
          <input 
            name="stock" 
            type="number"
            value={formData.stock} 
            onChange={handleChange} 
            className="w-full border p-2 rounded text-black bg-gray-50" 
            required 
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            className="w-full border p-2 rounded text-black bg-gray-50" 
            rows={3}
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
          {loading ? "Saving Changes..." : "Save All Changes"}
        </button>
      </form>
    </div>
  );
}