
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import WelcomePage from '@/pages/WelcomePage';
import ApplicationsPage from '@/pages/ApplicationsPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { EmployeesRoutes } from './modules/employeesRoutes';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/welcome" /> : <LoginPage />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/welcome" />
        </ProtectedRoute>
      } />
      
      <Route path="/welcome" element={
        <ProtectedRoute>
          <WelcomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/applications" element={
        <ProtectedRoute>
          <ApplicationsPage />
        </ProtectedRoute>
      } />
      
      {/* Modules routes */}
      {EmployeesRoutes}
      
      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
