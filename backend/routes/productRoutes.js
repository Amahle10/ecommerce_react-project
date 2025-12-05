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

export default router;
