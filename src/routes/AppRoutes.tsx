
import React from 'react';
import { Outlet } from "react-router-dom";
import Dashboard from '@/components/dashboard/ModulesList';
import { modules } from '@/data/modules';

// Create a simple dashboard wrapper that provides the required props
export const DashboardWrapper = () => {
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
  <Outlet />
);

export default AppRoutes;
