
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '@/App';
import Dashboard from '@/components/dashboard/ModulesList'; // Using ModulesList as the dashboard page
import { EmployeesRoutes } from './modules/employeesRoutes';
import { FreightRoutes } from './modules/freightRoutes';
import { ProjectsRoutes } from './modules/projectsRoutes';
import { GarageRoutes } from './modules/garageRoutes';
import { OtherModulesRoutes } from './modules/otherModulesRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      EmployeesRoutes,
      FreightRoutes,
      ProjectsRoutes,
      GarageRoutes,
      ...OtherModulesRoutes,
    ],
  },
]);
