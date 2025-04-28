
import React from 'react';
import { Users, UserCheck, Building2, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des employés</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            Actualiser
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
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
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-medium mb-4">Statistiques des employés</h2>
        
        {/* Placeholder pour les graphiques et statistiques avancées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-80 bg-gray-50 rounded-lg border flex items-center justify-center">
            <span className="text-gray-400">Répartition par département</span>
          </div>
          <div className="h-80 bg-gray-50 rounded-lg border flex items-center justify-center">
            <span className="text-gray-400">Évolution des effectifs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesManagement;
