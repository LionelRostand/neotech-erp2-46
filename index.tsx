
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import route groups
import { TransportRoutes } from "./modules/transportRoutes";
import { GarageRoutes } from "./modules/garageRoutes";
import { EmployeesRoutes } from "./routes/modules/employeesRoutes";

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
      <Route path="/" element={<AppLayout><Navigate to="/dashboard" /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
      
      {/* Module routes */}
      {EmployeesRoutes}
      {TransportRoutes}
      {GarageRoutes}
    </Routes>
  );
};

export default AppRoutes;
