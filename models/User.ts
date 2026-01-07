import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String }, // Already added
    currency: { type: String, default: "USD" }, // 👈 ADD THIS LINE
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;