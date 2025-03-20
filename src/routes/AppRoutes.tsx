import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Welcome from "@/pages/Welcome";
import Applications from "@/pages/Applications";
import UserProfile from "@/pages/UserProfile";
import ModuleInfo from "@/pages/ModuleInfo";
import UserPermissions from "@/components/settings/UserPermissions";
import Translation from "@/components/settings/Translation";
import SmtpConfig from "@/components/settings/SmtpConfig";
import TwoFactorSettings from "@/components/settings/TwoFactorSettings";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Index />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/module-info" element={<ModuleInfo />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/profile" element={<UserProfile />} />
    
    {/* Redirect /dashboard to / */}
    <Route path="/dashboard" element={<Navigate to="/" replace />} />
    
    {/* Settings routes - redirect from /settings to the first settings page */}
    <Route path="/settings" element={<Navigate to="/settings/user-permissions" replace />} />
    <Route path="/settings/user-permissions" element={<UserPermissions />} />
    <Route path="/settings/translation" element={<Translation />} />
    <Route path="/settings/smtp" element={<SmtpConfig />} />
    <Route path="/settings/2fa" element={<TwoFactorSettings />} />
    
    {/* Routes with ModuleLayout for all modules */}
    <Route path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
      <Route index element={<SubmodulePage moduleId={1} submoduleId="employees-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={1} submoduleId="employees-dashboard" />} />
      <Route path="profiles" element={<SubmodulePage moduleId={1} submoduleId="employees-profiles" />} />
      <Route path="badges" element={<SubmodulePage moduleId={1} submoduleId="employees-badges" />} />
      <Route path="departments" element={<SubmodulePage moduleId={1} submoduleId="employees-departments" />} />
      <Route path="hierarchy" element={<SubmodulePage moduleId={1} submoduleId="employees-hierarchy" />} />
      <Route path="attendance" element={<SubmodulePage moduleId={1} submoduleId="employees-attendance" />} />
      <Route path="timesheet" element={<SubmodulePage moduleId={1} submoduleId="employees-timesheet" />} />
      <Route path="leaves" element={<SubmodulePage moduleId={1} submoduleId="employees-leaves" />} />
      <Route path="absences" element={<SubmodulePage moduleId={1} submoduleId="employees-absences" />} />
      <Route path="contracts" element={<SubmodulePage moduleId={1} submoduleId="employees-contracts" />} />
      <Route path="documents" element={<SubmodulePage moduleId={1} submoduleId="employees-documents" />} />
      <Route path="evaluations" element={<SubmodulePage moduleId={1} submoduleId="employees-evaluations" />} />
      <Route path="trainings" element={<SubmodulePage moduleId={1} submoduleId="employees-trainings" />} />
      <Route path="salaries" element={<SubmodulePage moduleId={1} submoduleId="employees-salaries" />} />
      <Route path="recruitment" element={<SubmodulePage moduleId={1} submoduleId="employees-recruitment" />} />
      <Route path="reports" element={<SubmodulePage moduleId={1} submoduleId="employees-reports" />} />
      <Route path="alerts" element={<SubmodulePage moduleId={1} submoduleId="employees-alerts" />} />
      <Route path="settings" element={<SubmodulePage moduleId={1} submoduleId="employees-settings" />} />
    </Route>
    
    <Route path="/modules/freight" element={<ModuleLayout moduleId={2} />}>
      <Route index element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
      <Route path="shipments" element={<SubmodulePage moduleId={2} submoduleId="freight-shipments" />} />
      <Route path="containers" element={<SubmodulePage moduleId={2} submoduleId="freight-containers" />} />
      <Route path="carriers" element={<SubmodulePage moduleId={2} submoduleId="freight-carriers" />} />
      <Route path="tracking" element={<SubmodulePage moduleId={2} submoduleId="freight-tracking" />} />
      <Route path="pricing" element={<SubmodulePage moduleId={2} submoduleId="freight-pricing" />} />
      <Route path="documents" element={<SubmodulePage moduleId={2} submoduleId="freight-documents" />} />
      <Route path="client-portal" element={<SubmodulePage moduleId={2} submoduleId="freight-client-portal" />} />
      <Route path="settings" element={<SubmodulePage moduleId={2} submoduleId="freight-settings" />} />
    </Route>
    
    {/* Route pour le module Projects */}
    <Route path="/modules/projects" element={<ModuleLayout moduleId={3} />}>
      <Route index element={<SubmodulePage moduleId={3} submoduleId="projects-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={3} submoduleId="projects-dashboard" />} />
      <Route path="list" element={<SubmodulePage moduleId={3} submoduleId="projects-list" />} />
      <Route path="tasks" element={<SubmodulePage moduleId={3} submoduleId="projects-tasks" />} />
      <Route path="teams" element={<SubmodulePage moduleId={3} submoduleId="projects-teams" />} />
      <Route path="reports" element={<SubmodulePage moduleId={3} submoduleId="projects-reports" />} />
      <Route path="settings" element={<SubmodulePage moduleId={3} submoduleId="projects-settings" />} />
    </Route>
    
    {/* Route pour le module Accounting */}
    <Route path="/modules/accounting" element={<ModuleLayout moduleId={9} />}>
      <Route index element={<SubmodulePage moduleId={9} submoduleId="accounting-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={9} submoduleId="accounting-dashboard" />} />
      <Route path="invoices" element={<SubmodulePage moduleId={9} submoduleId="accounting-invoices" />} />
      <Route path="payments" element={<SubmodulePage moduleId={9} submoduleId="accounting-payments" />} />
      <Route path="taxes" element={<SubmodulePage moduleId={9} submoduleId="accounting-taxes" />} />
      <Route path="reports" element={<SubmodulePage moduleId={9} submoduleId="accounting-reports" />} />
      <Route path="settings" element={<SubmodulePage moduleId={9} submoduleId="accounting-settings" />} />
    </Route>
    
    {/* Route pour le module Messages */}
    <Route path="/modules/messages" element={<ModuleLayout moduleId={13} />}>
      <Route index element={<SubmodulePage moduleId={13} submoduleId="messages-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={13} submoduleId="messages-dashboard" />} />
      <Route path="contacts" element={<SubmodulePage moduleId={13} submoduleId="messages-contacts" />} />
      <Route path="compose" element={<SubmodulePage moduleId={13} submoduleId="messages-compose" />} />
      <Route path="inbox" element={<SubmodulePage moduleId={13} submoduleId="messages-inbox" />} />
      <Route path="archive" element={<SubmodulePage moduleId={13} submoduleId="messages-archive" />} />
      <Route path="scheduled" element={<SubmodulePage moduleId={13} submoduleId="messages-scheduled" />} />
      <Route path="settings" element={<SubmodulePage moduleId={13} submoduleId="messages-settings" />} />
    </Route>
    
    {/* Route pour le module Documents */}
    <Route path="/modules/documents" element={<ModuleLayout moduleId={16} />}>
      <Route index element={<SubmodulePage moduleId={16} submoduleId="documents-files" />} />
      <Route path="files" element={<SubmodulePage moduleId={16} submoduleId="documents-files" />} />
      <Route path="archive" element={<SubmodulePage moduleId={16} submoduleId="documents-archive" />} />
      <Route path="search" element={<SubmodulePage moduleId={16} submoduleId="documents-search" />} />
      <Route path="settings" element={<SubmodulePage moduleId={16} submoduleId="documents-settings" />} />
    </Route>
    
    {/* Route pour le module CRM */}
    <Route path="/modules/crm" element={<ModuleLayout moduleId={17} />}>
      <Route index element={<SubmodulePage moduleId={17} submoduleId="crm-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={17} submoduleId="crm-dashboard" />} />
      <Route path="clients" element={<SubmodulePage moduleId={17} submoduleId="crm-clients" />} />
      <Route path="prospects" element={<SubmodulePage moduleId={17} submoduleId="crm-prospects" />} />
      <Route path="opportunities" element={<SubmodulePage moduleId={17} submoduleId="crm-opportunities" />} />
      <Route path="analytics" element={<SubmodulePage moduleId={17} submoduleId="crm-analytics" />} />
      <Route path="settings" element={<SubmodulePage moduleId={17} submoduleId="crm-settings" />} />
    </Route>
    
    {/* Route pour le module Entreprises */}
    <Route path="/modules/companies" element={<ModuleLayout moduleId={18} />}>
      <Route index element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
      <Route path="list" element={<SubmodulePage moduleId={18} submoduleId="companies-list" />} />
      <Route path="create" element={<SubmodulePage moduleId={18} submoduleId="companies-create" />} />
      <Route path="contacts" element={<SubmodulePage moduleId={18} submoduleId="companies-contacts" />} />
      <Route path="documents" element={<SubmodulePage moduleId={18} submoduleId="companies-documents" />} />
      <Route path="reports" element={<SubmodulePage moduleId={18} submoduleId="companies-reports" />} />
      <Route path="settings" element={<SubmodulePage moduleId={18} submoduleId="companies-settings" />} />
    </Route>
    
    {/* Routes pour le module Health avec tous les sous-modules */}
    <Route path="/modules/health" element={<ModuleLayout moduleId={8} />}>
      <Route index element={<SubmodulePage moduleId={8} submoduleId="health-dashboard" />} />
      <Route path="dashboard" element={<SubmodulePage moduleId={8} submoduleId="health-dashboard" />} />
      <Route path="patients" element={<SubmodulePage moduleId={8} submoduleId="health-patients" />} />
      <Route path="appointments" element={<SubmodulePage moduleId={8} submoduleId="health-appointments" />} />
      <Route path="doctors" element={<SubmodulePage moduleId={8} submoduleId="health-doctors" />} />
      <Route path="nurses" element={<SubmodulePage moduleId={8} submoduleId="health-nurses" />} />
      <Route path="consultations" element={<SubmodulePage moduleId={8} submoduleId="health-consultations" />} />
      <Route path="medical-records" element={<SubmodulePage moduleId={8} submoduleId="health-medical-records" />} />
      <Route path="laboratory" element={<SubmodulePage moduleId={8} submoduleId="health-laboratory" />} />
      <Route path="prescriptions" element={<SubmodulePage moduleId={8} submoduleId="health-prescriptions" />} />
      <Route path="pharmacy" element={<SubmodulePage moduleId={8} submoduleId="health-pharmacy" />} />
      <Route path="admissions" element={<SubmodulePage moduleId={8} submoduleId="health-admissions" />} />
      <Route path="rooms" element={<SubmodulePage moduleId={8} submoduleId="health-rooms" />} />
      <Route path="billing" element={<SubmodulePage moduleId={8} submoduleId="health-billing" />} />
      <Route path="insurance" element={<SubmodulePage moduleId={8} submoduleId="health-insurance" />} />
      <Route path="stats" element={<SubmodulePage moduleId={8} submoduleId="health-stats" />} />
      <Route path="integrations" element={<SubmodulePage moduleId={8} submoduleId="health-integrations" />} />
      <Route path="settings" element={<SubmodulePage moduleId={8} submoduleId="health-settings" />} />
    </Route>
    
    {/* Generic routes for other modules */}
    <Route path="/modules/academy/*" element={<ModuleLayout moduleId={4} />} />
    <Route path="/modules/restaurant/*" element={<ModuleLayout moduleId={5} />} />
    <Route path="/modules/garage/*" element={<ModuleLayout moduleId={6} />} />
    <Route path="/modules/transport/*" element={<ModuleLayout moduleId={7} />} />
    <Route path="/modules/ecommerce/*" element={<ModuleLayout moduleId={10} />} />
    
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
