
import React from 'react';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Employee } from '@/types/hr-types';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onDelete: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  isLoading, 
  onDelete,
  onEdit 
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500">Aucun employé trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.position || employee.title}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === 'active' || employee.status === 'Actif' 
                    ? 'bg-green-100 text-green-800' 
                    : employee.status === 'onLeave' || employee.status === 'En congé'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {employee.status === 'active' ? 'Actif' : 
                   employee.status === 'inactive' ? 'Inactif' : 
                   employee.status === 'onLeave' ? 'En congé' : 
                   employee.status || 'Indéfini'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(employee)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(employee)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
