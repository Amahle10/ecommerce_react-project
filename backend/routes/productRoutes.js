import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Create product (admin only)
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  const { name, price, description, stock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await Product.create({
    name,
    price,
    description,
    stock,
    category,
    image,
  });

  res.status(201).json(product);
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
// DELETE product (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optionally: delete image file from server
    // fs.unlinkSync(`./uploads/${product.image}`); // if you want

    await product.deleteOne(); // delete from DB
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product (admin only)
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, description, stock, category } = req.body;

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;

    // If new image uploaded, replace old
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
      // optionally delete old image from disk here
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
