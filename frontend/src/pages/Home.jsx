import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const HOMEAPI = axios.create({
  baseURL: import.meta.env.VITE_HOME_API_URL || "http://localhost:5000/",
});

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await HOMEAPI.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero section */}
      <section
        style={{
          textAlign: "center",
          padding: "100px 20px 80px 20px",
          background: "#f5f5f5",
        }}
      >
        <h1
          className="page-title"
          style={{
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          VYROX
        </h1>
        <p
          className="page-subtitle"
          style={{
            fontSize: "18px",
            fontWeight: 400,
            marginBottom: "50px",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          Urban Streetwear & Lifestyle Collection
        </p>
        <Link
          to="/products"
          style={{
            padding: "20px 50px",
            background: "#000",
            color: "#fff",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "18px",
            textDecoration: "none",
            transition: "0.3s ease",
          }}
        >
          Shop Now
        </Link>
      </section>

      {/* Featured products grid */}
      <section style={{ padding: "0 50px 80px 50px" }}>
        <div
          className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              style={{
                padding: "30px",
                border: "1px solid #000",
                borderRadius: "16px",
                transition: "0.3s ease",
                background: "#fff",
              }}
            >
              {product.image ? (
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="product-img"
                  style={{
                    width: "100%",
                    height: "360px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    background: "#eee",
                  }}
                />
              ) : (
                <div
                  className="product-placeholder"
                  style={{
                    width: "100%",
                    height: "360px",
                    background: "#eee",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Image
                </div>
              )}
              <h3 className="product-name" style={{ fontSize: "24px", fontWeight: 700, marginBottom: "10px" }}>
                {product.name}
              </h3>
              <p className="product-price" style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>
                ${product.price}
              </p>
              <p className="product-description" style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
                {product.description}
              </p>
              <Link to={`/products/${product._id}`}>
                <button
                  className="add-btn"
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#000",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "0.3s ease",
                  }}
                >
                  View Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
