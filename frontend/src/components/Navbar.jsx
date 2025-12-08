import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const brandName = "VYROX"; // 5-letter brand placeholder

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link to="/" style={styles.brand}>
          {brandName}
        </Link>
        <Link to="/products" style={styles.link}>
          Products
        </Link>
        {user && (
          <Link to="/orders" style={styles.link}>
            Orders
          </Link>
        )}
        <Link to="/cart" style={styles.link}>
          Cart
        </Link>
        {user && (
          <Link to="/checkout" style={styles.link}>
            Checkout
          </Link>
        )}
      </div>
      <div style={styles.user}>
        {user ? (
          <>
            <span style={styles.userText}>Hi, {user.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#000", // black brand feel
    color: "#fff",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "800",
    letterSpacing: "3px",
    color: "#fff",
    textDecoration: "none",
  },
  link: {
    fontSize: "1rem",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  user: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userText: {
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
};
