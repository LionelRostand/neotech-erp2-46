
import React from 'react';
import { Users, Building2, UserCheck } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface EmployeesStatsProps {
  employees: Employee[];
}

const EmployeesStats: React.FC<EmployeesStatsProps> = ({ employees = [] }) => {
  const { departments = [] } = useEmployeeData();
  
  // Ensure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  // Calculate employee statistics
  const totalEmployees = safeEmployees.length;
  const activeEmployees = safeEmployees.filter(emp => 
    emp.status === 'active' || emp.status === 'Actif'
  ).length;
  const totalDepartments = departments.length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Employés totaux"
        value={totalEmployees.toString()}
        icon={<Users className="h-5 w-5 text-blue-600" />}
        description={`Effectif total de l'entreprise`}
        className="bg-blue-50 border-blue-100"
      />
      
      <StatCard
        title="Départements actifs"
        value={totalDepartments.toString()}
        icon={<Building2 className="h-5 w-5 text-purple-600" />}
        description="Départements avec employés"
        className="bg-purple-50 border-purple-100"
      />
      
      <StatCard
        title="Employés actifs"
        value={activeEmployees.toString()}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        description="Employés en activité"
        className="bg-green-50 border-green-100"
      />
    </div>
  );
};

export default EmployeesStats;
