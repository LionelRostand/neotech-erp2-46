
import React from 'react';
import { SubModule } from '@/data/types/modules';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesProfiles from '../EmployeesProfiles';
import EmployeesDepartments from '../EmployeesDepartments';
import EmployeesLeaves from '../EmployeesLeaves';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesAlerts from '../EmployeesAlerts';
import EmployeesReports from '../EmployeesReports';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import SalarySlips from '../salaries/SalarySlips';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-profiles':
      return <EmployeesProfiles />;
    case 'employees-departments':
      return <EmployeesDepartments />;
    case 'employees-leaves':
      return <EmployeesLeaves />;
    case 'employees-absences':
      return <EmployeesAbsences />;
    case 'employees-attendance':
      return <EmployeesAttendance />;
    case 'employees-contracts':
      return <EmployeesContracts />;
    case 'employees-documents':
      return <EmployeesDocuments />;
    case 'employees-trainings':
      return <EmployeesTrainings />;
    case 'employees-evaluations':
      return <EmployeesEvaluations />;
    case 'employees-timesheet':
      return <EmployeesTimesheet />;
    case 'employees-badges':
      return <EmployeesBadges />;
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-alerts':
      return <EmployeesAlerts />;
    case 'employees-reports':
      return <EmployeesReports />;
    case 'employees-salaries':
      return <SalarySlips />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
