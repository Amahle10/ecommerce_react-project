import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await API.get("/products/admin");
      const normalized = res.data.map((p) => ({
        ...p,
        stock: Number(p.stock) || 0,
        variants: Array.isArray(p.variants)
          ? p.variants.map((v) => ({ ...v, stock: Number(v.stock) || 0 }))
          : [],
      }));
      setProducts(normalized);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!admin) return;
    fetchOrders();
    fetchProducts();
  }, [admin]);

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending");
  const processingOrders = orders.filter((o) => o.orderStatus === "processing");
  const completedOrders = orders.filter((o) => o.orderStatus === "completed");

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  if (!admin) return <p style={{ padding: 20 }}>❌ Admin access only</p>;

  return (
    <div style={{ padding: 40, fontFamily: "'Inter', sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>Admin Dashboard</h1>
        <button onClick={logout} style={btnStyle}>Logout</button>
      </header>

      {/* Orders Summary */}
      <h2 style={{ marginBottom: 20 }}>Orders Summary</h2>
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <OrderCard title="Pending Orders" count={pendingOrders.length} navigate={navigate} />
        <OrderCard title="Processing Orders" count={processingOrders.length} navigate={navigate} />
        <OrderCard title="Completed Orders" count={completedOrders.length} navigate={navigate} />
      </div>

      {/* Products */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Products</h2>
        <Link to="/add" style={btnStyle}>➕ Add Product</Link>
      </div>

      {loadingProducts ? <p>Loading products...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
          {products.map((product) => (
            <div key={product._id} style={productCard}>
              {product.image ? (
                <img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />
              ) : (
                <div style={{ width: "100%", height: 200, backgroundColor: "#eee", borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
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
                <Link to={`/edit/${product._id}`} style={editBtn}>Edit</Link>
                <button onClick={() => deleteProduct(product._id)} style={deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Components & styles
const OrderCard = ({ title, count, navigate }) => (
  <div style={cardStyle}>
    <h3>{title}</h3>
    <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{count}</p>
    <button onClick={() => navigate("/orders")} style={btnStyle}>View</button>
  </div>
);

const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  flex: 1,
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const btnStyle = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  backgroundColor: "#000",
  color: "#fff",
};

const editBtn = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 4,
  textDecoration: "none",
};

const deleteBtn = {
  backgroundColor: "#dc2626",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
};

const productCard = {
  border: "1px solid #ddd",
  padding: 12,
  borderRadius: 6,
};
