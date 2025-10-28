// src/pages/Login.jsx
import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext); // Context function to update user state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const userData = res.data;

      // Update context and localStorage
      login(userData);

      setMessage(`✅ Welcome, ${userData.name}!`);

      // Redirect to home or checkout after login
      navigate("/"); // or navigate("/checkout") if coming from cart
    } catch (err) {
      setMessage("❌ Login failed. Check your credentials.");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Customer Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          Login
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
