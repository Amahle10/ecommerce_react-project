import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ADMIN - all products
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN - single product
router.get("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN - create
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock, category, variants } = req.body;
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

// ADMIN - update
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name ?? product.name;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;
    if (req.body.variants) product.variants = JSON.parse(req.body.variants);
    if (req.file) product.image = `/uploads/${req.file.filename}`;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN - delete
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUBLIC - all products
router.get("/", async (req, res) => {
  const { search, category } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  try {
    const products = await Product.find(query);
    const publicProducts = products.map(p => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      inStock: p.stock > 0 || p.variants?.some(v => v.stock > 0),
    }));
    res.json(publicProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUBLIC - single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      variants: product.variants?.map(v => ({ name: v.name, inStock: v.stock > 0 })),
      inStock: product.stock > 0 || product.variants?.some(v => v.stock > 0),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
