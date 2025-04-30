
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Plus, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmployeesTable from './EmployeesTable';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import ViewEmployeeDialog from './dialogs/EmployeeViewDialog';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';
import EmployeeEditDialog from './dialogs/EmployeeEditDialog';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading = false }) => {
  const { createEmployee, deleteEmployee, updateEmployee } = useEmployeeActions();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter employees based on search
  const filteredEmployees = Array.isArray(employees) ? employees.filter(employee => {
    if (!employee) return false;
    
    const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (employee.email || '').toLowerCase().includes(searchLower) ||
      (employee.position || '').toLowerCase().includes(searchLower) ||
      (employee.department || '').toLowerCase().includes(searchLower)
    );
  }) : [];
  
  // Handle creating a new employee
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
  
  // Handle updating an employee
  const handleUpdateEmployee = async (data: Partial<Employee>) => {
    if (!data.id) return;
    
    try {
      await updateEmployee(data);
      setEditDialogOpen(false);
      toast.success("Employé mis à jour avec succès");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  };
  
  // Handle view employee
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };
  
  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };
  
  // Handle delete employee
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };
  
  // Confirm employee deletion
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteEmployee(selectedEmployee.id);
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Employé supprimé avec succès");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Fiches Employés</h1>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Employé
          </Button>
        </div>
      </div>
      
      {/* Employees Table */}
      <EmployeesTable
        employees={filteredEmployees}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        isLoading={isLoading}
      />
      
      {/* Dialogs */}
      <CreateEmployeeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />
      
      {selectedEmployee && (
        <>
          <ViewEmployeeDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            employee={selectedEmployee}
            onEdit={() => {
              setViewDialogOpen(false);
              setEditDialogOpen(true);
            }}
          />
          
          <EmployeeEditDialog
            employee={selectedEmployee}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleUpdateEmployee}
          />
          
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            title="Supprimer l'employé"
            description={`Êtes-vous sûr de vouloir supprimer l'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName} ? Cette action est irréversible.`}
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesProfiles;
