import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setAdmin(res.data);
      localStorage.setItem("admin", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 400 }}>
      <h2>Admin Register</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}
