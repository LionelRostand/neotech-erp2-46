
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesHierarchy from '../EmployeesHierarchy';
import EmployeesProfiles from '../EmployeesProfiles';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesReports from '../EmployeesReports';
import EmployeesLeaves from '../EmployeesLeaves';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesSalaries from '../EmployeesSalaries';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesSettings from '../EmployeesSettings';
import { SubModule } from '@/data/types/modules';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
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
    case 'employees-reports':
      return <EmployeesReports />;
    // New employee submodules
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
    case 'employees-settings':
      return <EmployeesSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
