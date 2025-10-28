import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API from "../api/axios";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!user) {
      setError("❌ You must be logged in to checkout.");
      return;
    }

    if (cartItems.length === 0) {
      setError("❌ Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Create new order in backend
      const orderRes = await API.post("/orders", {
      orderItems: cartItems.map((item) => ({
        product: item._id,
            name: item.name,         // include product name
            price: item.price,
            quantity: item.qty,      // match backend field
        })),
        totalPrice: totalAmount,
        });


      const orderId = orderRes.data._id;

      // 2️⃣ Get Stripe client secret
      const paymentRes = await API.post(`/payment/pay/${orderId}`);
      const clientSecret = paymentRes.data.clientSecret;

      // 3️⃣ Confirm payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        clearCart();
        navigate("/order-success", { state: { order: orderRes.data } });
      }
    } catch (err) {
      setError(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="p-10 text-red-500 text-center">
        You must be logged in to checkout.
      </p>
    );
  }

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* User Details */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Your Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Cart Items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Your Cart</h3>
        <ul className="mb-2">
          {cartItems.map((item) => (
            <li key={item._id + Math.random()}>
              {item.name} x {item.qty} = ${item.price * item.qty}
            </li>
          ))}
        </ul>
        <p className="font-bold">Total: ${totalAmount.toFixed(2)}</p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="space-y-4">
        <CardElement
          options={{ style: { base: { fontSize: "16px", color: "#32325d" } } }}
        />
        <button
          type="submit"
          disabled={!stripe || loading || cartItems.length === 0}
          className={`mt-2 w-full px-4 py-2 rounded text-white ${
            loading || cartItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {error && <p className="mt-3 text-center text-red-500">{error}</p>}
    </div>
  );
}

export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
}
