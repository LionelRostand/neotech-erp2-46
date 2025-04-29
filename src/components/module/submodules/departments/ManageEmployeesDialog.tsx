
import React from 'react';
import { Department } from './types';
import { DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EmployeesList from './EmployeesList';

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
  const handleSubmit = async () => {
    try {
      const success = await onSave(department.id, department.name, selectedEmployees);
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
        <DialogTitle>Gérer les employés - {department.name}</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <EmployeesList 
          employees={[]} // We need to pass employees here
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
