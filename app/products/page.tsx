import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ProductList from "./ProductList";

// Ensure the page is never cached statically (Always fetches fresh data)
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  
  // FETCH DATA ON SERVER (Direct DB call, no API fetch needed!)
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Convert _id objects to strings to pass to client component safely
  const serializedProducts = products.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <>
      <ProductList initialProducts={serializedProducts} />
    </>
  );
}