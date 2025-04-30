
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import EmployeeForm from '../employees/EmployeeForm';
import { EmployeeFormValues } from './form/employeeFormSchema';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import { formToEmployee } from './form/employeeUtils';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees = [], isLoading = false }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { createEmployee, updateEmployee, deleteEmployee } = useEmployeeActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    {
      header: "Photo",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.photo || employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback>{employee.firstName?.[0]}{employee.lastName?.[0]}</AvatarFallback>
          </Avatar>
        );
      }
    },
    {
      header: "Nom",
      cell: ({ row }) => `${row.original.lastName || ''} ${row.original.firstName || ''}`,
    },
    {
      header: "Email",
      accessorKey: "email",
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
      header: "Entreprise",
      accessorKey: "company",
    },
    {
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "destructive" | "outline" | "secondary" = "default";
        let label = "Inconnu";

        switch (status) {
          case "active":
          case "Actif":
            variant = "default";
            label = "Actif";
            break;
          case "inactive":
          case "Inactif":
            variant = "secondary";
            label = "Inactif";
            break;
          case "onLeave":
          case "En congé":
            variant = "outline";
            label = "En congé";
            break;
          case "Suspendu":
            variant = "destructive";
            label = "Suspendu";
            break;
        }

        return <Badge variant={variant}>{label}</Badge>;
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleViewDetails(employee)}
              title="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleEdit(employee)}
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(employee)}
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewingDetails(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      const employeeData = formToEmployee(data);
      await createEmployee(employeeData as any);
      toast.success("Employé créé avec succès");
      setIsCreating(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      toast.error("Erreur lors de la création de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (data: EmployeeFormValues) => {
    if (!selectedEmployee) return;
    
    setIsSubmitting(true);
    try {
      const employeeData = formToEmployee(data, selectedEmployee);
      await updateEmployee(employeeData);
      toast.success("Employé mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      toast.success("Employé supprimé avec succès");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Employés</h1>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="h-5 w-5 mr-2" />
          Nouveau Employé
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        emptyMessage="Aucun employé trouvé"
      />

      {/* Modal pour créer un nouvel employé */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouvel employé</DialogTitle>
          </DialogHeader>
          <EmployeeForm 
            onSubmit={handleCreateSubmit} 
            onCancel={() => setIsCreating(false)} 
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Modal pour modifier un employé */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier un employé</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm 
              defaultValues={selectedEmployee} 
              onSubmit={handleUpdateSubmit} 
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal pour afficher les détails d'un employé */}
      <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={selectedEmployee.photo || selectedEmployee.photoURL} 
                    alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} 
                  />
                  <AvatarFallback className="text-xl">
                    {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                  <p className="text-gray-600">{selectedEmployee.position} @ {selectedEmployee.company}</p>
                  <Badge className="mt-1">Actif</Badge>
                </div>
              </div>

              <Tabs defaultValue="informations" className="w-full mt-4">
                <TabsList className="grid grid-cols-6 mb-4">
                  <TabsTrigger value="informations">Informations</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="presences">Présences</TabsTrigger>
                  <TabsTrigger value="conges">Congés</TabsTrigger>
                  <TabsTrigger value="competences">Compétences</TabsTrigger>
                  <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                </TabsList>
                <TabsContent value="informations">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informations personnelles</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Nom</div>
                        <div>{selectedEmployee.lastName}</div>
                        <div className="text-sm text-gray-500">Prénom</div>
                        <div>{selectedEmployee.firstName}</div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div>{selectedEmployee.email}</div>
                        <div className="text-sm text-gray-500">Téléphone</div>
                        <div>{selectedEmployee.phone || '-'}</div>
                        <div className="text-sm text-gray-500">Adresse</div>
                        <div>{selectedEmployee.streetNumber} {selectedEmployee.streetName}</div>
                        <div className="text-sm text-gray-500">Ville</div>
                        <div>{selectedEmployee.city}</div>
                        <div className="text-sm text-gray-500">Code postal</div>
                        <div>{selectedEmployee.zipCode}</div>
                        <div className="text-sm text-gray-500">Région</div>
                        <div>{selectedEmployee.region}</div>
                        <div className="text-sm text-gray-500">Pays</div>
                        <div>{selectedEmployee.country}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informations professionnelles</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Poste</div>
                        <div>{selectedEmployee.position}</div>
                        <div className="text-sm text-gray-500">Email professionnel</div>
                        <div>{selectedEmployee.professionalEmail || '-'}</div>
                        <div className="text-sm text-gray-500">Type de contrat</div>
                        <div>{selectedEmployee.contract}</div>
                        <div className="text-sm text-gray-500">Département</div>
                        <div>{selectedEmployee.department}</div>
                        <div className="text-sm text-gray-500">Entreprise</div>
                        <div>{selectedEmployee.company}</div>
                        <div className="text-sm text-gray-500">Date d'embauche</div>
                        <div>{selectedEmployee.hireDate || '-'}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documents</h3>
                    {selectedEmployee.documents && selectedEmployee.documents.length > 0 ? (
                      <ul className="divide-y">
                        {selectedEmployee.documents.map((doc) => (
                          <li key={doc.id} className="py-2">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">{doc.title}</p>
                                <p className="text-sm text-gray-600">{doc.type} - {doc.date}</p>
                              </div>
                              <Button variant="outline" size="sm">Voir</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Aucun document disponible</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="presences">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Registre des présences</h3>
                    <p className="text-gray-500">Les données de présence ne sont pas encore disponibles.</p>
                  </div>
                </TabsContent>

                <TabsContent value="conges">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Congés et RTT</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Congés payés</p>
                        <p className="text-2xl font-bold">25 jours</p>
                        <p className="text-sm text-gray-500">Solde disponible</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">RTT</p>
                        <p className="text-2xl font-bold">12 jours</p>
                        <p className="text-sm text-gray-500">Solde disponible</p>
                      </div>
                    </div>

                    <h4 className="font-medium mt-6">Historique des congés</h4>
                    <p className="text-gray-500">Aucun congé n'a été pris.</p>
                  </div>
                </TabsContent>

                <TabsContent value="competences">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Compétences</h3>
                    {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.skills.map((skill, index) => {
                          const skillName = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <Badge key={index} variant="outline" className="px-3 py-1">
                              {skillName}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucune compétence enregistrée</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="evaluations">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Évaluations</h3>
                    {selectedEmployee.evaluations && selectedEmployee.evaluations.length > 0 ? (
                      <ul className="divide-y">
                        {selectedEmployee.evaluations.map((eval) => (
                          <li key={eval.id} className="py-2">
                            <div>
                              <p className="font-medium">{eval.type} - {eval.date}</p>
                              <p className="text-sm">Score: {eval.score}</p>
                              <p className="text-sm text-gray-600">Évaluateur: {eval.evaluator}</p>
                              {eval.comments && <p className="mt-1 text-sm">{eval.comments}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Aucune évaluation disponible</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'employé"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedEmployee?.firstName} ${selectedEmployee?.lastName} ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default EmployeesProfiles;
