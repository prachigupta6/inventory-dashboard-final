import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// forces fresh data every time (fixes the sticking USD bug)
export const dynamic = "force-dynamic";

// GET: Get your current username AND currency
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user?.email });
  
  return NextResponse.json({ 
    username: user?.username || "",
    currency: user?.currency || "USD" 
  });
}

// PUT: Save new username & currency
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, currency } = await request.json();

  // 1. Validate Username Format
  if (!username || username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }

  await connectDB();

  // 2. Check if username is taken
  const existingUser = await User.findOne({ username });
  if (existingUser && existingUser.email !== session.user?.email) {
    return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
  }

  // 3. Save both Username and Currency
  await User.findOneAndUpdate(
    { email: session.user?.email }, 
    { username, currency }
  );

  return NextResponse.json({ message: "Updated successfully" });
}