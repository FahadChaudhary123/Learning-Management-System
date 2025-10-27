import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/slices/authSlice";

export default function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user?.role === "Instructor") {
      return <Navigate to="/dashboard/instructor-home" replace />;
    } else {
      return <Navigate to="/dashboard/home" replace />;
    }
  }

  // Handle dashboard root path redirection
  if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
    if (user?.role === "Instructor") {
      return <Navigate to="/dashboard/instructor-home" replace />;
    } else {
      return <Navigate to="/dashboard/home" replace />;
    }
  }

  return children;
}