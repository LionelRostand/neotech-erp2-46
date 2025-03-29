
import React, { useState } from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesProfiles from '../employees/EmployeesList';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesLeaves from '../EmployeesLeaves';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesReports from '../EmployeesReports';
import EmployeesAlerts from '../EmployeesAlerts';
import EmployeesSettings from '../EmployeesSettings';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesHierarchy from '../EmployeesHierarchy';
import EmployeesCompanies from '../employees/EmployeesCompanies';
import { Employee } from '@/types/employee';

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "0123456789",
    department: "Développement",
    position: "Développeur Senior",
    contract: "CDI",
    hireDate: "01/02/2020",
    manager: "Sarah Martin",
    status: "Actif"
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Laurent",
    email: "marie.laurent@example.com",
    phone: "0123456788",
    department: "Marketing",
    position: "Chef de Produit",
    contract: "CDI",
    hireDate: "15/05/2019",
    manager: "Thomas Bernard",
    status: "Actif"
  },
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@example.com",
    phone: "0123456787",
    department: "Ressources Humaines",
    position: "Responsable RH",
    contract: "CDI",
    hireDate: "10/03/2021",
    status: "Actif"
  }
];

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering employee submodule:', submoduleId);
  
  // Mock functions for the EmployeesList component
  const handleEmployeeSearch = () => {};
  const handleViewEmployee = (employee: Employee) => {};
  const handleEditEmployee = (employee: Employee) => {};
  const handleDeleteEmployee = (employeeId: string) => {};
  const handleOpenAddEmployee = () => {};
  
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-profiles':
      return <EmployeesProfiles 
        employees={mockEmployees}
        searchQuery=""
        setSearchQuery={() => {}}
        onViewEmployee={handleViewEmployee}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onOpenAddEmployee={handleOpenAddEmployee}
      />;
    case 'employees-badges':
      return <EmployeesBadges />;
    case 'employees-departments':
      return <EmployeesDepartments />;
    case 'employees-hierarchy':
      return <EmployeesHierarchy />;
    case 'employees-attendance':
      return <EmployeesAttendance />;
    case 'employees-timesheet':
      return <EmployeesTimesheet />;
    case 'employees-leaves':
      return <EmployeesLeaves />;
    case 'employees-absences':
      return <EmployeesAbsences />;
    case 'employees-contracts':
      return <EmployeesContracts />;
    case 'employees-documents':
      return <EmployeesDocuments />;
    case 'employees-evaluations':
      return <EmployeesEvaluations />;
    case 'employees-trainings':
      return <EmployeesTrainings />;
    case 'employees-salaries':
      return <div>Salaires des employés</div>;
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-reports':
      return <EmployeesReports />;
    case 'employees-alerts':
      return <EmployeesAlerts />;
    case 'employees-settings':
      return <EmployeesSettings />;
    case 'employees-companies':
      return <EmployeesCompanies />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
