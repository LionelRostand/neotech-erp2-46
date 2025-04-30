
import React from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { DataTable } from '@/components/ui/data-table';
import EmployeesDashboardCards from './employees/dashboard/EmployeesDashboardCards';
import EmployeesProfiles from './employees/EmployeesProfiles';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateEmployeeDialog from './employees/CreateEmployeeDialog';
import { toast } from 'sonner';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { Employee } from '@/types/employee';

const EmployeesDashboard = () => {
  const { employees, departments, isLoading } = useEmployeeData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { createEmployee } = useEmployeeActions();
  
  // Gérer la création d'un nouvel employé
  const handleCreateEmployee = async (data: Partial<Employee>) => {
    try {
      await createEmployee(data as Omit<Employee, 'id'>);
      setCreateDialogOpen(false);
      toast.success("Employé créé avec succès");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord RH</h1>
      
      {/* Carte statistiques et bouton Nouveau Employé */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="w-full">
          <EmployeesDashboardCards />
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Employé
          </Button>
        </div>
      </div>
      
      {/* Liste des employés */}
      <EmployeesProfiles employees={employees} isLoading={isLoading} />
      
      {/* Dialog de création d'employé */}
      <CreateEmployeeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />
    </div>
  );
};

export default EmployeesDashboard;
