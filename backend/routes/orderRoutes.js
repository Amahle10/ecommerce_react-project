// backend/routes/orderRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const router = express.Router();

/**
 * CREATE ORDER
 * POST /api/orders
 */
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentStatus: "pending",
      orderStatus: "created",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/**
 * CREATE STRIPE PAYMENT INTENT
 * POST /api/orders/pay/:orderId
 */
router.post("/pay/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "zar", // Adjust currency as needed
      payment_method_types: ["card"],
      metadata: {
        order_id: order._id.toString(),
        user_id: req.user._id.toString(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("PAYMENT INTENT ERROR:", err);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

/**
 * MARK ORDER AS PAID (AFTER STRIPE SUCCESS)
 * PUT /api/orders/:orderId/pay
 */
router.put("/:orderId/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error("UPDATE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});

/**
 * GET USER ORDERS
 * GET /api/orders/myorders
 */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).lean();
    res.json(orders || []);
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
