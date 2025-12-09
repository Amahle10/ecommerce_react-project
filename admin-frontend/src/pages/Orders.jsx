import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function Orders() {
  const { admin } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders"); // Admin endpoint
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) return;
    fetchOrders();
  }, [admin]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { orderStatus: status });
      // Update locally
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch (err) {
      alert("Failed to update order status");
      console.error(err.response?.data || err.message);
    }
  };

  const updatePayment = async (orderId, paymentStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { paymentStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus } : o));
    } catch (err) {
      alert("Failed to update payment status");
      console.error(err.response?.data || err.message);
    }
  };

  if (!admin) return <p style={{ padding: 20 }}>❌ Admin access only</p>;
  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;

  return (
    <div style={{ padding: 40, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: 30 }}>All Orders</h1>

      <div style={{ display: "grid", gap: 20 }}>
        {orders.map(order => (
          <div key={order._id} style={orderCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User:</strong> {order.user.name} ({order.user.email})</p>
                <p><strong>Total:</strong> R{order.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              <h4>Items:</h4>
              {order.orderItems.map(item => (
                <p key={item.product._id}>
                  {item.name} - Qty: {item.quantity} - R{(item.price * item.quantity).toFixed(2)}
                </p>
              ))}
            </div>

            {/* Status buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              {order.orderStatus !== "processing" && (
                <button onClick={() => updateStatus(order._id, "processing")} style={btn}>
                  Mark Processing
                </button>
              )}
              {order.orderStatus !== "completed" && (
                <button onClick={() => updateStatus(order._id, "completed")} style={{ ...btn, backgroundColor: "#16a34a" }}>
                  Mark Completed
                </button>
              )}
              {order.paymentStatus !== "paid" && (
                <button onClick={() => updatePayment(order._id, "paid")} style={{ ...btn, backgroundColor: "#f59e0b" }}>
                  Mark Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const orderCard = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const btn = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  backgroundColor: "#3b82f6",
  color: "#fff",
};
