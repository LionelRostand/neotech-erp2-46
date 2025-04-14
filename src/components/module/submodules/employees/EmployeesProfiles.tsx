import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '../../../../types/hr-types';

interface EmployeesProfilesProps {
  employees: any[];
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
	const employeesCollection = useFirestore(COLLECTIONS.HR.EMPLOYEES);

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const safelyGetId = (record: { id: string } | { _offlineCreated: boolean }) => {
    if ('id' in record) {
      return record.id;
    }
    return 'temp-' + Date.now(); // Generate a temporary ID for offline records
  };

  const handleEditOpen = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee });
    setIsEditDialogOpen(true);
  };

  const handleDeleteOpen = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleViewOpen = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      if (selectedEmployee && selectedEmployee.id) {
        await employeesCollection.update(selectedEmployee.id, formData);
        toast({
          title: "Employé mis à jour",
          description: "Les informations de l'employé ont été mises à jour avec succès.",
        });
      } else {
        console.error("Selected employee or employee ID is missing.");
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'employé. ID manquant.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la mise à jour de l'employé: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      if (selectedEmployee && selectedEmployee.id) {
        await employeesCollection.remove(selectedEmployee.id);
        toast({
          title: "Employé supprimé",
          description: "L'employé a été supprimé avec succès.",
        });
      } else {
        console.error("Selected employee or employee ID is missing.");
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'employé. ID manquant.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression de l'employé: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Rechercher un employé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Département</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={safelyGetId(employee)}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={employee.imageUrl} />
                    <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{employee.firstName} {employee.lastName}</span>
                  {employee.status === 'active' && <Badge className="ml-2">Actif</Badge>}
                </div>
              </TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewOpen(employee)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditOpen(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteOpen(employee)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'employé</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'employé. Cliquez sur Enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Prénom
              </Label>
              <Input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nom
              </Label>
              <Input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Département
              </Label>
              <Input id="department" name="department" value={formData.department || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditSubmit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'employé</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" onClick={handleDeleteSubmit}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Voir l'employé</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="flex justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={selectedEmployee?.imageUrl} />
                  <AvatarFallback>{selectedEmployee?.firstName[0]}{selectedEmployee?.lastName[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployee?.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={selectedEmployee?.email || ''} readOnly />
            </div>
            <div className="grid grid-cols-1 items-start gap-4">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={selectedEmployee?.phone || ''} readOnly />
            </div>
            <div className="grid grid-cols-1 items-start gap-4">
              <Label htmlFor="address">Adresse</Label>
              <Textarea id="address" value={selectedEmployee?.address || ''} readOnly className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsViewOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesProfiles;
