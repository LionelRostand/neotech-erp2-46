
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Employee } from '@/types/employee';

interface EmployeesListProps {
  employees: Employee[];
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string) => void;
  id?: string;
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  employees,
  selectedEmployees,
  onEmployeeSelection,
  id = '',
}) => {
  const prefix = id ? `${id}-` : '';
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Sélectionnez les employés à assigner à ce département:</h3>
      <div className="border rounded-md">
        <ScrollArea className="h-[250px] w-full">
          <div className="p-4 space-y-3">
            {employees.map(employee => (
              <div key={employee.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${prefix}employee-${employee.id}`}
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={() => onEmployeeSelection(employee.id)}
                />
                <label 
                  htmlFor={`${prefix}employee-${employee.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {employee.firstName} {employee.lastName} - {employee.position}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {selectedEmployees.length} employé(s) sélectionné(s)
      </p>
    </div>
  );
};

export default EmployeesList;
