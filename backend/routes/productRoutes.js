import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create product (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, price, description, stock } = req.body;
  const product = await Product.create({ name, price, description, stock });
  res.status(201).json(product);
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
