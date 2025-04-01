import React from 'react';
import { Routes } from "react-router-dom";

// Import route modules
import { IndexRoutes } from './modules/indexRoutes';
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
import { OtherModulesRoutes } from './modules/otherModulesRoutes';
import { WebsiteRoutes } from './modules/websiteRoutes';

const AppRoutes = () => (
  <Routes>
    {/* Auth routes */}
    {AuthRoutes}
    
    {/* Main application routes */}
    {IndexRoutes}
    
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
    {WebsiteRoutes}
    
    {/* Other module routes */}
    {OtherModulesRoutes}
  </Routes>
);

export default AppRoutes;
