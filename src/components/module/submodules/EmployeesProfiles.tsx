
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, GraduationCap, 
  Calendar, FileText, Clock, Search, UserPlus, FileEdit, Trash2, Eye
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';

// Interface pour les données d'employé
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  hireDate: string;
  status: "Actif" | "Inactif";
  contract: string;
  manager: string;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
  documents: Array<{
    name: string;
    date: string;
    type: string;
  }>;
  workSchedule: {
    [key: string]: string;
  };
}

const EmployeesProfiles: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Données simulées d'employés
  const employees: Employee[] = [
    {
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
    },
    {
      id: "EMP002",
      firstName: "Lionel",
      lastName: "Djossa",
      email: "lionel.djossa@example.com",
      phone: "+33 6 98 76 54 32",
      address: "8 Avenue Victor Hugo, 75016 Paris",
      department: "Direction",
      position: "PDG",
      hireDate: "27/03/2025",
      status: "Actif",
      contract: "CDI",
      manager: "",
      education: [
        { degree: "MBA Management", school: "INSEAD", year: "2015" },
        { degree: "Master Finance", school: "HEC Paris", year: "2013" }
      ],
      skills: ["Leadership", "Stratégie", "Finance", "Management", "Négociation"],
      documents: [
        { name: "Contrat de travail", date: "27/03/2025", type: "Contrat" }
      ],
      workSchedule: {
        monday: "08:30 - 19:00",
        tuesday: "08:30 - 19:00",
        wednesday: "08:30 - 19:00",
        thursday: "08:30 - 19:00",
        friday: "08:30 - 18:00",
      }
    },
    {
      id: "EMP003",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@example.com",
      phone: "+33 6 45 67 89 01",
      address: "25 Rue du Commerce, 75015 Paris",
      department: "Marketing",
      position: "Directrice Marketing",
      hireDate: "05/01/2020",
      status: "Actif",
      contract: "CDI",
      manager: "Lionel Djossa",
      education: [
        { degree: "Master Marketing", school: "ESSEC", year: "2012" }
      ],
      skills: ["Stratégie marketing", "Management d'équipe", "Budgétisation", "Communication"],
      documents: [
        { name: "Contrat de travail", date: "05/01/2020", type: "Contrat" },
        { name: "Avenant promotion", date: "15/12/2021", type: "Avenant" }
      ],
      workSchedule: {
        monday: "09:00 - 18:00",
        tuesday: "09:00 - 18:00",
        wednesday: "09:00 - 18:00",
        thursday: "09:00 - 18:00",
        friday: "09:00 - 17:00",
      }
    }
  ];

  // Filtrage des employés selon la recherche
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employee.department.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Contenu de la fiche détaillée d'un employé sélectionné
  const employeeDetails = (employee: Employee) => (
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
                <Badge className={`mt-2 ${employee.status === 'Actif' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}`}>
                  {employee.status}
                </Badge>
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
      <Tabs defaultValue="infos" className="w-full">
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
                    <Input id="manager" value={employee.manager || "N/A"} readOnly />
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

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <div className="space-y-6">
      {selectedEmployee ? (
        <>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEmployee(null)}
              className="mr-2"
            >
              <span className="mr-2">←</span> Retour à la liste
            </Button>
          </div>
          {employeeDetails(selectedEmployee)}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center text-xl font-semibold">
              <User className="h-6 w-6 text-green-500 mr-2" />
              Liste des Employés
            </div>
            
            <Button variant="default" className="bg-green-500 hover:bg-green-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel employé
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Rechercher un employé..." 
                className="pl-10 w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Type de contrat</TableHead>
                    <TableHead>Date d'entrée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.contract}</TableCell>
                      <TableCell>{employee.hireDate}</TableCell>
                      <TableCell>
                        <Badge className={`${
                          employee.status === "Actif" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun employé trouvé.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeesProfiles;
