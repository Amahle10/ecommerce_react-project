import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProductId, setAddedProductId] = useState(null); // Which product shows popup
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product._id);

    setTimeout(() => setAddedProductId(null), 2000); // Hide after 2s
  };

  if (loading) return <p style={styles.loading}>Loading products...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div className="page">
      <h2 style={styles.heading}>Collection</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            style={{ position: "relative" }} // Make popup relative to this card
          >
            {product.image ? (
              <img src={`http://localhost:5000${product.image}`} alt={product.name} />
            ) : (
              <div className="product-placeholder">No Image</div>
            )}
            <h3>{product.name}</h3>
            <p className="price">R{product.price}</p>
            <p className="description">{product.description}</p>

            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>

            {/* Floating popup on top of card */}
            {addedProductId === product._id && (
              <div style={styles.popup}>✅ Added!</div>
            )}
          </div>
        ))}
      </div>

      {/* Keyframes for popup animation */}
      <style>
        {`
          @keyframes fadeSlide {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  heading: { textAlign: "center", fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" },
  loading: { fontSize: "1.2rem", textAlign: "center", marginTop: "2rem" },
  error: { fontSize: "1.2rem", textAlign: "center", marginTop: "2rem", color: "red" },
  popup: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#fff6e5", // warm color
    color: "#333",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    pointerEvents: "none",
    animation: "fadeSlide 2s ease forwards",
    zIndex: 10, // make sure it's above card content
  },
};
