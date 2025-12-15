import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate("/"); // go to home/admin dashboard
    else alert(result.message);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#3b82f6",
            color: "#fff",
            borderRadius: 4,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ marginTop: 15, textAlign: "center", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
