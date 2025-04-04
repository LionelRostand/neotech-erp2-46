
import React from 'react';
import { SubModule } from '@/data/types/modules';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesProfiles from '../EmployeesProfiles';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesContracts from '../EmployeesContracts';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesTimesheet from '../EmployeesTimesheet';
import EmployeesRecruitment from '../EmployeesRecruitment';
import EmployeesReports from '../EmployeesReports';
import EmployeesAlerts from '../EmployeesAlerts';
import EmployeesAbsences from '../EmployeesAbsences';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesLeaves from '../EmployeesLeaves';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesCompanies from '../employees/EmployeesCompanies';

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
    
    case 'employees-contracts':
      return <EmployeesContracts />;
    
    case 'employees-attendance':
      return <EmployeesAttendance />;
    
    case 'employees-timesheet':
      return <EmployeesTimesheet />;
    
    case 'employees-leaves':
      return <EmployeesLeaves />;
    
    case 'employees-absences':
      return <EmployeesAbsences />;

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
      return <div>Module {submodule.name} en cours de développement</div>;
  }
};
