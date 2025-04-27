
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  UserPlus, 
  Download,
  Eye,
  Pencil
} from 'lucide-react';

// Mock data for students
const students = [
  {
    id: '1',
    name: 'Kamga Jean Paul',
    class: '3ème',
    matricule: 'ST2023001',
    status: 'active',
    gender: 'M',
    contactPhone: '677123456'
  },
  {
    id: '2',
    name: 'Nguefack Marie',
    class: '1ère',
    matricule: 'ST2023002',
    status: 'active',
    gender: 'F',
    contactPhone: '655987654'
  },
  {
    id: '3',
    name: 'Mbarga Alain',
    class: 'Terminale',
    matricule: 'ST2022045',
    status: 'inactive',
    gender: 'M',
    contactPhone: '699123456'
  },
  {
    id: '4',
    name: 'Essomba Claire',
    class: '5ème',
    matricule: 'ST2023078',
    status: 'active',
    gender: 'F',
    contactPhone: '677889900'
  },
  {
    id: '5',
    name: 'Fotso Michel',
    class: '2nde',
    matricule: 'ST2022089',
    status: 'active',
    gender: 'M',
    contactPhone: '655112233'
  },
];

const AcademyStudents = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Élèves</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel élève
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Liste des élèves</TabsTrigger>
            <TabsTrigger value="cards">Cartes d'élèves</TabsTrigger>
            <TabsTrigger value="files">Dossiers scolaires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des élèves inscrits</CardTitle>
                <CardDescription>
                  Consultez et gérez les dossiers des élèves de l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un élève..." className="w-full" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matricule</TableHead>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.matricule}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>{student.gender === 'M' ? 'Masculin' : 'Féminin'}</TableCell>
                          <TableCell>{student.contactPhone}</TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'active' ? 'success' : 'secondary'}>
                              {student.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Voir le profil">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Éditer l'élève">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Télécharger le dossier">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Affichage de 5 élèves sur un total de 150
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cartes d'élèves</CardTitle>
                <CardDescription>
                  Génération des cartes d'identité scolaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Fonctionnalité de génération des cartes d'identité scolaire en cours de développement.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dossiers scolaires</CardTitle>
                <CardDescription>
                  Gestion des dossiers complets des élèves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Module de gestion des dossiers scolaires (administratif, médical, pédagogique) en cours de développement.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyStudents;
