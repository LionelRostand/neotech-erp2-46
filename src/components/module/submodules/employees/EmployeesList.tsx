
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeesListProps {
  employees: Employee[];
  isLoading: boolean;
  onViewDetails?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  employees,
  isLoading,
  onViewDetails,
  onDelete
}) => {
  // Helper to get employee initials for avatar fallback
  const getInitials = (employee: Employee) => {
    return `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
  };
  
  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En congé</Badge>;
      case 'Suspendu':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (employees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun employé trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOM</TableHead>
            <TableHead>DÉPARTEMENT</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>DATE D'EMBAUCHE</TableHead>
            <TableHead>STATUT</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={employee.photoURL || employee.photo} 
                      alt={`${employee.firstName} ${employee.lastName}`} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                    <div className="text-xs text-muted-foreground">{employee.position}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.department || 'Non spécifié'}</TableCell>
              <TableCell>
                <div>{employee.professionalEmail || employee.email}</div>
                {employee.professionalEmail && employee.email !== employee.professionalEmail && (
                  <div className="text-xs text-muted-foreground">{employee.email}</div>
                )}
              </TableCell>
              <TableCell>{formatDate(employee.hireDate)}</TableCell>
              <TableCell>{getStatusBadge(employee.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onViewDetails && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDetails(employee)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesList;
