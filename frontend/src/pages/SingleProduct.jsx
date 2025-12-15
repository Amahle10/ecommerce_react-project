import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setError("❌ Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;
  if (!product) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Product not found</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Link to="/products" style={{ display: "inline-block", marginBottom: "20px" }}>⬅ Back to Products</Link>
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {product.image && (
          <img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: "400px", height: "400px", objectFit: "cover", borderRadius: "12px" }} />
        )}
        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>R{product.price}</p>
          <p style={{ marginBottom: "12px", color: "#555" }}>{product.description}</p>
          {product.category && <p style={{ fontStyle: "italic", color: "#555" }}>Category: {product.category}</p>}
        </div>
      </div>
    </div>
  );
}
