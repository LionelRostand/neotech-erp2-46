import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const GarageRoutes = (
  <Route key="garage" path="/modules/garage" element={<ModuleLayout moduleId={6} />}>
    <Route index element={<SubmodulePage moduleId={6} submoduleId="garage-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={6} submoduleId="garage-dashboard" />} />
    <Route path="clients" element={<SubmodulePage moduleId={6} submoduleId="garage-clients" />} />
    <Route path="vehicles" element={<SubmodulePage moduleId={6} submoduleId="garage-vehicles" />} />
    <Route path="appointments" element={<SubmodulePage moduleId={6} submoduleId="garage-appointments" />} />
    <Route path="repairs" element={<SubmodulePage moduleId={6} submoduleId="garage-repairs" />} />
    <Route path="invoices" element={<SubmodulePage moduleId={6} submoduleId="garage-invoices" />} />
    <Route path="suppliers" element={<SubmodulePage moduleId={6} submoduleId="garage-suppliers" />} />
    <Route path="inventory" element={<SubmodulePage moduleId={6} submoduleId="garage-inventory" />} />
    <Route path="loyalty" element={<SubmodulePage moduleId={6} submoduleId="garage-loyalty" />} />
    <Route path="settings" element={<SubmodulePage moduleId={6} submoduleId="garage-settings" />} />
    <Route path="services" element={<SubmodulePage moduleId={6} submoduleId="garage-services" />} />
    <Route path="mechanics" element={<SubmodulePage moduleId={6} submoduleId="garage-mechanics" />} />
  </Route>
);
