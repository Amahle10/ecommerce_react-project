import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders for logged-in user
  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await API.get("/orders/myorders"); // interceptor attaches token
      setOrders(res.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setError("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!user)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "#ff0000", fontFamily: "'Inter', sans-serif" }}>
        Please log in to view your orders.
      </p>
    );

  if (loading)
    return (
      <p style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        Loading orders...
      </p>
    );

  if (error)
    return (
      <p style={{ padding: 40, textAlign: "center", color: "#ff0000", fontFamily: "'Inter', sans-serif" }}>
        {error}
      </p>
    );

  if (orders.length === 0)
    return (
      <p style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        You have no orders yet.
      </p>
    );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "50px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "48px", fontWeight: 900, textAlign: "center", marginBottom: "40px" }}>
          My Orders
        </h2>

        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              border: "1px solid #000",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
              Order ID: {order._id}
            </h3>
            <p style={{ marginBottom: "6px" }}>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p style={{ marginBottom: "6px" }}>
              <strong>Payment:</strong> {order.paymentStatus}
            </p>
            <p style={{ marginBottom: "12px", fontWeight: 600 }}>
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
            </p>

            <div>
              <h4 style={{ fontWeight: 700, marginBottom: "8px" }}>Items:</h4>
              <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                {order.orderItems.map((item) => (
                  <li key={item.product?._id || item._id} style={{ marginBottom: "6px" }}>
                    {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
