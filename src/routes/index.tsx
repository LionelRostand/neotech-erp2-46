
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '@/App';
import { DashboardWrapper } from './AppRoutes';
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <DashboardWrapper />,
      },
      ...(EmployeesRoutes.props?.children || []),
      ...(FreightRoutes.props?.children || []),
      ...(ProjectsRoutes.props?.children || []),
      ...(GarageRoutes.props?.children || []),
      ...(AccountingRoutes.props?.children || []),
      ...(MessagesRoutes.props?.children || []),
      ...(DocumentsRoutes.props?.children || []),
      ...(CrmRoutes.props?.children || []),
      ...(CompaniesRoutes.props?.children || []),
      ...(HealthRoutes.props?.children || []),
      ...(RentalRoutes.props?.children || []),
      ...(TransportRoutes.props?.children || []),
      ...OtherModulesRoutes,
      ...AuthRoutes,
      ...SettingsRoutes,
    ],
  },
]);
