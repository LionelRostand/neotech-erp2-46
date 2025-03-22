
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
      ...EmployeesRoutes.props.children,
      ...FreightRoutes.props.children,
      ...ProjectsRoutes.props.children,
      ...GarageRoutes.props.children,
      ...OtherModulesRoutes,
    ],
  },
]);
