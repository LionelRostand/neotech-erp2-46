
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import EmployeesTable from './EmployeesTable';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { toast } from 'sonner';
import ViewEmployeeDialog from './dialogs/ViewEmployeeDialog';
import EditEmployeeDialog from './dialogs/EditEmployeeDialog';
import DeleteEmployeeDialog from './dialogs/DeleteEmployeeDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmployeesProfilesProps {
  employees: Employee[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees }) => {
  const { updateEmployee, isLoading, error } = useEmployeeService();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Handle dialog actions
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  // Handle employee update
  const handleSaveEmployee = async (data: Partial<Employee>) => {
    try {
      if (!selectedEmployee) return;
      
      await updateEmployee(selectedEmployee.id, data);
      toast.success(`Employé ${data.firstName} ${data.lastName} mis à jour avec succès`);
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Handle employee deletion
  const handleConfirmDelete = async (id: string) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { deleteEmployee } = await import('../../employees/services/employeeService');
      await deleteEmployee(id);
      
      toast.success('Employé supprimé avec succès');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      throw error; // Rethrow to be caught by the DeleteDialog component
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        Une erreur est survenue : {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-xl font-bold">Liste des employés</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <EmployeesTable 
            employees={employees} 
            isLoading={isLoading}
            onView={handleViewEmployee}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ViewEmployeeDialog 
        employee={selectedEmployee} 
        isOpen={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
      />
      
      <EditEmployeeDialog 
        employee={selectedEmployee} 
        isOpen={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onSave={handleSaveEmployee} 
      />
      
      <DeleteEmployeeDialog 
        employee={selectedEmployee} 
        isOpen={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
};

export default EmployeesProfiles;
