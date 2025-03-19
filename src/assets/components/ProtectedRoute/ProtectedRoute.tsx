import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userRole = localStorage.getItem("rol");

  // If there's no user role, redirect to the login page
  if (!userRole) {
    return <Navigate to="/Login" />;
  }

  // Otherwise, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
