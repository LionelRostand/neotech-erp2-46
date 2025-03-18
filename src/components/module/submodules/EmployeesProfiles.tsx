
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Building, Briefcase, GraduationCap, Calendar, FileText, Clock } from 'lucide-react';

const EmployeesProfiles: React.FC = () => {
  const [activeTab, setActiveTab] = useState('infos');
  
  // Données simulées d'employé
  const employee = {
    id: "EMP001",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "15 Rue des Lilas, 75011 Paris",
    department: "Marketing",
    position: "Chef de Projet Digital",
    hireDate: "15/03/2021",
    status: "Actif",
    contract: "CDI",
    manager: "Sophie Martin",
    education: [
      { degree: "Master Marketing Digital", school: "HEC Paris", year: "2018" },
      { degree: "Licence Communication", school: "Université Paris-Sorbonne", year: "2016" }
    ],
    skills: ["Marketing digital", "Gestion de projet", "SEO/SEA", "Adobe Creative Suite", "Analyse de données"],
    documents: [
      { name: "Contrat de travail", date: "15/03/2021", type: "Contrat" },
      { name: "Avenant salaire", date: "10/06/2022", type: "Avenant" },
      { name: "Attestation formation", date: "22/09/2022", type: "Formation" }
    ],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la fiche avec informations principales */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo et infos de base */}
            <div className="flex flex-col items-center md:items-start space-y-4 md:w-1/4">
              <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <User size={64} />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
                <p className="text-gray-500">{employee.position}</p>
                <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">{employee.status}</Badge>
              </div>
            </div>
            
            {/* Coordonnées et informations professionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:w-3/4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{employee.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-400" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <span>{employee.contract}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Embauché le {employee.hireDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour les différentes sections de la fiche */}
      <Tabs defaultValue="infos" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>
        
        {/* Onglet Informations personnelles et professionnelles */}
        <TabsContent value="infos">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" value={employee.firstName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" value={employee.lastName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={employee.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={employee.phone} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={employee.address} readOnly />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Input id="department" value={employee.department} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste</Label>
                    <Input id="position" value={employee.position} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Responsable</Label>
                    <Input id="manager" value={employee.manager} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract">Type de contrat</Label>
                    <Input id="contract" value={employee.contract} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Date d'embauche</Label>
                    <Input id="hireDate" value={employee.hireDate} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Input id="status" value={employee.status} readOnly />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Formation</h3>
                <div className="space-y-4">
                  {employee.education.map((edu, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <GraduationCap className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.school}, {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Documents */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Ajouter un document
                </Button>
              </div>
              
              <div className="space-y-4">
                {employee.documents.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Ajouté le {doc.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Compétences */}
        <TabsContent value="competences">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Compétences</h3>
              
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Horaires */}
        <TabsContent value="horaires">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Horaires de travail</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(employee.workSchedule).map(([day, hours]) => (
                  <div key={day} className="p-4 border rounded-md">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglets supplémentaires avec contenus de placeholder */}
        <TabsContent value="conges">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Congés</h3>
              <p className="text-gray-500">Cet employé dispose de 25 jours de congés restants pour l'année en cours.</p>
              <p className="text-sm text-gray-400 mt-4">Fonctionnalité en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluations">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Évaluations</h3>
              <p className="text-gray-500">Dernière évaluation réalisée le 15/12/2022.</p>
              <p className="text-sm text-gray-400 mt-4">Fonctionnalité en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Actions sur la fiche */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline">Exporter PDF</Button>
        <Button variant="outline">Modifier</Button>
      </div>
    </div>
  );
};

export default EmployeesProfiles;
