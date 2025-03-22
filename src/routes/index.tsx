import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '@/App';
import Dashboard from '@/components/dashboard/ModulesList';
import { modules } from '@/data/modules';
import { EmployeesRoutes } from './modules/employeesRoutes';
import { FreightRoutes } from './modules/freightRoutes';
import { ProjectsRoutes } from './modules/projectsRoutes';
import { GarageRoutes } from './modules/garageRoutes';
import { OtherModulesRoutes } from './modules/otherModulesRoutes';
import { AuthRoutes } from './modules/authRoutes';
import { SettingsRoutes } from './modules/settingsRoutes';
import { AccountingRoutes } from './modules/accountingRoutes';
import { MessagesRoutes } from './modules/messagesRoutes';
import { DocumentsRoutes } from './modules/documentsRoutes';
import { CrmRoutes } from './modules/crmRoutes';
import { CompaniesRoutes } from './modules/companiesRoutes';
import { HealthRoutes } from './modules/healthRoutes';
import { RentalRoutes } from './modules/rentalRoutes';
import { TransportRoutes } from './modules/transportRoutes';

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <DashboardWrapper />,
      },
      // Auth routes
      ...(AuthRoutes.props?.children || []),
      
      // Settings routes
      ...(SettingsRoutes.props?.children || []),
      
      // Module routes
      ...(EmployeesRoutes.props?.children || []),
      ...(FreightRoutes.props?.children || []),
      ...(ProjectsRoutes.props?.children || []),
      ...(AccountingRoutes.props?.children || []),
      ...(MessagesRoutes.props?.children || []),
      ...(DocumentsRoutes.props?.children || []),
      ...(CrmRoutes.props?.children || []),
      ...(CompaniesRoutes.props?.children || []),
      ...(HealthRoutes.props?.children || []),
      ...(RentalRoutes.props?.children || []),
      ...(TransportRoutes.props?.children || []),
      ...(GarageRoutes.props?.children || []),
      
      // Other module routes
      ...(OtherModulesRoutes || []),
    ],
  },
]);
