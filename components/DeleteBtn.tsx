"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; 

export default function DeleteBtn({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product?");

    if (confirmed) {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 transition-colors">
      <Trash2 size={20} />
    </button>
  );
}