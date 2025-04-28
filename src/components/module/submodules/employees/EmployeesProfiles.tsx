
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { PlusCircle, Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmployeesStats from './EmployeesStats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeesProfiles: React.FC<EmployeesTableProps> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  const [openDialog, setOpenDialog] = useState<'view' | 'edit' | 'add' | 'delete' | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Ensure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  const handleOpenDialog = (type: 'view' | 'edit' | 'add' | 'delete', employee: Employee | null = null) => {
    setSelectedEmployee(employee);
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    toast.success("Employé ajouté avec succès");
    handleCloseDialog();
  };

  const handleUpdateEmployee = () => {
    toast.success("Employé mis à jour avec succès");
    handleCloseDialog();
  };

  const handleDeleteEmployee = () => {
    toast.success("Employé supprimé avec succès");
    handleCloseDialog();
  };

  // Status badge component
  const StatusBadge = ({ status }: { status?: string }) => {
    if (!status) return null;
    
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'active' || normalizedStatus === 'actif') {
      return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
    }
    if (normalizedStatus === 'inactive' || normalizedStatus === 'inactif') {
      return <Badge variant="outline">Inactif</Badge>;
    }
    if (normalizedStatus === 'onleave' || normalizedStatus === 'en congé') {
      return <Badge className="bg-amber-500 hover:bg-amber-600">En congé</Badge>;
    }
    
    return <Badge variant="secondary">{status}</Badge>;
  };

  // Get initials for avatar
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "??";
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  const columns = [
    {
      header: "Employé",
      cell: ({ row }: { row: { original: Employee } }) => {
        const employee = row.original || {};
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={employee.photoURL || ''} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback>{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{employee.firstName} {employee.lastName}</div>
              <div className="text-sm text-muted-foreground">{employee.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: "Poste",
      accessorKey: "position",
    },
    {
      header: "Département",
      accessorKey: "department",
    },
    {
      header: "Statut",
      cell: ({ row }: { row: { original: Employee } }) => (
        <StatusBadge status={row.original?.status} />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: Employee } }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('view', row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('edit', row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog('delete', row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des employés</h1>
        <Button onClick={() => handleOpenDialog('add')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      <EmployeesStats employees={safeEmployees} />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <DataTable 
            columns={columns} 
            data={safeEmployees} 
            isLoading={isLoading}
            emptyMessage="Aucun employé trouvé"
          />
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <Dialog open={openDialog === 'view'} onOpenChange={() => openDialog === 'view' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de l'employé</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedEmployee.photoURL || ''} alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} />
                  <AvatarFallback className="text-lg">{getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                <p className="text-muted-foreground">{selectedEmployee.position}</p>
                <div className="mt-2">
                  <StatusBadge status={selectedEmployee.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Téléphone</Label>
                  <p>{selectedEmployee.phone || "Non renseigné"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Département</Label>
                  <p>{selectedEmployee.department || "Non assigné"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date d'embauche</Label>
                  <p>{selectedEmployee.hireDate || "Non renseigné"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={openDialog === 'add'} onOpenChange={() => openDialog === 'add' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter un employé</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouvel employé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Nom" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input id="position" placeholder="Poste" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input id="department" placeholder="Département" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleAddEmployee}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={openDialog === 'edit'} onOpenChange={() => openDialog === 'edit' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Modifier un employé</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstName">Prénom</Label>
                    <Input id="edit-firstName" defaultValue={selectedEmployee.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lastName">Nom</Label>
                    <Input id="edit-lastName" defaultValue={selectedEmployee.lastName} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedEmployee.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-position">Poste</Label>
                    <Input id="edit-position" defaultValue={selectedEmployee.position} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Département</Label>
                    <Input id="edit-department" defaultValue={selectedEmployee.department} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleUpdateEmployee}>Enregistrer</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog open={openDialog === 'delete'} onOpenChange={() => openDialog === 'delete' && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Supprimer un employé</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4">
              <p>Vous êtes sur le point de supprimer l'employé :</p>
              <p className="font-semibold mt-2">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesProfiles;
