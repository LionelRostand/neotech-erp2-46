
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const RentalRoutes = (
  <Route key="rentals" path="/modules/vehicle-rentals" element={<ModuleLayout moduleId={12} />}>
    <Route index element={<SubmodulePage moduleId={12} submoduleId="rentals-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={12} submoduleId="rentals-dashboard" />} />
    <Route path="vehicles" element={<SubmodulePage moduleId={12} submoduleId="rentals-vehicles" />} />
    <Route path="clients" element={<SubmodulePage moduleId={12} submoduleId="rentals-clients" />} />
    <Route path="reservations" element={<SubmodulePage moduleId={12} submoduleId="rentals-reservations" />} />
    <Route path="locations" element={<SubmodulePage moduleId={12} submoduleId="rentals-locations" />} />
    <Route path="billing" element={<SubmodulePage moduleId={12} submoduleId="rentals-billing" />} />
    <Route path="reports" element={<SubmodulePage moduleId={12} submoduleId="rentals-reports" />} />
    <Route path="settings" element={<SubmodulePage moduleId={12} submoduleId="rentals-settings" />} />
  </Route>
);
