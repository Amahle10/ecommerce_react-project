import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.role !== "admin") {
        alert("You must log in as admin");
        return;
      }
      setAdmin(res.data); // store admin in context
      localStorage.setItem("admin", JSON.stringify(res.data)); // persist login
      navigate("/"); // go to products page
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f9fafb",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "30px",
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            margin: "10px 0",
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
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
            margin: "10px 0",
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
