
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import CrmSettings from "@/components/module/submodules/crm/CrmSettings";
import CrmClients from "@/components/module/submodules/crm/CrmClients";
import CrmProspects from "@/components/module/submodules/crm/CrmProspects";
import CrmOpportunities from "@/components/module/submodules/crm/CrmOpportunities";
import CrmDashboard from "@/components/module/submodules/crm/CrmDashboard";
import CrmAnalytics from "@/components/module/submodules/crm/CrmAnalytics";

export const CrmRoutes = (
  <Route key="crm" path="/modules/crm" element={<ModuleLayout moduleId={17} />}>
    <Route index element={<CrmDashboard />} />
    <Route path="dashboard" element={<CrmDashboard />} />
    <Route path="clients" element={<CrmClients />} />
    <Route path="prospects" element={<CrmProspects />} />
    <Route path="opportunities" element={<CrmOpportunities />} />
    <Route path="analytics" element={<CrmAnalytics />} />
    <Route path="settings" element={<CrmSettings />} />
  </Route>
);
