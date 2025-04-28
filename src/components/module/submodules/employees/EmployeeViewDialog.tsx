
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
import { Employee } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Calendar,
  FileText,
  User,
  Clock,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Building2,
  GraduationCap,
  Award,
  Star,
  ChevronRight,
} from "lucide-react";

interface EmployeeViewDialogProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onEdit?: (employee: Employee) => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  open,
  employee,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!employee) {
    return null;
  }

  // Format date to display in a human-readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non spécifié";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const getEmployeeStatus = (status: string | undefined) => {
    if (!status) return { label: "Non défini", variant: "default" };
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'actif') {
      return { label: "Actif", variant: "success" };
    } else if (statusLower === 'inactive' || statusLower === 'inactif') {
      return { label: "Inactif", variant: "danger" };
    } else if (statusLower === 'onleave' || statusLower === 'en congé') {
      return { label: "En congé", variant: "warning" };
    }
    
    return { label: status, variant: "default" };
  };

  const employeeStatus = getEmployeeStatus(employee.status);

  // Calculate age from birthdate if available
  const calculateAge = (birthdate: string | undefined) => {
    if (!birthdate) return null;
    
    try {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      return null;
    }
  };

  const employeeAge = calculateAge(employee.birthdate);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {employee.photoURL ? (
                <img 
                  src={employee.photoURL} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
              
              <div>
                <DialogTitle className="text-xl">
                  {employee.firstName} {employee.lastName}
                </DialogTitle>
                <div className="flex items-center mt-1">
                  <StatusBadge variant={employeeStatus.variant as "success" | "warning" | "danger" | "outline" | "default"}>
                    {employeeStatus.label}
                  </StatusBadge>
                  {employee.position && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {employee.position}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(employee)}>
                  Modifier
                </Button>
              )}
              <Button variant="secondary">
                Exporter PDF
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="schedule">Horaires</TabsTrigger>
            <TabsTrigger value="leaves">Congés</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          {/* Onglet Informations */}
          <TabsContent value="info" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <Card className="p-4">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations Personnelles
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Nom complet:</span>
                    <span className="text-sm font-medium">{employee.firstName} {employee.lastName}</span>
                  </div>
                  
                  {employee.birthdate && (
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="text-sm text-muted-foreground">Date de naissance:</span>
                      <span className="text-sm">{formatDate(employee.birthdate)} {employeeAge !== null && `(${employeeAge} ans)`}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{employee.email || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Téléphone:</span>
                    <span className="text-sm">{employee.phone || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Adresse:</span>
                    <span className="text-sm">
                      {employee.address ? `${employee.address}, ` : ""}
                      {employee.city || "Ville non spécifiée"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Nationalité:</span>
                    <span className="text-sm">{employee.nationality || "Non spécifiée"}</span>
                  </div>
                </div>
              </Card>
              
              {/* Informations professionnelles */}
              <Card className="p-4">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Informations Professionnelles
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Poste:</span>
                    <span className="text-sm font-medium">{employee.position || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Département:</span>
                    <span className="text-sm">{employee.departmentName || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Manager:</span>
                    <span className="text-sm">{employee.managerName || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Date d'embauche:</span>
                    <span className="text-sm">{formatDate(employee.hireDate)}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Contrat:</span>
                    <span className="text-sm">{employee.contract || "Non spécifié"}</span>
                  </div>
                  
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-sm text-muted-foreground">Salaire:</span>
                    <span className="text-sm">{employee.salary ? `${employee.salary.toLocaleString()} €` : "Non spécifié"}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Informations complémentaires */}
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4">Informations complémentaires</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Éducation */}
                <div>
                  <h4 className="text-sm font-medium flex items-center mb-3">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Formation
                  </h4>
                  
                  {employee.education && employee.education.length > 0 ? (
                    <div className="space-y-3">
                      {employee.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3">
                          <p className="text-sm font-medium">{edu.degree || "Formation"}</p>
                          <p className="text-xs text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune formation renseignée</p>
                  )}
                </div>
                
                {/* Compétences */}
                <div>
                  <h4 className="text-sm font-medium flex items-center mb-3">
                    <Star className="h-4 w-4 mr-2" />
                    Compétences clés
                  </h4>
                  
                  {employee.skills && employee.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
                  )}
                </div>
              </div>
              
              {/* Note / Commentaires */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm italic">
                    {employee.notes || "Aucune note sur cet employé"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Onglet Documents */}
          <TabsContent value="documents" className="pt-4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents de l'employé
              </h3>
              
              {employee.documents && employee.documents.length > 0 ? (
                <div className="space-y-2">
                  {employee.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • Ajouté le {formatDate(doc.dateAdded)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Aucun document trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">Aucun document n'a été ajouté pour cet employé</p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Onglet Compétences */}
          <TabsContent value="skills" className="pt-4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Compétences et qualifications
              </h3>
              
              {employee.skills && employee.skills.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compétences</h4>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {employee.certifications && employee.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Certifications</h4>
                      <div className="space-y-2">
                        {employee.certifications.map((cert, index) => (
                          <div key={index} className="border p-2 rounded-md">
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Obtenue le {formatDate(cert.dateObtained)} • 
                              {cert.expiryDate ? ` Expire le ${formatDate(cert.expiryDate)}` : " Sans date d'expiration"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Aucune compétence trouvée</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucune compétence ou certification n'a été ajoutée pour cet employé
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Onglet Horaires */}
          <TabsContent value="schedule" className="pt-4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horaires de travail
              </h3>
              
              {employee.schedule ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                      <div key={index} className="border rounded-md p-2 text-center">
                        <p className="text-sm font-medium">{day}</p>
                        <p className={`text-xs mt-1 ${index > 4 ? 'text-red-500' : 'text-green-500'}`}>
                          {index < 5 ? '9:00 - 17:00' : 'Repos'}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Note:</span> {employee.schedule.notes || "Horaires standards"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Horaires non définis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucun planning d'horaires n'a été défini pour cet employé
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Onglet Congés */}
          <TabsContent value="leaves" className="pt-4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Congés et absences
              </h3>
              
              {employee.leaves && employee.leaves.length > 0 ? (
                <div className="space-y-4">
                  {employee.leaves.map((leave, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{leave.type || "Congé"}</p>
                          <p className="text-sm">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                        </div>
                        <StatusBadge variant={
                          leave.status === "approved" ? "success" : 
                          leave.status === "pending" ? "warning" : 
                          leave.status === "rejected" ? "danger" : "default"
                        }>
                          {leave.status === "approved" ? "Approuvé" : 
                           leave.status === "pending" ? "En attente" : 
                           leave.status === "rejected" ? "Refusé" : leave.status}
                        </StatusBadge>
                      </div>
                      {leave.reason && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Raison:</p>
                          <p className="text-sm mt-1">{leave.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Solde de congés:</span> {employee.leaveBalance || 0} jours
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Aucun congé trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucune demande de congé n'a été effectuée par cet employé
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Onglet Évaluations */}
          <TabsContent value="evaluations" className="pt-4">
            <Card className="p-4">
              <h3 className="font-medium text-lg mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Évaluations et performances
              </h3>
              
              {employee.evaluations && employee.evaluations.length > 0 ? (
                <div className="space-y-4">
                  {employee.evaluations.map((evaluation, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Évaluation {evaluation.period}</p>
                            <p className="text-xs text-muted-foreground">
                              Effectuée le {formatDate(evaluation.date)} par {evaluation.evaluator}
                            </p>
                          </div>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < (evaluation.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {evaluation.comments && (
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground">Commentaire:</p>
                            <p className="text-sm mt-1">{evaluation.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Aucune évaluation trouvée</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aucune évaluation de performance n'a été enregistrée pour cet employé
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            ID: {employee.id} | Dernière mise à jour: {formatDate(employee.updatedAt) || "N/A"}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button>
              Envoyer identifiants
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
