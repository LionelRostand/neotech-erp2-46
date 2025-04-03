
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';

interface EmployeesListProps {
  employees: Employee[];
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string) => void;
  id: string;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ 
  employees, 
  selectedEmployees, 
  onEmployeeSelection,
  id
}) => {
  if (!employees.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun employé disponible</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[300px] border rounded-md p-4">
      <div className="space-y-4">
        {employees.map((employee) => (
          <div 
            key={employee.id}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md"
          >
            <Checkbox 
              id={`${id}-employee-${employee.id}`}
              checked={selectedEmployees.includes(employee.id)}
              onCheckedChange={() => onEmployeeSelection(employee.id)}
            />
            <Avatar className="h-8 w-8">
              {(employee.photoURL || employee.photo) ? (
                <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
              ) : null}
              <AvatarFallback>
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor={`${id}-employee-${employee.id}`}
              className="text-sm font-medium leading-none cursor-pointer flex-1"
            >
              {employee.firstName} {employee.lastName}
              <br />
              <span className="text-xs text-muted-foreground">
                {employee.title || employee.position || "Sans poste"}
              </span>
            </label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EmployeesList;
