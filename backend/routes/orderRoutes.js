import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env") });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create new order
router.post("/", protect, async (req, res) => {
  const { orderItems, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: "No order items" });

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe payment
router.post("/pay/:orderId", protect, async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { order_id: orderId, user_id: req.user._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status after payment (can be used in webhook)
router.put("/pay/:id/status", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
