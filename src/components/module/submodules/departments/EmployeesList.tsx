
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface EmployeesListProps {
  employees?: Employee[];
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
  id: string;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ 
  employees: providedEmployees, 
  selectedEmployees, 
  onEmployeeSelection,
  id
}) => {
  // Use the hook to get employees if none are provided
  const { employees: hookEmployees = [] } = useEmployeeData() || {};
  
  // Use provided employees or fall back to hook data
  const employees = Array.isArray(providedEmployees) && providedEmployees.length > 0 
    ? providedEmployees 
    : (Array.isArray(hookEmployees) ? hookEmployees : []);

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun employé disponible</p>
      </div>
    );
  }
  
  // Ensure selectedEmployees is always an array
  const safeSelectedEmployees = Array.isArray(selectedEmployees) ? selectedEmployees : [];
  
  return (
    <ScrollArea className="h-[300px] border rounded-md p-4">
      <div className="space-y-4">
        {employees.map((employee) => {
          if (!employee || !employee.id) {
            return null; // Skip invalid employees
          }
          
          const isSelected = safeSelectedEmployees.includes(employee.id);
          return (
            <div 
              key={employee.id}
              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md"
            >
              <Checkbox 
                id={`${id}-employee-${employee.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => onEmployeeSelection(employee.id, !!checked)}
              />
              <Avatar className="h-8 w-8">
                {(employee.photoURL || employee.photo) ? (
                  <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName || ''} ${employee.lastName || ''}`} />
                ) : null}
                <AvatarFallback>
                  {employee.firstName?.[0] || ''}{employee.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor={`${id}-employee-${employee.id}`}
                className="text-sm font-medium leading-none cursor-pointer flex-1"
              >
                {employee.firstName || ''} {employee.lastName || ''}
                <br />
                <span className="text-xs text-muted-foreground">
                  {employee.title || employee.position || "Sans poste"}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default EmployeesList;
