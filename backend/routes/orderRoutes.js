import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// Get my orders (SAFE)
router.get("/myorders", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user._id }).lean();

    res.json(orders || []);
  } catch (err) {
    console.error("ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


export default router;
