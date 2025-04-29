
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import { getEmployees } from '@/components/module/submodules/employees/services/employeeService';
import SubmoduleHeader from './SubmoduleHeader';
import EmployeeViewDialog from './employees/EmployeeViewDialog';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import EmployeeForm from './employees/EmployeeForm';
import EmployeeStats from './employees/EmployeesStats';
import DeleteEmployeeDialog from './employees/DeleteEmployeeDialog';

const EmployeesProfiles: React.FC = () => {
  const { employees, isLoading, departments } = useEmployeeData();
  const { updateEmployee, deleteEmployee, isLoading: isActionLoading } = useEmployeeActions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Filtre les employés en fonction de la recherche
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success(`${selectedEmployee.firstName} ${selectedEmployee.lastName} a été supprimé avec succès`);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'employé");
      console.error("Delete employee error:", error);
    }
  };

  const handleCreateEmployee = () => {
    setIsCreateDialogOpen(true);
  };

  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    try {
      await updateEmployee(updatedEmployee);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Update employee error:", error);
    }
  };

  const handleCreateSubmit = async (newEmployee: Partial<Employee>) => {
    // La création d'employé est gérée ailleurs
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <SubmoduleHeader
        title="Gestion des employés"
        description="Gérez vos employés, consultez leurs profils et mettez à jour leurs informations."
      />
      
      <EmployeeStats employees={employees} departments={departments} isLoading={isLoading} />
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un employé..."
            className="w-full pl-9 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={handleCreateEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel employé
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-40 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Aucun employé trouvé</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? "Aucun employé ne correspond à votre recherche."
              : "Commencez par ajouter un nouvel employé."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {employee.photoURL ? (
                    <img
                      src={employee.photoURL}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {employee.firstName.charAt(0)}
                      {employee.lastName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.position} {employee.department && `• ${employee.department}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewEmployee(employee)}
                >
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEmployee(employee)}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeleteClick(employee)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEmployee && (
        <EmployeeViewDialog
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          employee={selectedEmployee}
          onEdit={() => {
            setIsViewDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
        />
      )}

      <EmployeeForm
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
      />

      {selectedEmployee && (
        <EmployeeForm
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateEmployee}
          employee={selectedEmployee}
          isEditing={true}
        />
      )}

      <DeleteEmployeeDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
        isDeleting={isActionLoading}
      />
    </div>
  );
};

export default EmployeesProfiles;
