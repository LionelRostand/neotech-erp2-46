
import React from 'react';
import { Users, Building2, UserCheck, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeesDashboardCards = () => {
  const { employees = [], departments = [] } = useEmployeeData();
  
  // Calculate statistics with null checks to prevent errors
  const totalEmployees = employees?.length || 0;
  const activeDepartments = departments?.length || 0;
  const activeEmployees = employees?.filter(emp => emp?.status === 'active' || emp?.status === 'Actif')?.length || 0;
  const onLeave = employees?.filter(emp => emp?.status === 'onLeave' || emp?.status === 'En congé')?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Employés totaux"
        value={totalEmployees.toString()}
        icon={<Users className="h-6 w-6 text-blue-600" />}
        description="Nombre total d'employés"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      
      <StatCard
        title="Départements"
        value={activeDepartments.toString()}
        icon={<Building2 className="h-6 w-6 text-purple-600" />}
        description="Départements actifs"
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
      
      <StatCard
        title="Employés actifs"
        value={activeEmployees.toString()}
        icon={<UserCheck className="h-6 w-6 text-green-600" />}
        description="Employés en activité"
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      
      <StatCard
        title="En congé"
        value={onLeave.toString()}
        icon={<Calendar className="h-6 w-6 text-orange-600" />}
        description="Employés en congé"
        className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
      />
    </div>
  );
};

export default EmployeesDashboardCards;
