import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="links">
        <Link to="/">ApiTest</Link>
        <Link to="/products">Products</Link>
        {user && <Link to="/orders">Orders</Link>}
        <Link to="/cart">Cart</Link>
        {user && <Link to="/checkout">Checkout</Link>}
      </div>
      <div className="user">
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
