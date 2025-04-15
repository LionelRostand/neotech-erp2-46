
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, UserPlus } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeesList from './EmployeesList';
import EmployeeDetails from './EmployeeDetails';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface EmployeesProfilesProps {
  employees: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees: initialEmployees }) => {
  const { employees: latestEmployees, departments } = useEmployeeData();
  const { refreshEmployees } = useHrModuleData();
  
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

  // Mettre à jour les employés lorsque les données fraîches sont disponibles
  useEffect(() => {
    if (latestEmployees?.length > 0) {
      setEmployees(latestEmployees);
    }
  }, [latestEmployees]);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = () => {
    setIsCreating(true);
  };

  const handleEmployeeCreated = async (employee: Employee) => {
    setIsCreating(false);
    // Rafraîchir les données des employés
    await refreshEmployees();
    // Sélectionner automatiquement le nouvel employé
    setSelectedEmployee(employee);
  };

  const handleEmployeeUpdate = async (updatedEmployee: Employee) => {
    // Mise à jour de l'employé dans la liste locale
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    
    // Mettre à jour l'employé sélectionné
    setSelectedEmployee(updatedEmployee);
    
    // Rafraîchir les données globales des employés
    await refreshEmployees();
  };

  // Si un employé est sélectionné, afficher ses détails
  if (selectedEmployee) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToList}>
            Retour à la liste
          </Button>
        </div>
        <EmployeeDetails 
          employee={selectedEmployee} 
          onExportPdf={() => {}} 
          onEdit={() => {}}
          onEmployeeUpdate={handleEmployeeUpdate}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={handleCreateEmployee}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="onLeave">En congé</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <EmployeesList
                employees={filteredEmployees}
                onSelectEmployee={handleSelectEmployee}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <EmployeesList
                employees={filteredEmployees.filter(e => e.status === 'active' || e.status === 'Actif')}
                onSelectEmployee={handleSelectEmployee}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onLeave">
          <Card>
            <CardContent className="p-6">
              <EmployeesList
                employees={filteredEmployees.filter(e => e.status === 'onLeave' || e.status === 'En congé')}
                onSelectEmployee={handleSelectEmployee}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardContent className="p-6">
              <EmployeesList
                employees={filteredEmployees.filter(e => e.status === 'inactive' || e.status === 'Inactif')}
                onSelectEmployee={handleSelectEmployee}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateEmployeeDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onEmployeeCreated={handleEmployeeCreated}
        departments={departments}
      />
    </div>
  );
};

export default EmployeesProfiles;
