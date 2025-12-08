import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) return <p style={styles.loading}>Loading products...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div className="page">
      <h2 style={styles.heading}>Collection</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Product Image */}
            {product.image ? (
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
              />
            ) : (
              <div className="product-placeholder">No Image</div>
            )}

            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginBottom: "2rem",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: "#000",
  },
  loading: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "2rem",
  },
  error: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: "2rem",
    color: "red",
  },
};
