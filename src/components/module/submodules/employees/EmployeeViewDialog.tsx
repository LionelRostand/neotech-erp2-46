
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employee";
import { FileText, Mail, Calendar, User, Award, Users } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";

interface EmployeeViewDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditEmployee?: (employee: Employee) => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onEditEmployee
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  
  if (!employee) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Non spécifié";
    
    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // If the date is invalid, try to parse it as DD/MM/YYYY format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return dateStr; // Return original format if it's already DD/MM/YYYY
        }
        return "Date invalide";
      }
      
      // Format the date as DD/MM/YYYY for display
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateStr; // Return as is if can't format
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return "success";
      case 'inactive':
      case 'inactif':
        return "destructive";
      case 'onleave':
      case 'en congé':
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return "Actif";
      case 'inactive':
      case 'inactif':
        return "Inactif";
      case 'onleave':
      case 'en congé':
        return "En congé";
      default:
        return status || "Non défini";
    }
  };

  const handleEditEmployee = () => {
    if (onEditEmployee) {
      onEditEmployee(employee);
      onOpenChange(false);
    }
  };

  const handleExportPdf = () => {
    toast.info("La fonction d'export PDF sera disponible prochainement");
  };

  const sendCredentials = () => {
    toast.success(`Identifiants de connexion envoyés à ${employee.email}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {employee.photoURL ? (
                <img 
                  src={employee.photoURL} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                  className="h-16 w-16 rounded-full object-cover border"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xl border">
                  {employee.firstName?.charAt(0) || ''}{employee.lastName?.charAt(0) || ''}
                </div>
              )}
              <div>
                <DialogTitle className="text-2xl">
                  {employee.firstName} {employee.lastName}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getStatusBadgeVariant(employee.status || '')}`}>
                    {formatStatusLabel(employee.status || '')}
                  </Badge>
                  <span className="text-gray-500">{employee.position}</span>
                </div>
              </div>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                Exporter PDF
              </Button>
              <Button variant="outline" size="sm" onClick={sendCredentials}>
                Envoyer identifiants
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="informations" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="informations" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Informations</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Compétences</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Horaires</span>
            </TabsTrigger>
            <TabsTrigger value="leaves" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Congés</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Évaluations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Nom:</span>
                      <span>{employee.lastName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Prénom:</span>
                      <span>{employee.firstName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Date de naissance:</span>
                      <span>{formatDate(employee.birthDate || '')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Email personnel:</span>
                      <span>{employee.email}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Téléphone:</span>
                      <span>{employee.phone || "Non spécifié"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Adresse:</span>
                      <span>
                        {typeof employee.address === 'string'
                          ? employee.address
                          : employee.address
                          ? `${employee.address.street}, ${employee.address.postalCode} ${employee.address.city}`
                          : "Non spécifiée"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sécurité sociale</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Numéro:</span>
                      <span>{employee.socialSecurityNumber || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations professionnelles</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Poste:</span>
                      <span>{employee.position}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Service:</span>
                      <span>{employee.department}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Date d'embauche:</span>
                      <span>{formatDate(employee.hireDate || employee.startDate || '')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Type de contrat:</span>
                      <span>{employee.contract || "Non spécifié"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Email professionnel:</span>
                      <span>{employee.professionalEmail || employee.email}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Manager:</span>
                      <span>{employee.manager || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Statut</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Contrat actuel:</span>
                      <Badge className={`${getStatusBadgeVariant(employee.status || '')}`}>
                        {formatStatusLabel(employee.status || '')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              {employee.documents && employee.documents.length > 0 ? (
                <div className="divide-y">
                  {employee.documents.map((doc, index) => (
                    <div key={index} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">{formatDate(doc.date)}</div>
                      </div>
                      <div>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucun document disponible</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="skills">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compétences</h3>
              {employee.skills && employee.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucune compétence enregistrée</p>
                </div>
              )}
              
              <h3 className="text-lg font-semibold mt-6">Formation</h3>
              {employee.education && employee.education.length > 0 ? (
                <div className="divide-y">
                  {employee.education.map((edu, index) => (
                    <div key={index} className="py-2">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-gray-500">{edu.school}, {edu.year}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucune formation enregistrée</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Horaires de travail</h3>
              {employee.workSchedule ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Jour</th>
                        <th className="px-4 py-2 text-left">Horaires</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-t px-4 py-2">Lundi</td>
                        <td className="border-t px-4 py-2">{employee.workSchedule.monday || "Non défini"}</td>
                      </tr>
                      <tr>
                        <td className="border-t px-4 py-2">Mardi</td>
                        <td className="border-t px-4 py-2">{employee.workSchedule.tuesday || "Non défini"}</td>
                      </tr>
                      <tr>
                        <td className="border-t px-4 py-2">Mercredi</td>
                        <td className="border-t px-4 py-2">{employee.workSchedule.wednesday || "Non défini"}</td>
                      </tr>
                      <tr>
                        <td className="border-t px-4 py-2">Jeudi</td>
                        <td className="border-t px-4 py-2">{employee.workSchedule.thursday || "Non défini"}</td>
                      </tr>
                      <tr>
                        <td className="border-t px-4 py-2">Vendredi</td>
                        <td className="border-t px-4 py-2">{employee.workSchedule.friday || "Non défini"}</td>
                      </tr>
                      {employee.workSchedule.saturday && (
                        <tr>
                          <td className="border-t px-4 py-2">Samedi</td>
                          <td className="border-t px-4 py-2">{employee.workSchedule.saturday}</td>
                        </tr>
                      )}
                      {employee.workSchedule.sunday && (
                        <tr>
                          <td className="border-t px-4 py-2">Dimanche</td>
                          <td className="border-t px-4 py-2">{employee.workSchedule.sunday}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucun horaire défini</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="leaves">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Congés</h3>
              {employee.leaveRequests && employee.leaveRequests.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Date de début</th>
                        <th className="px-4 py-2 text-left">Date de fin</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.leaveRequests.map((leave, index) => (
                        <tr key={index}>
                          <td className="border-t px-4 py-2">{formatDate(leave.startDate)}</td>
                          <td className="border-t px-4 py-2">{formatDate(leave.endDate)}</td>
                          <td className="border-t px-4 py-2">{leave.type}</td>
                          <td className="border-t px-4 py-2">
                            <Badge variant={
                              leave.status === 'approved' || leave.status === 'Approuvé' ? 'success' :
                              leave.status === 'rejected' || leave.status === 'Refusé' ? 'destructive' :
                              'secondary'
                            }>
                              {leave.status === 'pending' ? 'En attente' : 
                               leave.status === 'approved' ? 'Approuvé' :
                               leave.status === 'rejected' ? 'Refusé' : 
                               leave.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucun congé enregistré</p>
                </div>
              )}
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.conges && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Congés payés</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Acquis:</span>
                        <span>{employee.conges.acquired} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pris:</span>
                        <span>{employee.conges.taken} jours</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Solde:</span>
                        <span>{employee.conges.balance} jours</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {employee.rtt && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">RTT</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Acquis:</span>
                        <span>{employee.rtt.acquired} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pris:</span>
                        <span>{employee.rtt.taken} jours</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Solde:</span>
                        <span>{employee.rtt.balance} jours</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="evaluations">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Évaluations</h3>
              {employee.evaluations && employee.evaluations.length > 0 ? (
                <div className="space-y-4">
                  {employee.evaluations.map((eval, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{eval.title || `Évaluation du ${formatDate(eval.date)}`}</div>
                          <div className="text-sm text-gray-500">Évaluateur: {eval.evaluatorName || eval.evaluator || 'Non spécifié'}</div>
                        </div>
                        <Badge variant={
                          eval.status === 'Complétée' ? 'success' :
                          eval.status === 'Annulée' ? 'destructive' :
                          'secondary'
                        }>
                          {eval.status || 'Planifiée'}
                        </Badge>
                      </div>
                      {eval.rating && (
                        <div className="mt-2">
                          <span className="font-medium">Note: </span>
                          <span>{eval.rating}/5</span>
                        </div>
                      )}
                      {eval.score && (
                        <div className="mt-2">
                          <span className="font-medium">Score: </span>
                          <span>{eval.score}/{eval.maxScore || 100}</span>
                        </div>
                      )}
                      {eval.comments && (
                        <div className="mt-2">
                          <span className="font-medium">Commentaires: </span>
                          <p className="text-gray-700 mt-1">{eval.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-gray-500">Aucune évaluation enregistrée</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="default" onClick={handleEditEmployee}>
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
