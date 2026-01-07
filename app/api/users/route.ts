import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

// GET: List all admins
export async function GET() {
  try {
    await connectDB();
    //  "username" to the select list
    const users = await User.find({}).select("email username createdAt").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

// ... (Keep your existing DELETE function exactly as it is)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await request.json();

    if (session.user.email) {
       const currentUser = await User.findOne({ email: session.user.email });
       if (currentUser && currentUser._id.toString() === id) {
          return NextResponse.json({ error: "You cannot delete your own account." }, { status: 403 });
       }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "Admin removed" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}