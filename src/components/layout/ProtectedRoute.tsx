// src/components/layout/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = must be logged in, false = must NOT be logged in (e.g. login page)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show a clean full-screen loader while checking auth
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Case 1: Route requires login but user is NOT logged in → go to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Case 2: Route should only be accessible when NOT logged in (e.g. /login)
  // but user IS logged in → redirect to admin dashboard
  if (!requireAuth && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  // All good — render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;