
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SalarySlips from "@/components/module/submodules/salaries/SalarySlips";
import EmployeesDepartments from "@/components/module/submodules/departments/EmployeesDepartments";
import EmployeesLeaves from "@/components/module/submodules/leaves/EmployeesLeaves";
import EmployeesProfiles from "@/components/module/submodules/employees/EmployeesProfiles";
import EmployeesManagement from "@/components/module/submodules/employees/EmployeesManagement";
import EmployeesHierarchy from "@/components/module/submodules/employees/EmployeesHierarchy";
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
import { useEmployeeData } from '@/hooks/useEmployeeData';

// Helper component to pass props to EmployeesProfiles
const EmployeesProfilesWithProps = () => {
  const { employees, isLoading, error } = useEmployeeData();
  
  // Handle loading state if needed
  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des données...</div>;
  }
  
  // Handle error state if needed
  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded-md">Une erreur est survenue : {error.message}</div>;
  }
  
  return <EmployeesProfiles employees={employees || []} />;
};

export const EmployeesRoutes = (
  <Route key="employees" path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
    <Route index element={<EmployeesDashboard />} />
    <Route path="dashboard" element={<EmployeesDashboard />} />
    <Route path="management" element={<EmployeesManagement />} />
    <Route path="profiles" element={<EmployeesProfilesWithProps />} />
    <Route path="badges" element={<EmployeesBadges />} />
    <Route path="departments" element={<EmployeesDepartments />} />
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
