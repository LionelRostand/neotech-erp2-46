
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EmployeesRoutes } from "./modules/employeesRoutes";
import { FreightRoutes } from "./modules/freightRoutes";
import { ProjectsRoutes } from "./modules/projectsRoutes";
import { AccountingRoutes } from "./modules/accountingRoutes";
import { MessagesRoutes } from "./modules/messagesRoutes";
import { CompaniesRoutes } from "./modules/companiesRoutes";
import { CrmRoutes } from "./modules/crmRoutes";
import { HealthRoutes } from "./modules/healthRoutes";
import { DocumentsRoutes } from "./modules/documentsRoutes";
import { TransportRoutes } from "./modules/transportRoutes";
import { GarageRoutes } from "./modules/garageRoutes";
import { WebsiteRoutes } from "./modules/websiteRoutes";
import { RentalRoutes } from "./modules/rentalRoutes";

// Using placeholder components for missing pages
const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Dashboard Page</div>;
const ApplicationsPage = () => <div>Applications Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const ContactPage = () => <div>Contact Page</div>;
const NotFoundPage = () => <div>404 Not Found</div>;
const AppLayout = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

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
          {RentalRoutes}
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
