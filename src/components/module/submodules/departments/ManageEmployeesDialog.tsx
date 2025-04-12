
import React from 'react';
import { 
  DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import { Department } from './types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeesList from './EmployeesList';

interface ManageEmployeesDialogProps {
  department: Department;
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
  getDepartmentEmployees: (departmentId: string) => Employee[];
  onClose: () => void;
  onSave: () => void;
}

const ManageEmployeesDialog: React.FC<ManageEmployeesDialogProps> = ({
  department,
  selectedEmployees,
  onEmployeeSelection,
  getDepartmentEmployees,
  onClose,
  onSave
}) => {
  const { employees } = useEmployeeData();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filtrer les employés en fonction de la recherche
  const filteredEmployees = searchQuery 
    ? employees.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;
  
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          Gérer les employés - {department.name}
        </DialogTitle>
      </DialogHeader>
      
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Rechercher un employé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <EmployeesList
        employees={filteredEmployees}
        selectedEmployees={selectedEmployees}
        onEmployeeSelection={onEmployeeSelection}
        id="manage"
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        {selectedEmployees.length} employé{selectedEmployees.length !== 1 ? 's' : ''} sélectionné{selectedEmployees.length !== 1 ? 's' : ''}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onSave}>
          Enregistrer
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ManageEmployeesDialog;
