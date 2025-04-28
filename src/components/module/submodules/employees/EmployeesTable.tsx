
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Employee } from '@/types/employee';

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees = [],
  isLoading = false,
  onView,
  onEdit,
  onDelete
}) => {
  // Function to render status badge with appropriate color
  const renderStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Non spécifié</Badge>;

    switch(status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En congé</Badge>;
      case 'Suspendu':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
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
          {!employees || employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun employé trouvé.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position || '-'}</TableCell>
                <TableCell>{employee.department || '-'}</TableCell>
                <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(employee)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(employee)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;
