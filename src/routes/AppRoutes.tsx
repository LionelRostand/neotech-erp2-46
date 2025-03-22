import React from 'react';
import { Routes, Route } from "react-router-dom";
import App from '@/App';
import Dashboard from '@/components/dashboard/ModulesList';
import { modules } from '@/data/modules';

// Import route modules
import { AuthRoutes } from './modules/authRoutes';
import { SettingsRoutes } from './modules/settingsRoutes';
import { EmployeesRoutes } from './modules/employeesRoutes';
import { FreightRoutes } from './modules/freightRoutes';
import { ProjectsRoutes } from './modules/projectsRoutes';
import { AccountingRoutes } from './modules/accountingRoutes';
import { MessagesRoutes } from './modules/messagesRoutes';
import { DocumentsRoutes } from './modules/documentsRoutes';
import { CrmRoutes } from './modules/crmRoutes';
import { CompaniesRoutes } from './modules/companiesRoutes';
import { HealthRoutes } from './modules/healthRoutes';
import { RentalRoutes } from './modules/rentalRoutes';
import { TransportRoutes } from './modules/transportRoutes';
import { GarageRoutes } from './modules/garageRoutes';
import { OtherModulesRoutes } from './modules/otherModulesRoutes';

// Create a simple dashboard wrapper that provides the required props
const DashboardWrapper = () => {
  // Default empty values that will be properly populated by SidebarContext in the actual app
  return (
    <Dashboard 
      installedModules={modules}
      expandedModules={{}}
      toggleModuleSubmenus={() => {}}
      showModules={true}
      location={{ pathname: window.location.pathname }}
      onNavigate={() => {}}
    />
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<DashboardWrapper />} />
      
      {/* Auth routes */}
      {AuthRoutes}
      
      {/* Settings routes */}
      {SettingsRoutes}
      
      {/* Module routes */}
      {EmployeesRoutes}
      {FreightRoutes}
      {ProjectsRoutes}
      {AccountingRoutes}
      {MessagesRoutes}
      {DocumentsRoutes}
      {CrmRoutes}
      {CompaniesRoutes}
      {HealthRoutes}
      {RentalRoutes}
      {TransportRoutes}
      {GarageRoutes}
      
      {/* Other module routes */}
      {OtherModulesRoutes}
    </Route>
  </Routes>
);

export default AppRoutes;
