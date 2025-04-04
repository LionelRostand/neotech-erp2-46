
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
import EmployeesLeaves from '../employees/EmployeesLeaves';
import EmployeesDepartments from '../departments/EmployeesDepartments';
import EmployeesCompanies from '../employees/EmployeesCompanies';
import SalarySlips from '../salaries/SalarySlips';
import PaySlipGenerator from '../salaries/PaySlipGenerator';

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
    
    case 'employees-salaries':
      return (
        <Tabs defaultValue="fiches" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md mb-4">
            <TabsTrigger value="fiches">Fiches de paie</TabsTrigger>
            <TabsTrigger value="generation">Génération de bulletins</TabsTrigger>
          </TabsList>
          <TabsContent value="fiches" className="mt-0">
            <SalarySlips />
          </TabsContent>
          <TabsContent value="generation" className="mt-0">
            <PaySlipGenerator />
          </TabsContent>
        </Tabs>
      );
    
    default:
      return <div>Module {submodule.name} en cours de développement</div>;
  }
};

// Need to add the import for Tabs at the top
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
