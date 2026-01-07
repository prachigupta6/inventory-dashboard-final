import mongoose, { Schema, model, models } from "mongoose";

const ActivitySchema = new Schema(
  {
    // Added "SALE" to the enum so the database allows sales records
    action: { 
      type: String, 
      required: true, 
      enum: ["CREATE", "UPDATE", "DELETE", "SALE"] 
    },
    productName: { type: String, required: true },
    details: { type: String, default: "" },
    user: { type: String, required: true }, 
    category: { type: String }, // Required for Stacked Charts
    amount: { type: Number },   // Required for Sales Revenue tracking
  },
  { timestamps: true }
);

const Activity = models.Activity || model("Activity", ActivitySchema);
export default Activity;