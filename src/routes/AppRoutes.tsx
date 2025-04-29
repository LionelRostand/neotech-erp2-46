
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

// Import all route groups
import { AuthRoutes } from './modules/authRoutes';
import { IndexRoutes } from './modules/indexRoutes';
import { SettingsRoutes } from './modules/settingsRoutes';
// Import other route groups as needed
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';

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
            
            {/* Profile route */}
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Add other route groups here */}
            
            {/* Fallback redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
