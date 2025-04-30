
import React from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { DataTable } from '@/components/ui/data-table';
import EmployeesDashboardCards from './employees/dashboard/EmployeesDashboardCards';
import EmployeesProfiles from './employees/EmployeesProfiles';

const EmployeesDashboard = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord RH</h1>
      
      {/* Carte statistiques */}
      <EmployeesDashboardCards />
      
      {/* Liste des employés */}
      <EmployeesProfiles employees={employees} isLoading={isLoading} />
    </div>
  );
};

export default EmployeesDashboard;
