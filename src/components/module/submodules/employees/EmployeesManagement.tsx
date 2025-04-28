
import React from 'react';
import { Users, UserCheck, Building2, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from "@/components/ui/button";
import { BarChart, LineChart } from '@/components/ui/charts';

const EmployeesManagement = () => {
  const { employees = [], departments = [], isLoading } = useEmployeeData();
  
  // Calculate statistics with null checks to prevent errors
  const totalEmployees = employees && Array.isArray(employees) ? employees.length : 0;
  const activeDepartments = departments && Array.isArray(departments) ? departments.length : 0;
  
  const activeEmployees = employees && Array.isArray(employees) 
    ? employees.filter(emp => emp?.status === 'active' || emp?.status === 'Actif').length 
    : 0;
    
  const onLeave = employees && Array.isArray(employees)
    ? employees.filter(emp => emp?.status === 'onLeave' || emp?.status === 'En congé').length 
    : 0;

  // Prepare chart data
  const departmentData = {
    labels: departments.slice(0, 5).map(dept => dept.name || 'Département'),
    datasets: [
      {
        label: 'Nombre d\'employés',
        data: departments.slice(0, 5).map(dept => dept.employeesCount || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',   // Blue
          'rgba(139, 92, 246, 0.7)',   // Purple
          'rgba(16, 185, 129, 0.7)',   // Green
          'rgba(245, 158, 11, 0.7)',   // Orange
          'rgba(239, 68, 68, 0.7)',    // Red
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const employeeTrendData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Évolution des effectifs',
        data: [totalEmployees - 5, totalEmployees - 3, totalEmployees - 2, totalEmployees - 1, totalEmployees, totalEmployees + 2],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des employés</h1>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des employés</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Actualiser
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Nouvel employé
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Employés totaux"
          value={totalEmployees.toString()}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Nombre total d'employés"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-blue-100"
        />
        
        <StatCard
          title="Départements"
          value={activeDepartments.toString()}
          icon={<Building2 className="h-6 w-6 text-purple-600" />}
          description="Départements actifs"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-purple-100"
        />
        
        <StatCard
          title="Employés actifs"
          value={activeEmployees.toString()}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          description="Employés en activité"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-green-100"
        />
        
        <StatCard
          title="En congé"
          value={onLeave.toString()}
          icon={<Calendar className="h-6 w-6 text-orange-600" />}
          description="Employés en congé"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-orange-100"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-medium mb-4 text-gray-800">Répartition par département</h2>
          <div className="h-80">
            <BarChart data={departmentData} height={300} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-medium mb-4 text-gray-800">Évolution des effectifs</h2>
          <div className="h-80">
            <LineChart data={employeeTrendData} height={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesManagement;
