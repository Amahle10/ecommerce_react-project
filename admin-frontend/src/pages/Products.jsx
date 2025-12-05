import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Products() {
  const { admin, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    if (!admin) return;
    fetchProducts();
  }, [admin]);

  if (!admin) return <p>Please log in as admin</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Products</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <Link to="/add" style={{ marginBottom: 12, display: "inline-block" }}>➕ Add Product</Link>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
            {product.image ? (
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
              />
            ) : (
              <div style={{ width: "100%", height: 200, backgroundColor: "#eee", borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </div>
            )}
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Link to={`/edit/${product._id}`} style={{ backgroundColor: "#3b82f6", color: "white", padding: 6, borderRadius: 4 }}>Edit</Link>
              <button onClick={() => deleteProduct(product._id)} style={{ backgroundColor: "#dc2626", color: "white", padding: 6, borderRadius: 4 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
