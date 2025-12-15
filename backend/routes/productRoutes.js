import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ADMIN - GET ALL PRODUCTS
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN - CREATE PRODUCT
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  const { name, price, description, stock, category, variants } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      variants: variants ? JSON.parse(variants) : [],
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUBLIC - GET ALL
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// PUBLIC - GET SINGLE
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

export default router;
