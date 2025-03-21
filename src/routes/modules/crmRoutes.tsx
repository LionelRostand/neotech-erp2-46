
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const CrmRoutes = (
  <Route key="crm" path="/modules/crm" element={<ModuleLayout moduleId={17} />}>
    <Route index element={<SubmodulePage moduleId={17} submoduleId="crm-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={17} submoduleId="crm-dashboard" />} />
    <Route path="clients" element={<SubmodulePage moduleId={17} submoduleId="crm-clients" />} />
    <Route path="prospects" element={<SubmodulePage moduleId={17} submoduleId="crm-prospects" />} />
    <Route path="opportunities" element={<SubmodulePage moduleId={17} submoduleId="crm-opportunities" />} />
    <Route path="analytics" element={<SubmodulePage moduleId={17} submoduleId="crm-analytics" />} />
    <Route path="settings" element={<SubmodulePage moduleId={17} submoduleId="crm-settings" />} />
  </Route>
);
