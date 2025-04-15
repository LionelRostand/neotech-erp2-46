
import React from 'react';
import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface EmployeesListProps {
  employees: Employee[];
  onSelect?: (employee: Employee) => void;
  onDeleteEmployee?: (id: string) => void;
  // Add the additional props that are being passed
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onViewEmployee?: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  loading?: boolean;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ 
  employees, 
  onSelect, 
  onDeleteEmployee,
  onViewEmployee,
  onEditEmployee,
  loading
}) => {
  // Use the appropriate handler function
  const handleSelectEmployee = (employee: Employee) => {
    if (onViewEmployee) {
      onViewEmployee(employee);
    } else if (onSelect) {
      onSelect(employee);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-blue-500">En congé</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge className="bg-gray-500">Inactif</Badge>;
      case 'Suspendu':
        return <Badge className="bg-yellow-500">Suspendu</Badge>;
      default:
        return <Badge className="bg-gray-500">Non défini</Badge>;
    }
  };

  if (!employees || employees.length === 0) {
    return <div className="text-center py-8">Aucun employé trouvé</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Département</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow 
            key={employee.id} 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSelectEmployee(employee)}
          >
            <TableCell className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span>{employee.firstName} {employee.lastName}</span>
            </TableCell>
            <TableCell>{employee.position || employee.title || 'Non défini'}</TableCell>
            <TableCell>{employee.department || 'Non assigné'}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{getStatusBadge(employee.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeesList;
