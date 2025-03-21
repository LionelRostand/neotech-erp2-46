
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const HealthRoutes = (
  <Route key="health" path="/modules/health" element={<ModuleLayout moduleId={8} />}>
    <Route index element={<SubmodulePage moduleId={8} submoduleId="health-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={8} submoduleId="health-dashboard" />} />
    <Route path="patients" element={<SubmodulePage moduleId={8} submoduleId="health-patients" />} />
    <Route path="appointments" element={<SubmodulePage moduleId={8} submoduleId="health-appointments" />} />
    <Route path="doctors" element={<SubmodulePage moduleId={8} submoduleId="health-doctors" />} />
    <Route path="nurses" element={<SubmodulePage moduleId={8} submoduleId="health-nurses" />} />
    <Route path="staff" element={<SubmodulePage moduleId={8} submoduleId="health-staff" />} />
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
);
