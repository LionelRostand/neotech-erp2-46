
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Users, UserCheck, UserMinus, Calendar } from 'lucide-react';

const EmployeesDashboardCards: React.FC = () => {
  const { employees } = useHrModuleData();
  
  // Calculer les statistiques
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active' || e.status === 'Actif').length;
  const inactiveEmployees = employees.filter(e => e.status === 'inactive' || e.status === 'Inactif').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'onLeave' || e.status === 'En congé').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total employés</p>
            <h3 className="text-2xl font-bold">{totalEmployees}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <UserCheck className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Employés actifs</p>
            <h3 className="text-2xl font-bold">{activeEmployees}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">En congé</p>
            <h3 className="text-2xl font-bold">{onLeaveEmployees}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <UserMinus className="h-6 w-6 text-red-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Inactifs</p>
            <h3 className="text-2xl font-bold">{inactiveEmployees}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDashboardCards;
