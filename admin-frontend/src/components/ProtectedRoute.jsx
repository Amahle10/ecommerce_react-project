import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin } = useContext(AuthContext);

  if (!admin) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // Logged in, show the page
}
