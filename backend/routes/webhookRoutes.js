import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import Order from "../models/Order.js"; // import order model

dotenv.config({ path: path.resolve("./.env") });

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific event types
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log("💰 Payment succeeded:", paymentIntent.id);

          // Get order_id from metadata
          const orderId = paymentIntent.metadata.order_id;
          if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
              order.paymentStatus = "paid";
              order.orderStatus = "processing";
              await order.save();
              console.log(`✅ Order ${orderId} updated to paid`);
            }
          }
          break;

        case "payment_intent.payment_failed":
          const failedIntent = event.data.object;
          console.log("❌ Payment failed:", failedIntent.id);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error("Error updating order:", err.message);
    }

    res.json({ received: true });
  }
);

export default router;
