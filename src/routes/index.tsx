
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import ApplicationsPage from "@/pages/Applications";
import SettingsPage from "@/pages/Settings";
import ContactPage from "@/pages/Contact";
import NotFoundPage from "@/pages/NotFound";
import AppLayout from "@/components/AppLayout";
import { EmployeesRoutes } from "./modules/employeesRoutes";
import { FreightRoutes } from "./modules/freightRoutes";
import { ProjectsRoutes } from "./modules/projectsRoutes";
import { AccountingRoutes } from "./modules/accountingRoutes";
import { MessagesRoutes } from "./modules/messagesRoutes";
import { CompaniesRoutes } from "./modules/companiesRoutes";
import { CrmRoutes } from "./modules/crmRoutes";
import { HealthRoutes } from "./modules/healthRoutes";
import { DocumentsRoutes } from "./modules/documentsRoutes";
import { RentalsRoutes } from "./modules/rentalsRoutes";
import { TransportRoutes } from "./modules/transportRoutes";
import { GarageRoutes } from "./modules/garageRoutes";
import { WebsiteRoutes } from "./modules/websiteRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Module Routes */}
          {EmployeesRoutes}
          {FreightRoutes}
          {ProjectsRoutes}
          {AccountingRoutes}
          {MessagesRoutes}
          {CompaniesRoutes}
          {CrmRoutes}
          {HealthRoutes}
          {DocumentsRoutes}
          {RentalsRoutes}
          {TransportRoutes}
          {GarageRoutes}
          {WebsiteRoutes}
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
