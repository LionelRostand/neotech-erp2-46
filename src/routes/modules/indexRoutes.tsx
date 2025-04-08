
import React from 'react';
import { Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Welcome from "@/pages/Welcome";
import UserProfile from "@/pages/UserProfile";
import Applications from "@/pages/Applications";
import ModuleInfo from "@/pages/ModuleInfo";
import Performance from "@/pages/Performance";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/Login";

export const IndexRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  <Route key="welcome" path="/welcome" element={<Welcome />} />,
  <Route key="module-info" path="/module-info" element={<ModuleInfo />} />,
  <Route key="applications" path="/applications" element={<Applications />} />,
  <Route key="profile" path="/profile" element={<UserProfile />} />,
  <Route key="login" path="/login" element={<Login />} />,
  
  // Dashboard routes
  <Route key="dashboard-performance" path="/dashboard/performance" element={<Performance />} />,
  <Route key="dashboard-analytics" path="/dashboard/analytics" element={<Analytics />} />,
  
  // Redirect /dashboard to /
  <Route key="dashboard-redirect" path="/dashboard" element={<Navigate to="/" replace />} />
];
