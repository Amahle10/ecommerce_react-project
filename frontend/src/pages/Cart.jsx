import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "50px 20px" }}>
        <h2 style={{ fontSize: "48px", fontWeight: 900, textAlign: "center", marginBottom: "40px" }}>
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Your cart is empty.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cartItems.map((item) => (
              <div
                key={item._id + Math.random()}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  border: "1px solid #000",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                }}
              >
                {/* Product Image */}
                <img
                  src={item.image ? `http://localhost:5000${item.image}` : ""}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    background: "#eee",
                  }}
                />

                {/* Name & Qty */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                    Quantity: {item.qty}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 600 }}>
                    Price: ${ (item.price * item.qty).toFixed(2) }
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    background: "#ff0000",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#cc0000"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#ff0000"}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total & Actions */}
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <p style={{ fontSize: "22px", fontWeight: 700, marginBottom: "15px" }}>
                Total: ${total.toFixed(2)}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: "#555",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#555"}
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#222"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#000"}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
