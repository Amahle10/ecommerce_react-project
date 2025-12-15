import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      if (!res.data.isAdmin) return { success: false, message: "You must log in as admin" };

      localStorage.setItem("admin", JSON.stringify(res.data));
      setAdmin(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, setAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
