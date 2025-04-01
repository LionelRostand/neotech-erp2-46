
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const GarageRoutes = (
  <Route key="garage" path="/modules/garage" element={<ModuleLayout moduleId={11} />}>
    <Route index element={<SubmodulePage moduleId={11} submoduleId="garage-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={11} submoduleId="garage-dashboard" />} />
    <Route path="vehicles" element={<SubmodulePage moduleId={11} submoduleId="garage-vehicles" />} />
    <Route path="maintenance" element={<SubmodulePage moduleId={11} submoduleId="garage-maintenance" />} />
    <Route path="service" element={<SubmodulePage moduleId={11} submoduleId="garage-service" />} />
  </Route>
);
