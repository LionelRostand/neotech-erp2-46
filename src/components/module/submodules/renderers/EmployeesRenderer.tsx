
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesProfiles from '../employees/EmployeesProfiles';
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
import EmployeesDepartments from '../EmployeesDepartments';
import EmployeesHierarchy from '../EmployeesHierarchy';
import EmployeesCompanies from '../employees/EmployeesCompanies';
import SalarySlips from '../salaries/SalarySlips';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering employee submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-profiles':
      return <EmployeesProfiles />;
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
      return <SalarySlips />;
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
