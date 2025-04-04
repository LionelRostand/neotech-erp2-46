
import React from 'react';
import { SubModule } from '@/data/types/modules';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesAlerts from '../EmployeesAlerts';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesLeaves from '../employees/EmployeesLeaves';
import EmployeesReports from '../EmployeesReports';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesProfiles from '../employees/EmployeesProfiles';
import EmployeesCompanies from '../employees/EmployeesCompanies';
import EmployeesHierarchy from '../employees/EmployeesHierarchy';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesRecruitment from '../EmployeesRecruitment';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering submodule:', submoduleId);
  
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
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-reports':
      return <EmployeesReports />;
    case 'employees-alerts':
      return <EmployeesAlerts />;
    case 'employees-companies':
      return <EmployeesCompanies />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
