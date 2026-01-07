import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Activity from "@/models/Activity";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to get params safely
async function getParams(params: any) {
  return params instanceof Promise ? await params : params;
}

// --- 1. GET (THIS WAS MISSING - IT FILLS YOUR EDIT FORM) ---
export async function GET(request: Request, { params }: { params: any }) {
  try {
    const { id } = await getParams(params);
    await connectDB();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Returns the product data (Name, Price, Stock, Image, etc.)
    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// --- 2. DELETE (Your existing working code) ---
export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await getParams(params);

    await connectDB();

    // 1. Get Product Name (for log)
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // 2. Get User (Safely)
    let displayName = session.user?.email || "Unknown";
    try {
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser?.username) displayName = dbUser.username;
    } catch (e) {
      console.log("User lookup failed, using email");
    }

    // 3. Delete
    await Product.findByIdAndDelete(id);

    // 4. Log
    try {
      await Activity.create({
        action: "DELETE",
        productName: product.name,
        details: "Removed from inventory",
        user: displayName, 
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// --- 3. PUT (Your existing working code) ---
export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await getParams(params);
    const body = await request.json(); // Takes Name, Price, Stock, ImageUrl, Description

    await connectDB();

    // Get User
    let displayName = session.user?.email || "Unknown";
    try {
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser?.username) displayName = dbUser.username;
    } catch (e) {}

    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Log
    await Activity.create({
      action: "UPDATE",
      productName: updatedProduct.name,
      // Updated this slightly to be generic since you might edit Price/Image too
      details: `Product updated. Stock: ${updatedProduct.stock}`, 
      user: displayName,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}