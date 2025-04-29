
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import EmployeesList from './EmployeesList';
import { toast } from 'sonner';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees, isLoading }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { createEmployee, deleteEmployee } = useEmployeeActions();
  
  const handleCreateEmployee = async (data: Omit<Employee, 'id'>) => {
    try {
      await createEmployee(data);
      setIsCreateDialogOpen(false);
      toast.success("Employé créé avec succès");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };
  
  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await deleteEmployee(id);
        toast.success("Employé supprimé avec succès");
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Erreur lors de la suppression de l'employé");
      }
    }
  };
  
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
    // Navigate to employee detail page or open a dialog
    window.location.href = `/modules/employees/profiles/${employee.id}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des employés</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>
      
      <EmployeesList 
        employees={employees}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteEmployee}
      />
      
      {isCreateDialogOpen && (
        <CreateEmployeeDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
