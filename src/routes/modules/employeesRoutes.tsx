
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import SalarySlips from "@/components/module/submodules/salaries/SalarySlips";

export const EmployeesRoutes = (
  <Route key="employees" path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
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
);
