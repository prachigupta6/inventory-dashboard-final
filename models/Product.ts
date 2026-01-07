import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false }, 
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 }, // Tracks total units sold
    imageUrl: { type: String }, 
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;