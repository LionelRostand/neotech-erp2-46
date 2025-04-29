
import React, { useEffect, useState } from 'react';
import { Department } from './types';
import { DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EmployeesList from './EmployeesList';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';

interface ManageEmployeesDialogProps {
  department: Department;
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string, isSelected: boolean) => void;
  getDepartmentEmployees: (departmentId: string) => string[];
  onClose: () => void;
  onSave: (departmentId: string, departmentName: string, selectedEmployeeIds: string[]) => Promise<boolean>;
}

const ManageEmployeesDialog: React.FC<ManageEmployeesDialogProps> = ({
  department,
  selectedEmployees,
  onEmployeeSelection,
  getDepartmentEmployees,
  onClose,
  onSave,
}) => {
  // Get employees data for display
  const { employees } = useEmployeeData();
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([]);

  // Filter employees to only show valid ones (with ID)
  useEffect(() => {
    if (employees && Array.isArray(employees)) {
      const validEmployees = employees.filter(emp => 
        emp && 
        emp.id && 
        typeof emp.id === 'string' && 
        emp.id.trim() !== '' &&
        emp.firstName // Ensure we have at least a firstName
      );
      setDepartmentEmployees(validEmployees);
    }
  }, [employees]);

  const departmentName = department?.name || `Département ${department?.id?.slice(0, 6)}`;

  const handleSubmit = async () => {
    try {
      // Filter out any empty strings from selectedEmployees
      const validSelectedEmployees = selectedEmployees.filter(id => id && id.trim() !== '');
      
      const success = await onSave(
        department.id, 
        departmentName,
        validSelectedEmployees
      );
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving employee assignments:', error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Gérer les employés - {departmentName}</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <EmployeesList 
          employees={departmentEmployees} 
          selectedEmployees={selectedEmployees} 
          onEmployeeSelection={onEmployeeSelection}
          id={`manage-employees-${department.id}`}
        />
      </DialogContent>
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogFooter>
    </>
  );
};

export default ManageEmployeesDialog;
