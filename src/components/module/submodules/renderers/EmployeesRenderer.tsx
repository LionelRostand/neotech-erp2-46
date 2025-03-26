
import React from 'react';
import { SubModule } from '@/data/types/modules';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesProfiles from '../EmployeesProfiles';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesHierarchy from '../EmployeesHierarchy';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesLeaves from '../EmployeesLeaves';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesSalaries from '../EmployeesSalaries';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesReports from '../EmployeesReports';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule, refreshKey?: number) => {
  console.log(`Rendering employees submodule: ${submoduleId}`);
  
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
      return <EmployeesHierarchy key={refreshKey} />;
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
      return <EmployeesSalaries />;
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-reports':
      return <EmployeesReports />;
    default:
      return <div>Submodule not implemented: {submoduleId}</div>;
  }
};
