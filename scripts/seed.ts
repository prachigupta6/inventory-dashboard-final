const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" }); 

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to Database.");

    // Check if admin already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("⚠️ Admin already exists. No changes made.");
      process.exit();
    }

    // Create the Master Admin
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("🎉 Success! Created initial user: admin@example.com / password123");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();