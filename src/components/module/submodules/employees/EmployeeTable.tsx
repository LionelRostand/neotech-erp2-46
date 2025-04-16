
import React from 'react';
import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatPhoneNumber } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeTableProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEmployeeClick }) => {
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
      case 'inactif':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'onleave':
      case 'en congé':
        return <Badge className="bg-blue-100 text-blue-800">En congé</Badge>;
      case 'suspended':
      case 'suspendu':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status || 'Inconnu'}</Badge>;
    }
  };

  // Function to get employee initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Aucun employé trouvé
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow 
                key={employee.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onEmployeeClick(employee)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={employee.photoURL || employee.photo} 
                        alt={`${employee.firstName} ${employee.lastName}`} 
                      />
                      <AvatarFallback>{getInitials(employee.firstName || '', employee.lastName || '')}</AvatarFallback>
                    </Avatar>
                    <span>{employee.lastName} {employee.firstName}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{formatPhoneNumber(employee.phone)}</TableCell>
                <TableCell>{employee.department || '—'}</TableCell>
                <TableCell>{employee.position || employee.title || '—'}</TableCell>
                <TableCell>{getStatusBadge(employee.status || 'unknown')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
