
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { getInitials } from '../utils/employeeUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface EmployeeListItemProps {
  employee: Employee;
  onEmployeeClick?: (employee: Employee) => void;
}

const EmployeeListItem: React.FC<EmployeeListItemProps> = ({ 
  employee, 
  onEmployeeClick 
}) => {
  const { getDepartmentName } = useAvailableDepartments();
  
  // Get the department name using the department ID
  const departmentName = employee.departmentId ? 
    getDepartmentName(employee.departmentId) : 
    (typeof employee.department === 'string' ? employee.department : 'Non spécifié');
  
  // Format hire date
  const formattedHireDate = employee.hireDate ? 
    format(new Date(employee.hireDate), 'dd/MM/yyyy', { locale: fr }) : 
    '';
  
  // Get employee initials for avatar fallback
  const initials = getInitials(employee.firstName, employee.lastName);
  
  // Use professional email if available, otherwise use personal email
  const displayEmail = employee.professionalEmail || employee.email;
  
  const handleClick = () => {
    if (onEmployeeClick) {
      onEmployeeClick(employee);
    }
  };

  return (
    <TableRow 
      className={`cursor-pointer hover:bg-gray-50 transition-colors`}
      onClick={handleClick}
    >
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
            <div className="text-xs text-gray-500">{employee.position}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{departmentName}</TableCell>
      <TableCell>{displayEmail}</TableCell>
      <TableCell>{formattedHireDate}</TableCell>
      <TableCell>
        <Badge variant={employee.status === 'active' ? 'default' : 'outline'} className="bg-green-500 hover:bg-green-600">
          {employee.status === 'active' ? 'active' : employee.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeListItem;
