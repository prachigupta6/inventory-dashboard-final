import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Activity from "@/models/Activity";
import { getServerSession } from "next-auth"; // To know who sold it

export async function POST(req: Request) {
  try {
    await connectDB();
    const { productId, quantity } = await req.json();
    const session = await getServerSession();

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock!" }, { status: 400 });
    }

    // 1. Update Product
    product.stock -= quantity;
    product.sold = (product.sold || 0) + quantity;
    await product.save();

    // 2. Create Activity Log (The data for your 50 items and stacked charts)
    await Activity.create({
      action: "SALE",
      productName: product.name,
      details: `Sold ${quantity} units`,
      category: product.category,
      amount: product.price * quantity,
      user: session?.user?.name || "System",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process sale" }, { status: 500 });
  }
}