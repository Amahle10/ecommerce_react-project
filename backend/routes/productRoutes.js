import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// -----------------------------
// Multer Image Upload Setup
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// -------------------------------------------------------------------
// *** IMPORTANT: ADMIN ROUTES MUST COME BEFORE PUBLIC /:id ROUTES ***
// -------------------------------------------------------------------

// ==========================
// ADMIN — GET ALL PRODUCTS
// ==========================
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// ADMIN — GET SINGLE PRODUCT
// ==========================
router.get("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// CREATE product (Admin only)
// ==========================
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, stock, category, variants } = req.body;

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

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

// ==========================
// UPDATE product (Admin only)
// ==========================
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update normal fields
    product.name = req.body.name ?? product.name;

    // Update numbers safely
    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (!isNaN(price)) product.price = price;
    }

    if (req.body.stock !== undefined) {
      const stock = Number(req.body.stock);
      if (!isNaN(stock)) product.stock = stock;
    }

    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;

    if (req.body.variants) {
      product.variants = JSON.parse(req.body.variants);
    }

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// DELETE (Admin only)
// ==========================
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

// ==========================
// PUBLIC — GET ALL PRODUCTS
// ==========================
router.get("/", async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  try {
    const products = await Product.find(query);

    const publicProducts = products.map((p) => ({
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

// ==========================
// PUBLIC — GET PRODUCT BY ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const publicProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      variants: product.variants?.map((v) => ({
        name: v.name,
        inStock: v.stock > 0,
      })),
      inStock: product.stock > 0 || product.variants?.some((v) => v.stock > 0),
    };

    res.json(publicProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
