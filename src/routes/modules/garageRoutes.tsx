
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const GarageRoutes = (
  <Route key="garage" path="/modules/garage" element={<ModuleLayout moduleId={12} />}>
    <Route index element={<SubmodulePage moduleId={12} submoduleId="garage-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={12} submoduleId="garage-dashboard" />} />
    <Route path="scheduling" element={<SubmodulePage moduleId={12} submoduleId="garage-scheduling" />} />
    <Route path="inventory" element={<SubmodulePage moduleId={12} submoduleId="garage-inventory" />} />
    <Route path="repairs" element={<SubmodulePage moduleId={12} submoduleId="garage-repairs" />} />
    <Route path="customers" element={<SubmodulePage moduleId={12} submoduleId="garage-customers" />} />
    <Route path="reports" element={<SubmodulePage moduleId={12} submoduleId="garage-reports" />} />
    <Route path="settings" element={<SubmodulePage moduleId={12} submoduleId="garage-settings" />} />
  </Route>
);
