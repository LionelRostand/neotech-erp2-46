
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { employees as initialEmployees } from '@/data/employees';
import EmployeesList from './employees/EmployeesList';
import EmployeeDetails from './employees/EmployeeDetails';
import EmployeeForm from './employees/EmployeeForm';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmployeesProfilesProps {
  employees: Employee[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onOpenAddEmployee: () => void;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState(props.searchQuery || '');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(props.employees || initialEmployees);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = (newEmployee: Partial<Employee>) => {
    const employeeWithId = {
      ...newEmployee,
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
    } as Employee;
    
    const updatedEmployees = [...employees, employeeWithId];
    setEmployees(updatedEmployees);
    toast.success("Employé ajouté avec succès.");
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Partial<Employee>) => {
    if (!employeeToEdit) return;
    
    const updatedEmployees = employees.map(emp => 
      emp.id === employeeToEdit.id 
        ? { ...emp, ...updatedEmployee } as Employee
        : emp
    );
    
    setEmployees(updatedEmployees);
    
    // Si l'employé est actuellement sélectionné, mettre à jour aussi
    if (selectedEmployee && selectedEmployee.id === employeeToEdit.id) {
      setSelectedEmployee({ ...selectedEmployee, ...updatedEmployee } as Employee);
    }
    
    toast.success("Employé mis à jour avec succès.");
    setIsEditEmployeeOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    
    // Si l'employé supprimé est celui qui est affiché, revenir à la liste
    if (selectedEmployee && selectedEmployee.id === employeeId) {
      setSelectedEmployee(null);
    }
    
    toast.success("Employé supprimé avec succès.");
  };

  const handleExportPdf = () => {
    // Show loading dialog
    setIsPdfExportOpen(true);
    // The actual PDF export is now handled in EmployeeDetails component
    // This is just for UI feedback
    setTimeout(() => {
      setIsPdfExportOpen(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {selectedEmployee ? (
        <>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEmployee(null)}
              className="mr-2"
            >
              <span className="mr-2">←</span> Retour à la liste
            </Button>
          </div>
          <EmployeeDetails 
            employee={selectedEmployee} 
            onExportPdf={handleExportPdf}
            onEdit={() => handleEditEmployee(selectedEmployee)}
          />
        </>
      ) : (
        <EmployeesList
          employees={employees}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onViewEmployee={handleViewEmployee}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        />
      )}

      <EmployeeForm 
        open={isAddEmployeeOpen} 
        onOpenChange={setIsAddEmployeeOpen} 
        onSubmit={handleAddEmployee} 
      />

      {employeeToEdit && (
        <EmployeeForm 
          open={isEditEmployeeOpen}
          onOpenChange={setIsEditEmployeeOpen}
          onSubmit={handleUpdateEmployee}
          employee={employeeToEdit}
          isEditing={true}
        />
      )}

      {/* Dialogue de simulation d'export PDF */}
      <Dialog open={isPdfExportOpen} onOpenChange={setIsPdfExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export PDF en cours...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesProfiles;
