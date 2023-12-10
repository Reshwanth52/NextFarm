import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminRoute,
  isAdmin,
  redirect = "/login",
  redirectAdmin = "/",
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }
  if (adminRoute && !isAdmin === "admin") {
    return <Navigate to={redirectAdmin} replace state={{ from: location }} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
