
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SalarySlips from "@/components/module/submodules/salaries/SalarySlips";
import EmployeesDepartments from "@/components/module/submodules/departments/EmployeesDepartments";
import EmployeesLeaves from "@/components/module/submodules/leaves/EmployeesLeaves";
import EmployeesProfiles from "@/components/module/submodules/employees/EmployeesProfiles";
import EmployeesHierarchy from "@/components/module/submodules/employees/EmployeesHierarchy";
import EmployeesRecruitment from "@/components/module/submodules/EmployeesRecruitment";
import EmployeesBadges from "@/components/module/submodules/employees/EmployeesBadges";
import EmployeesAttendance from "@/components/module/submodules/EmployeesAttendance";
import EmployeesDashboard from "@/components/module/submodules/EmployeesDashboard";
import EmployeesTimesheet from "@/components/module/submodules/EmployeesTimesheet";
import EmployeesAbsences from "@/components/module/submodules/absences/EmployeesAbsences";
import EmployeesContracts from "@/components/module/submodules/contracts/EmployeesContracts";
import EmployeesDocuments from "@/components/module/submodules/documents/EmployeesDocuments";
import EmployeesEvaluations from "@/components/module/submodules/evaluations/EmployeesEvaluations";
import EmployeesTrainings from "@/components/module/submodules/trainings/EmployeesTrainings";
import EmployeesCompanies from "@/components/module/submodules/employees/EmployeesCompanies";
import EmployeesReports from "@/components/module/submodules/EmployeesReports";
import EmployeesAlerts from "@/components/module/submodules/EmployeesAlerts";
import EmployeesSettings from "@/components/module/submodules/settings/EmployeesSettings";
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Employee } from '@/types/employee';
import EmployeeDetails from "@/components/module/submodules/employees/EmployeeDetails";

// Helper component to pass props to EmployeesProfiles
const EmployeesProfilesWithData = () => {
  const { employees } = useHrModuleData();
  return <EmployeesProfiles employeesProp={employees} />;
};

// Helper component to pass employee to EmployeeDetails
const EmployeeDetailsWithData = () => {
  // Create a mock employee or use a real one from a hook if available
  const mockEmployee: Employee = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123456789",
    position: "Developer",
    department: "IT",
    departmentId: "IT",
    photo: "",
    photoURL: "",
    hireDate: "2023-01-01",
    startDate: "2023-01-01",
    status: "active",
    address: {
      street: "123 Main St",
      city: "Paris",
      postalCode: "75000",
      country: "France"
    },
    contract: "CDI",
    socialSecurityNumber: "123456789",
    birthDate: "1990-01-01",
    documents: [],
    company: "Company",
    role: "Developer",
    title: "Senior Developer",
    manager: "",
    managerId: "",
    professionalEmail: "john.doe@example.com",
    skills: [],
    education: [],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    },
    payslips: [],
  };
  
  return <EmployeeDetails employee={mockEmployee} />;
};

export const EmployeesRoutes = (
  <Route key="employees" path="/modules/employees" element={<ModuleLayout moduleId={1} />}>
    <Route index element={<EmployeesDashboard />} />
    <Route path="dashboard" element={<EmployeesDashboard />} />
    <Route path="profiles" element={<EmployeesProfilesWithData />} />
    <Route path="profiles/:id" element={<EmployeeDetailsWithData />} />
    <Route path="badges" element={<EmployeesBadges />} />
    <Route path="departments" element={<EmployeesDepartments />} />
    <Route path="hierarchy" element={<EmployeesHierarchy />} />
    <Route path="attendance" element={<EmployeesAttendance />} />
    <Route path="timesheet" element={<EmployeesTimesheet />} />
    <Route path="leaves" element={<EmployeesLeaves />} />
    <Route path="absences" element={<EmployeesAbsences />} />
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
