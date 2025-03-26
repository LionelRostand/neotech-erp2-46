
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import EmployeesList from './employees/EmployeesList';
import EmployeeDetails from './employees/EmployeeDetails';
import EmployeeForm from './employees/EmployeeForm';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmployees } from '@/hooks/useEmployees';

const EmployeesProfiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  
  const { 
    employees, 
    isLoading, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees();

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = async (newEmployee: Partial<Employee>) => {
    try {
      await addEmployee(newEmployee);
      setIsAddEmployeeOpen(false);
    } catch (error) {
      console.error('Error in handleAddEmployee:', error);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = async (updatedEmployee: Partial<Employee>) => {
    if (!employeeToEdit?.id) return;
    
    try {
      await updateEmployee(employeeToEdit.id, updatedEmployee);
      
      // Update selected employee if it's the one being edited
      if (selectedEmployee?.id === employeeToEdit.id) {
        setSelectedEmployee({ ...selectedEmployee, ...updatedEmployee } as Employee);
      }
      
      setIsEditEmployeeOpen(false);
    } catch (error) {
      console.error('Error in handleUpdateEmployee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      
      // If deleted employee is selected, clear selection
      if (selectedEmployee?.id === employeeId) {
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteEmployee:', error);
    }
  };

  const handleExportPdf = () => {
    if (!selectedEmployee) return;
    
    setIsPdfExportOpen(true);
    setTimeout(() => {
      setIsPdfExportOpen(false);
      toast.success(`Informations de ${selectedEmployee.firstName} ${selectedEmployee.lastName} exportées en PDF.`);
    }, 1500);
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
          isLoading={isLoading}
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
