import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminProducts() {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch admin products
  const fetchProducts = async () => {
    if (!admin?.token) return;
    try {
      const res = await API.get("/products/admin", {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      const normalized = res.data.map((p) => ({
        ...p,
        stock: Number(p.stock) || 0,
        variants: Array.isArray(p.variants)
          ? p.variants.map((v) => ({ ...v, stock: Number(v.stock) || 0 }))
          : [],
      }));

      setProducts(normalized);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    if (admin) fetchProducts();
  }, [admin]);

  if (!admin) return <p>Please log in as admin</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Products</h2>
        <div>
          <button onClick={logout} style={{ marginRight: 10, padding: "6px 12px", borderRadius: 4, background: "#dc2626", color: "#fff" }}>Logout</button>
          <Link to="/add" style={{ padding: "6px 12px", borderRadius: 4, background: "#16a34a", color: "#fff", textDecoration: "none" }}>➕ Add Product</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6, background: "#fafafa" }}>
            {product.image ? (
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
              />
            ) : (
              <div style={{ width: "100%", height: 200, backgroundColor: "#eee", borderRadius: 6, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                No Image
              </div>
            )}

            <h3>{product.name}</h3>
            <p><strong>Price:</strong> R{product.price}</p>
            <p style={{ fontWeight: 600, color: product.stock > 0 ? "green" : "red" }}>
              Stock: {product.stock} {product.stock === 0 && "(Out of stock)"}
            </p>

            {product.variants.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <strong>Variants:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                  {product.variants.map((v, i) => (
                    <li key={i} style={{ color: v.stock > 0 ? "green" : "red" }}>
                      {v.name || "Unnamed variant"} — R{v.price ?? "N/A"} — Stock: {v.stock} {v.stock === 0 && "(Out of stock)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p>{product.description}</p>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Link to={`/edit/${product._id}`} style={{ backgroundColor: "#3b82f6", color: "#fff", padding: 6, borderRadius: 4, textAlign: "center", flex: 1 }}>Edit</Link>
              <button onClick={() => deleteProduct(product._id)} style={{ backgroundColor: "#dc2626", color: "#fff", padding: 6, borderRadius: 4, flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
