
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, Trash2, Eye, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from '@/types/employee';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmployeeDetails from './EmployeeDetails';
import { EditEmployeeDialog } from './EditEmployeeDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import DeleteConfirmDialog from '@/components/module/submodules/accounting/components/DeleteConfirmDialog';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onDelete?: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading = false,
  onDelete
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDetailsOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEmployee && onDelete) {
      onDelete(selectedEmployee);
    }
    setDeleteDialogOpen(false);
  };

  const handleExportPdf = () => {
    toast.success('Export PDF terminé');
  };

  if (isLoading) {
    return <div className="text-center py-10">Chargement des données...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center py-10">Aucun employé trouvé.</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email professionnel</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="pr-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{employee.firstName} {employee.lastName}</TableCell>
              <TableCell>{employee.professionalEmail || 'Non spécifié'}</TableCell>
              <TableCell>{employee.position || employee.title}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                {employee.status === 'active' || employee.status === 'Actif' ? (
                  <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>
                ) : employee.status === 'onLeave' || employee.status === 'En congé' ? (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">En congé</Badge>
                ) : (
                  <Badge variant="outline">Inactif</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem onClick={() => handleDeleteEmployee(employee)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEmployee && (
        <>
          <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Profil de l'employé</DialogTitle>
              </DialogHeader>
              <EmployeeDetails 
                employee={selectedEmployee} 
                onExportPdf={handleExportPdf} 
                onEdit={() => {
                  setViewDetailsOpen(false);
                  setEditDialogOpen(true);
                }}
              />
            </DialogContent>
          </Dialog>

          <EditEmployeeDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            employee={selectedEmployee}
          />

          <DeleteConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
            title="Confirmation de suppression"
            description={`Êtes-vous sûr de vouloir supprimer l'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName} ? Cette action est irréversible.`}
          />
        </>
      )}
    </>
  );
};

export default EmployeeTable;
