import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const brandName = "VYROX";

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link to="/" style={styles.brand}>{brandName}</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        {user && <Link to="/orders" style={styles.link}>Orders</Link>}
        <Link to="/cart" style={styles.link}>
          Cart {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
        </Link>
        {user && <Link to="/checkout" style={styles.link}>Checkout</Link>}
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>🔍</button>
      </form>

      <div style={styles.user}>
        {user ? (
          <>
            <span style={styles.userText}>Hi, {user.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#000", color: "#fff", flexWrap: "wrap" },
  links: { display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" },
  brand: { fontSize: "1.8rem", fontWeight: "800", color: "#fff", textDecoration: "none" },
  link: { fontSize: "1rem", color: "#fff", textDecoration: "none", fontWeight: "600" },
  user: { display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" },
  userText: { fontWeight: "600" },
  logoutBtn: { backgroundColor: "#fff", color: "#000", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  cartBadge: { background: "red", color: "#fff", borderRadius: "50%", padding: "2px 6px", marginLeft: "5px", fontSize: "0.8rem" },
  searchForm: { display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" },
  searchInput: { padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc" },
  searchBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer" },
};
