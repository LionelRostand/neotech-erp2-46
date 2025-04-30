
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from '@/types/employee';
import { Plus, Search, FileDown } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeesTable from './EmployeesTable';
import EmployeesStats from './EmployeesStats';
import ViewEmployeeDialog from './ViewEmployeeDialog';
import EditEmployeeDialog from './EditEmployeeDialog';
import DeleteEmployeeDialog from './DeleteEmployeeDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

const EmployeesProfiles: React.FC = () => {
  const { employees, isLoading } = useEmployeeData();
  const { createEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();
  
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Filter employees based on search term
  useEffect(() => {
    if (!employees) return;
    
    const filtered = searchTerm
      ? employees.filter(
          (employee) =>
            employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : employees;
      
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);
  
  // Handle employee view
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };
  
  // Handle employee edit
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };
  
  // Handle employee delete
  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle employee create
  const handleCreateEmployee = () => {
    setIsCreateDialogOpen(true);
  };
  
  // Handle employee update
  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!updatedEmployee.id) return;
    
    try {
      await updateEmployee(updatedEmployee);
      toast.success("Employé mis à jour avec succès");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  };
  
  // Handle employee delete confirmation
  const handleDeleteConfirmation = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success("Employé supprimé avec succès");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Erreur lors de la suppression de l'employé");
    }
  };
  
  // Handle employee create submission
  const handleCreateSubmission = async (newEmployee: Partial<Employee>) => {
    try {
      await createEmployee(newEmployee as Omit<Employee, 'id'>);
      toast.success("Employé créé avec succès");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard stats */}
      <EmployeesStats employees={employees} />
      
      {/* Search and actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <FileDown className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
          <Button onClick={handleCreateEmployee} className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Nouveau Employé</span>
          </Button>
        </div>
      </div>
      
      {/* Employees table */}
      <EmployeesTable
        employees={filteredEmployees}
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        isLoading={isLoading}
      />
      
      {/* View Employee Dialog */}
      {selectedEmployee && (
        <ViewEmployeeDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          employee={selectedEmployee}
        />
      )}
      
      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <EditEmployeeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          employee={selectedEmployee}
          onSubmit={handleUpdateEmployee}
        />
      )}
      
      {/* Delete Employee Dialog */}
      {selectedEmployee && (
        <DeleteEmployeeDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          employee={selectedEmployee}
          onConfirm={handleDeleteConfirmation}
        />
      )}
      
      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmission}
      />
    </div>
  );
};

export default EmployeesProfiles;
