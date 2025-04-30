
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Pencil, Trash2, UserPlus } from "lucide-react";
import { Employee } from '@/types/employee';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useAddEmployee } from '@/hooks/useAddEmployee';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import EmployeeViewDialog from './EmployeeViewDialog';
import CreateEmployeeDialog from './CreateEmployeeDialog';

// Interface for the component props
interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ 
  employees = [], 
  isLoading = false 
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { deleteEmployee, updateEmployee, isLoading: isActionLoading } = useEmployeeActions();
  const { addEmployee, isLoading: isAddLoading } = useAddEmployee();

  // Filter employees based on search term
  const filteredEmployees = searchTerm
    ? employees.filter(employee => 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employees;

  // Handle employee deletion
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  // Handle employee view
  const handleViewClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  // Confirm employee deletion
  const handleDeleteConfirm = async () => {
    if (selectedEmployee?.id) {
      try {
        await deleteEmployee(selectedEmployee.id);
        toast({
          title: "Employé supprimé",
          description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} a été supprimé avec succès.`,
        });
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de l'employé.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle employee update
  const handleEmployeeUpdate = async (data: Partial<Employee>) => {
    if (!data.id) return;
    
    try {
      await updateEmployee(data);
      toast({
        title: "Employé mis à jour",
        description: "Les informations de l'employé ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'employé.",
        variant: "destructive",
      });
    }
  };

  // Handle employee creation
  const handleCreateEmployee = async (data: Partial<Employee>) => {
    try {
      await addEmployee(data);
      toast({
        title: "Employé créé",
        description: "Le nouvel employé a été créé avec succès.",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'employé.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Employés</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau Employé
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      Aucun employé trouvé
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={employee.photoUrl || employee.photoURL || employee.photo || employee.photoMeta?.data || ''} 
                              alt={`${employee.firstName} ${employee.lastName}`} 
                            />
                            <AvatarFallback>
                              {employee.firstName?.[0]}{employee.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.status === 'active' || employee.status === 'Actif' 
                                ? 'Actif' 
                                : employee.status === 'onLeave' || employee.status === 'En congé'
                                ? 'En congé'
                                : 'Inactif'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.professionalEmail || employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone || 'Non renseigné'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.position || 'Non renseigné'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department || 'Non renseigné'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewClick(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewClick(employee)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(employee)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Employee View/Edit Dialog */}
      {selectedEmployee && (
        <EmployeeViewDialog
          employee={selectedEmployee}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          onUpdate={handleEmployeeUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'employé"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? Cette action est irréversible.`}
        isLoading={isActionLoading}
      />

      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateEmployee}
      />

      {/* Preview of Selected Employee */}
      {selectedEmployee && !isViewDialogOpen && (
        <div className="mt-8 p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-4">Aperçu de l'employé sélectionné</h3>
          
          <div className="flex items-center mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={selectedEmployee.photoUrl || selectedEmployee.photoURL || selectedEmployee.photo || selectedEmployee.photoMeta?.data || ''} 
                alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} 
              />
              <AvatarFallback>
                {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="ml-4">
              <h4 className="text-xl font-bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h4>
              <p className="text-gray-500">{selectedEmployee.position || 'Poste non renseigné'}</p>
            </div>
          </div>
          
          <Tabs defaultValue="informations">
            <TabsList>
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="presences">Présences</TabsTrigger>
              <TabsTrigger value="conges">Congés</TabsTrigger>
              <TabsTrigger value="competences">Compétences</TabsTrigger>
              <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informations" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Informations personnelles</h5>
                  <p><span className="font-medium">Email :</span> {selectedEmployee.email}</p>
                  <p><span className="font-medium">Téléphone :</span> {selectedEmployee.phone || 'Non renseigné'}</p>
                  <p><span className="font-medium">Adresse :</span> {
                    typeof selectedEmployee.address === 'string' 
                      ? selectedEmployee.address 
                      : selectedEmployee.address 
                        ? `${selectedEmployee.address.street || ''}, ${selectedEmployee.address.city || ''}, ${selectedEmployee.address.postalCode || ''}` 
                        : 'Non renseignée'
                  }</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Informations professionnelles</h5>
                  <p><span className="font-medium">Email pro :</span> {selectedEmployee.professionalEmail || 'Non renseigné'}</p>
                  <p><span className="font-medium">Département :</span> {selectedEmployee.department || 'Non renseigné'}</p>
                  <p><span className="font-medium">Type de contrat :</span> {selectedEmployee.contract || 'Non renseigné'}</p>
                  <p><span className="font-medium">Date d'embauche :</span> {selectedEmployee.hireDate || 'Non renseignée'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="pt-4">
              <h5 className="font-semibold mb-2">Documents</h5>
              {selectedEmployee.documents && selectedEmployee.documents.length > 0 ? (
                <ul className="divide-y">
                  {selectedEmployee.documents.map((doc) => (
                    <li key={doc.id} className="py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-gray-500">Ajouté le {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <Button variant="outline" size="sm">Voir</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun document disponible</p>
              )}
            </TabsContent>
            
            <TabsContent value="presences" className="pt-4">
              <h5 className="font-semibold mb-2">Registre des présences</h5>
              <p className="text-gray-500">Fonctionnalité à venir</p>
            </TabsContent>
            
            <TabsContent value="conges" className="pt-4">
              <h5 className="font-semibold mb-2">Congés</h5>
              {selectedEmployee.absences && selectedEmployee.absences.length > 0 ? (
                <ul className="divide-y">
                  {selectedEmployee.absences.map((absence) => (
                    <li key={absence.id} className="py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{absence.type}</p>
                          <p className="text-sm text-gray-500">
                            Du {new Date(absence.startDate).toLocaleDateString()} au {new Date(absence.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          absence.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          absence.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {absence.status === 'approved' ? 'Approuvé' : 
                           absence.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun congé enregistré</p>
              )}
            </TabsContent>
            
            <TabsContent value="competences" className="pt-4">
              <h5 className="font-semibold mb-2">Compétences</h5>
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((skill, index) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">Aucune compétence enregistrée</p>
              )}
            </TabsContent>
            
            <TabsContent value="evaluations" className="pt-4">
              <h5 className="font-semibold mb-2">Évaluations</h5>
              {selectedEmployee.evaluations && selectedEmployee.evaluations.length > 0 ? (
                <ul className="divide-y">
                  {selectedEmployee.evaluations.map((evaluation) => (
                    <li key={evaluation.id} className="py-2">
                      <div>
                        <p className="font-medium">{evaluation.type} - {new Date(evaluation.date).toLocaleDateString()}</p>
                        <p className="text-sm">Score: {evaluation.score}</p>
                        <p className="text-sm text-gray-500">Évaluateur: {evaluation.evaluator}</p>
                        {evaluation.comments && (
                          <p className="text-sm mt-1">{evaluation.comments}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucune évaluation disponible</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EmployeesProfiles;
