
import React from 'react';
import EmployeesDashboard from '../EmployeesDashboard';
import EmployeesAttendance from '../EmployeesAttendance';
import EmployeesBadges from '../EmployeesBadges';
import EmployeesProfiles from '../employees/EmployeesProfiles';
import EmployeesHierarchy from '../employees/EmployeesHierarchy';
import EmployeesLeaves from '../employees/EmployeesLeaves';
import SalarySlips from '../salaries/SalarySlips';
import { SubModule } from '@/data/types/modules';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  const { employees, companies } = useHrModuleData();
  
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-attendance':
      return <EmployeesAttendance />;
    case 'employees-badges':
      return <EmployeesBadges />;
    case 'employees-profiles':
      return <EmployeesProfiles />;
    case 'employees-hierarchy':
      return <EmployeesHierarchy />;
    case 'employees-leaves':
      return <EmployeesLeaves />;
    case 'employees-salaries':
      return <SalarySlips employees={employees} companies={companies} />;
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
