
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

// Import all route groups
import { AuthRoutes } from './modules/authRoutes';
import { IndexRoutes } from './modules/indexRoutes';
import { SettingsRoutes } from './modules/settingsRoutes';
// Import other route groups as needed

// Loading component
const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-neotech-primary"></div>
      <div className="mt-4 text-lg font-medium text-gray-500">Chargement...</div>
    </div>
  </div>
);

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public authentication routes */}
      {AuthRoutes}
      
      {/* Protected routes */}
      <Route path="*" element={
        <ProtectedRoute>
          <Routes>
            {IndexRoutes}
            {SettingsRoutes}
            {/* Add other route groups here */}
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
