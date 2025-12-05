import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin } = useContext(AuthContext);

  // If not admin, redirect to login
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // If admin, render the children components
  return children;
}
