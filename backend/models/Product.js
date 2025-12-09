import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Size: M / Color: Red"
  stock: { type: Number, default: 0 },
  price: Number, // optional variant price
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
    image: { type: String },
    variants: [
      {
        name: { type: String, required: true },
        stock: { type: Number, default: 0 },
        price: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

// ✅ THIS WAS MISSING
const Product = mongoose.model("Product", productSchema);
export default Product;
