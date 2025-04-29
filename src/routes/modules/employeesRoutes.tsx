
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SalarySlips from "@/components/module/submodules/salaries/SalarySlips";
import EmployeesDepartments from "@/components/module/submodules/departments/EmployeesDepartments";
import EmployeesLeaves from "@/components/module/submodules/leaves/EmployeesLeaves";
import EmployeesProfiles from "@/components/module/submodules/employees/EmployeesProfiles";
import EmployeesHierarchy from "@/components/module/submodules/employees/hierarchy/EmployeesHierarchy";
import EmployeesRecruitment from "@/components/module/submodules/EmployeesRecruitment";
import EmployeesBadges from "@/components/module/submodules/employees/EmployeesBadges";
import EmployeesAttendance from "@/components/module/submodules/EmployeesAttendance";
import EmployeesDashboard from "@/components/module/submodules/EmployeesDashboard";
import EmployeesTimesheet from "@/components/module/submodules/EmployeesTimesheet";
import EmployeesContracts from "@/components/module/submodules/contracts/EmployeesContracts";
import EmployeesDocuments from "@/components/module/submodules/documents/EmployeesDocuments";
import EmployeesEvaluations from "@/components/module/submodules/evaluations/EmployeesEvaluations";
import EmployeesTrainings from "@/components/module/submodules/trainings/EmployeesTrainings";
import EmployeesCompanies from "@/components/module/submodules/employees/EmployeesCompanies";
import EmployeesReports from "@/components/module/submodules/EmployeesReports";
import EmployeesAlerts from "@/components/module/submodules/EmployeesAlerts";
import EmployeesSettings from "@/components/module/submodules/settings/EmployeesSettings";

// Don't use hooks directly in the routes file - that can cause inconsistent hook calls
// Instead, use wrapper components that properly handle data loading

// Helper component to encapsulate data loading for EmployeesProfiles
const EmployeesProfilesWithData = () => {
  return <EmployeesProfiles />;
};

// Helper component to encapsulate data loading for EmployeesDepartments
const EmployeesDepartmentsWithData = () => {
  return <EmployeesDepartments />;
};

export const EmployeesRoutes = (
  <Route key="employees" path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
    <Route index element={<EmployeesDashboard />} />
    <Route path="dashboard" element={<EmployeesDashboard />} />
    <Route path="profiles" element={<EmployeesProfilesWithData />} />
    <Route path="badges" element={<EmployeesBadges />} />
    <Route path="departments" element={<EmployeesDepartmentsWithData />} />
    <Route path="hierarchy" element={<EmployeesHierarchy />} />
    <Route path="attendance" element={<EmployeesAttendance />} />
    <Route path="timesheet" element={<EmployeesTimesheet />} />
    <Route path="leaves" element={<EmployeesLeaves />} />
    <Route path="contracts" element={<EmployeesContracts />} />
    <Route path="documents" element={<EmployeesDocuments />} />
    <Route path="evaluations" element={<EmployeesEvaluations />} />
    <Route path="trainings" element={<EmployeesTrainings />} />
    <Route path="salaries" element={<SalarySlips />} />
    <Route path="recruitment" element={<EmployeesRecruitment />} />
    <Route path="companies" element={<EmployeesCompanies />} />
    <Route path="reports" element={<EmployeesReports />} />
    <Route path="alerts" element={<EmployeesAlerts />} />
    <Route path="settings" element={<EmployeesSettings />} />
  </Route>
);
