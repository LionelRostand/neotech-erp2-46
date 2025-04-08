
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import InvoicePage from "@/pages/billing/InvoicePage";
import { useAuth } from "@/hooks/useAuth";

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  // Check if user is authenticated
  const isAuthenticated = !!currentUser;

  // If user is not authenticated, redirect to login page for protected routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>Dashboard Page</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <div>Welcome Page</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <div>Applications Page</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/invoice"
        element={
          <ProtectedRoute>
            <InvoicePage />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
