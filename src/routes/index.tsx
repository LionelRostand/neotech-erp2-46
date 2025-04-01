
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import route groups
import { TransportRoutes } from "./modules/transportRoutes";
import { GarageRoutes } from "./modules/garageRoutes";

// Placeholder components for missing pages
const Dashboard = () => <div>Dashboard Page</div>;
const Settings = () => <div>Settings Page</div>;
const Contact = () => <div>Contact Page</div>;

// Placeholder for AppLayout
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-layout">{children}</div>
);

// Unified routes configuration
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Module routes */}
        {TransportRoutes}
        {GarageRoutes}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
