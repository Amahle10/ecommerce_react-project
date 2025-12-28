import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/orders/myorders");

        // ✅ ALWAYS expect array
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("FETCH ORDERS ERROR:", err.response?.data || err.message);

        // ❌ Only show error if server actually failed
        if (err.response && err.response.status !== 404) {
          setError("❌ Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // -------- RENDER STATES --------

  if (!user) {
    return (
      <p style={{ padding: 40, textAlign: "center", color: "red" }}>
        Please log in to view your orders.
      </p>
    );
  }

  if (loading) {
    return (
      <p style={{ padding: 40, textAlign: "center" }}>
        Loading orders...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ padding: 40, textAlign: "center", color: "red" }}>
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p style={{ padding: 40, textAlign: "center" }}>
        You have no orders yet.
      </p>
    );
  }

  // -------- ORDERS UI --------

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontSize: 32, marginBottom: 30 }}>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #000",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <p><strong>Order ID:</strong> {order._id}</p>

          <p>
            <strong>Status:</strong>{" "}
            {order.isDelivered ? "Delivered" : "Processing"}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {order.isPaid ? "Paid" : "Pending"}
          </p>

          <p>
            <strong>Total:</strong> R{order.totalPrice.toFixed(2)}
          </p>

          <ul>
            {order.orderItems?.map((item, idx) => (
              <li key={idx}>
                {item.name} × {item.qty} — R
                {(item.price * item.qty).toFixed(2)}
              </li>
            ))}
          </ul>

          <p style={{ fontSize: 14, color: "#666" }}>
            Ordered on: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
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
