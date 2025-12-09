import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

// Create the context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // Load admin from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        return { success: false, message: "You must log in as admin" };
      }

      const adminData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      };

      localStorage.setItem("admin", JSON.stringify(adminData));
      setAdmin(adminData);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  // Logout function
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

export default AuthContext;
