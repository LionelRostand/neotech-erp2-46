
import React from 'react';
import { Users, UserCheck, Calendar, UsersIcon } from 'lucide-react';
import StatCard from '../../../../StatCard';
import { Employee } from '@/types/employee';

interface EmployeesStatsProps {
  employees: Employee[];
}

const EmployeesStats: React.FC<EmployeesStatsProps> = ({ employees = [] }) => {
  // Ensure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  // Calculate employee statistics
  const totalEmployees = safeEmployees.length;
  const activeEmployees = safeEmployees.filter(emp => 
    emp.status === 'active' || emp.status === 'Actif'
  ).length;
  const onLeaveEmployees = safeEmployees.filter(emp => 
    emp.status === 'onLeave' || emp.status === 'En congé'
  ).length;
  const todayDate = new Date().toLocaleDateString('fr-FR');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Employés du jour"
        value={todayDate}
        icon={<Calendar className="h-5 w-5 text-blue-600" />}
        description={`${totalEmployees} employés au total`}
        className="bg-blue-50 border-blue-100"
      />
      
      <StatCard
        title="Employés actifs"
        value={activeEmployees.toString()}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        description="Employés en activité"
        className="bg-green-50 border-green-100"
      />
      
      <StatCard
        title="En congé"
        value={onLeaveEmployees.toString()}
        icon={<Calendar className="h-5 w-5 text-amber-600" />}
        description="Employés absents ou en congé"
        className="bg-amber-50 border-amber-100"
      />
      
      <StatCard
        title="Total employés"
        value={totalEmployees.toString()}
        icon={<Users className="h-5 w-5 text-purple-600" />}
        description="Effectif total de l'entreprise"
        className="bg-purple-50 border-purple-100"
      />
    </div>
  );
};

export default EmployeesStats;
