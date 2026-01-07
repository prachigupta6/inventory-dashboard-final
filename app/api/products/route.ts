import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
// import Activity from "@/models/Activity"; // Uncomment if you have this model
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod"; 

// ✅ ZOD SCHEMA
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export async function GET() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // ✅ VALIDATE WITH ZOD
    const validation = productSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Failed", details: validation.error.format() }, 
        { status: 400 }
      );
    }

    await connectDB();

    // Create using VALIDATED data
    const newProduct = await Product.create(validation.data);

    /* // Uncomment this block only if you have models/Activity.ts
    const dbUser = await User.findOne({ email: session.user?.email });
    const displayName = dbUser?.username || session.user?.email || "Unknown";
    
    await Activity.create({
      action: "CREATE",
      productName: newProduct.name,
      details: `Added new product with stock: ${newProduct.stock}`,
      user: displayName, 
    });
    */

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}