
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { Department } from './types';
import EmployeesList from './EmployeesList';

interface ManageEmployeesDialogProps {
  department: Department;
  employees: Employee[];
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string) => void;
  getDepartmentEmployees: (departmentId: string) => Employee[];
  onClose: () => void;
  onSave: () => void;
}

const ManageEmployeesDialog: React.FC<ManageEmployeesDialogProps> = ({
  department,
  employees,
  selectedEmployees,
  onEmployeeSelection,
  getDepartmentEmployees,
  onClose,
  onSave,
}) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {department && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: department.color }}
              ></div>
              <span>Gérer les employés - {department.name}</span>
            </div>
          )}
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <EmployeesList 
          employees={employees}
          selectedEmployees={selectedEmployees}
          onEmployeeSelection={onEmployeeSelection}
          id="manage"
        />
        
        {department && getDepartmentEmployees(department.id).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Employés actuels du département:</h3>
            <div className="space-y-2">
              {getDepartmentEmployees(department.id).map(emp => (
                <div key={emp.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                  <div className="text-sm text-gray-500">- {emp.position}</div>
                </div>
              ))}
            </div>
          </div>
        )}
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
