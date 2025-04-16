
import React from 'react';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesProfiles from '../employees/EmployeesProfiles';
import EmployeesHierarchy from '../employees/EmployeesHierarchy';
import EmployeesLeaves from '../leaves/EmployeesLeaves';
import SalarySlips from '../salaries/SalarySlips';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesAbsences from '../absences/EmployeesAbsences';
import EmployeesContracts from '../contracts/EmployeesContracts';
import EmployeesDocuments from '../documents/EmployeesDocuments';
import EmployeesEvaluations from '../evaluations/EmployeesEvaluations';
import EmployeesTrainings from '../trainings/EmployeesTrainings';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesCompanies from '../employees/EmployeesCompanies';
import EmployeesReports from '../EmployeesReports';
import EmployeesAlerts from '../EmployeesAlerts';
import EmployeesSettings from '../settings/EmployeesSettings';
import { SubModule } from '@/data/types/modules';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import EmployeesDepartments from '../departments/EmployeesDepartments';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  const { employees, departments, companies, isLoading } = useHrModuleData();
  
  console.log(`Rendering employee submodule: ${submoduleId}`);
  console.log(`Loaded ${employees.length} employees from collection`);
  
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-profiles':
      return <EmployeesProfiles employees={employees} />;
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
      console.log('Rendering leaves component');
      return <EmployeesLeaves />;
    case 'employees-absences':
      return <EmployeesAbsences />;
    case 'employees-contracts':
      console.log('Rendering contracts component');
      return <EmployeesContracts />;
    case 'employees-documents':
      console.log('Rendering documents component');
      return <EmployeesDocuments />;
    case 'employees-evaluations':
      return <EmployeesEvaluations />;
    case 'employees-trainings':
      return <EmployeesTrainings />;
    case 'employees-salaries':
      return <SalarySlips />;
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-companies':
      return <EmployeesCompanies />;
    case 'employees-reports':
      return <EmployeesReports />;
    case 'employees-alerts':
      return <EmployeesAlerts />;
    case 'employees-settings':
      return <EmployeesSettings />;
    default:
      return (
        <div className="container mx-auto py-4">
          <h2 className="text-2xl font-bold">{submodule.name}</h2>
          <div className="p-4 mt-4 border border-gray-200 rounded-md">
            <p>Ce module est en cours de développement.</p>
          </div>
        </div>
      );
  }
};
