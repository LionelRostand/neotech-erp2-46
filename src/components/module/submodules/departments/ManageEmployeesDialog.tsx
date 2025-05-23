
import React, { useEffect, useMemo } from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from './types';
import EmployeesList from './EmployeesList';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface ManageEmployeesDialogProps {
  department: Department;
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
  getDepartmentEmployees: (departmentId: string) => any[];
  onClose: () => void;
  onSave: () => void;
}

const ManageEmployeesDialog: React.FC<ManageEmployeesDialogProps> = ({
  department,
  selectedEmployees,
  onEmployeeSelection,
  getDepartmentEmployees,
  onClose,
  onSave,
}) => {
  const { employees, isLoading } = useEmployeeData();
  
  // Memoize employees data to prevent unnecessary re-renders
  const employeesData = useMemo(() => {
    return employees || [];
  }, [employees]);

  // Set selected employees based on department
  useEffect(() => {
    // This is just to ensure department employees are loaded
    if (department && department.id) {
      getDepartmentEmployees(department.id);
    }
  }, [department, getDepartmentEmployees]);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Gérer les employés: {department.name}</DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <EmployeesList 
          employees={employeesData}
          selectedEmployees={selectedEmployees || []}
          onEmployeeSelection={onEmployeeSelection}
          id="manage"
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onSave}>Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ManageEmployeesDialog;
