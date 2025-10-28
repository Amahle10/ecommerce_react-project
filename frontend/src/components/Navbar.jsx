import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between">
      <div className="space-x-4">
        <Link to="/">ApiTest</Link>
        <Link to="/products">Products</Link>
        {user && <Link to="/orders">Orders</Link>}
        <Link to="/cart">Cart</Link>
        {user && <Link to="/checkout">Checkout</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-3">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-3">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
