// Checkout.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutFormInner() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  // Prefill address from user profile
  const [address, setAddress] = useState({
    address: user?.address?.address || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || ""
  });

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Initialize payment
  const handlePaymentInit = async () => {
    if (!user) return;
    setError("");

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
      };

      // Create order with shipping address
      const orderRes = await API.post("/orders", {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        totalPrice: totalAmount,
        shippingAddress: address,
      }, config);

      setOrder(orderRes.data);

      // Create Stripe PaymentIntent
      const paymentRes = await API.post(`/orders/pay/${orderRes.data._id}`, {}, config);
      setClientSecret(paymentRes.data.clientSecret);
    } catch (err) {
      console.error("Payment init error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return setError("❌ Payment not initialized yet.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

      if (result.error) {
        setError(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await API.put(`/orders/${order._id}/pay`, {}, config);
        clearCart();
        setSuccess("✅ Payment successful!");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <p style={{ color: "red", fontWeight: 700 }}>You must be logged in to checkout.</p>
      <button onClick={() => navigate("/login")} style={styles.button}>Login</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "50px 20px", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ fontSize: "48px", fontWeight: 900, textAlign: "center", marginBottom: "40px" }}>Checkout</h2>

      {/* USER DETAILS */}
      <div style={cardStyle}>
        <h3>Your Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* SHIPPING ADDRESS */}
      <div style={cardStyle}>
        <h3>Shipping Address</h3>
        <input
          type="text"
          placeholder="Address"
          value={address.address}
          onChange={e => setAddress({ ...address, address: e.target.value })}
          style={inputStyle}
          required
          disabled={!!user.address} // lock if user has saved address
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={e => setAddress({ ...address, city: e.target.value })}
          style={inputStyle}
          required
          disabled={!!user.address}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={e => setAddress({ ...address, postalCode: e.target.value })}
          style={inputStyle}
          required
          disabled={!!user.address}
        />
        <input
          type="text"
          placeholder="Country"
          value={address.country}
          onChange={e => setAddress({ ...address, country: e.target.value })}
          style={inputStyle}
          required
          disabled={!!user.address}
        />
      </div>

      {/* CART */}
      <div style={cardStyle}>
        <h3>Your Cart</h3>
        {cartItems.map(item => (
          <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
            <img
              src={item.image ? `http://localhost:5000${item.image}` : ""}
              alt={item.name}
              style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "12px", background: "#eee" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700 }}>{item.name}</p>
              <p>Qty: {item.qty}</p>
            </div>
            <p style={{ fontWeight: 600 }}>R{(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
        <p style={{ fontWeight: 700, textAlign: "right", marginTop: "15px" }}>Total: R{totalAmount.toFixed(2)}</p>
      </div>

      {/* PAYMENT */}
      <form onSubmit={handlePayment} style={cardStyle}>
        <h3>Payment</h3>
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#32325d" } } }} />

        {!clientSecret && (
          <button type="button" onClick={handlePaymentInit} style={{ ...styles.button, width: "100%" }}>
            Initialize Payment
          </button>
        )}

        <button
          type="submit"
          disabled={!stripe || !clientSecret || loading}
          style={{
            ...styles.button,
            width: "100%",
            marginTop: "10px",
            background: !clientSecret || loading ? "#ccc" : "#000",
            cursor: !clientSecret || loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Processing..." : `Pay R${totalAmount.toFixed(2)}`}
        </button>
      </form>

      {error && <p style={{ marginTop: "15px", color: "red", textAlign: "center" }}>{error}</p>}
      {success && order && (
        <div style={{ marginTop: "15px", textAlign: "center", color: "green" }}>
          <p>{success}</p>
          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> R{order.totalPrice.toFixed(2)}</p>
            <p><strong>Status:</strong> processing</p>
            <p><strong>Payment:</strong> paid</p>
            <p><strong>Shipping Address:</strong> {`${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutWrapper() {
  return <Elements stripe={stripePromise}><CheckoutFormInner /></Elements>;
}

const cardStyle = { background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "30px", boxShadow: "0 8px 20px rgba(0,0,0,0.05)", border: "1px solid #000" };
const inputStyle = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" };
const styles = { button: { marginTop: 20, padding: "10px 20px", fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer", backgroundColor: "#000", color: "#fff" } };
