import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await API.get("/orders/myorders");
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!user)
    return <p style={centerTextRed}>Please log in to view your orders.</p>;

  if (loading) return <p style={centerText}>Loading orders...</p>;
  if (error) return <p style={centerTextRed}>{error}</p>;
  if (orders.length === 0) return <p style={centerText}>You have no orders yet.</p>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ padding: "50px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={titleStyle}>My Orders</h2>

        {orders.map((order) => (
          <div key={order._id} style={cardStyle}>
            <h3 style={orderIdStyle}>Order ID: {order._id}</h3>

            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>

            {order.trackingNumber && <p><strong>Tracking #:</strong> {order.trackingNumber}</p>}

            {/* SHIPPING ADDRESS */}
            {order.shippingAddress && (
              <div style={{ marginTop: 10 }}>
                <strong>Shipping Address:</strong>
                <p style={{ fontSize: 14 }}>
                  {order.shippingAddress.address}, {order.shippingAddress.city},<br />
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            )}

            {/* DATES */}
            {order.shippedAt && (
              <p><strong>Shipped At:</strong> {new Date(order.shippedAt).toLocaleString()}</p>
            )}
            {order.deliveredAt && (
              <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
            )}

            <p style={{ fontWeight: 600, marginTop: 10 }}>
              <strong>Total:</strong> R{order.totalPrice.toFixed(2)}
            </p>

            {/* ITEMS */}
            <div style={{ marginTop: 15 }}>
              <h4 style={{ fontWeight: 700 }}>Items:</h4>
              <ul style={{ paddingLeft: 20 }}>
                {order.orderItems.map((item) => (
                  <li key={item.product?._id || item._id}>
                    {item.name} x {item.quantity} — R{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: 14, color: "#555", marginTop: 10 }}>
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const centerText = {
  padding: 40,
  textAlign: "center",
  fontFamily: "'Inter', sans-serif"
};

const centerTextRed = {
  ...centerText,
  color: "#ff0000"
};

const titleStyle = {
  fontSize: "48px",
  fontWeight: 900,
  textAlign: "center",
  marginBottom: "40px"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "30px",
  marginBottom: "30px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  border: "1px solid #000",
  transition: "0.2s",
};

const orderIdStyle = {
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "12px"
};
