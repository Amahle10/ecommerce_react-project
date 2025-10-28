import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve('./.env') }); // force load
console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

console.log("Initializing orderRoutes.js");
const router = express.Router();

// ✅ Initialize Stripe

console.log(process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing in .env!");
  throw new Error("Missing STRIPE_SECRET_KEY in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// ✅ Create new order (Customer)
router.post("/", protect, async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// ✅ Get logged-in user's orders
router.get("/myorders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "name price");
  res.json(orders);
});

// ✅ Admin: get all orders
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
});

// ✅ Admin: update order status
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// ✅ Payment route
router.post("/pay/:orderId", protect, async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { order_id: orderId, user_id: req.user._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Order route works ✅");
});

export default router;
