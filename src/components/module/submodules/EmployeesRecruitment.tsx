
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  FileCheck, 
  Users, 
  Calendar, 
  Filter 
} from 'lucide-react';
import RecruitmentStats from './employees/RecruitmentStats';

const EmployeesRecruitment: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recrutement</h2>
          <p className="text-gray-500">Gérez vos offres d'emploi et candidatures</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nouvelle offre d'emploi
        </Button>
      </div>
      
      <RecruitmentStats 
        openPositions={4} 
        applicationsThisMonth={32} 
        interviewsScheduled={8}
        applicationsChange={12}
      />
      
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="positions">Offres d'emploi</TabsTrigger>
          <TabsTrigger value="applications">Candidatures</TabsTrigger>
          <TabsTrigger value="interviews">Entretiens</TabsTrigger>
          <TabsTrigger value="archive">Archives</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full md:w-auto flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtres</span>
              </Button>
            </div>
          </CardHeader>
          
          <TabsContent value="positions">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Intitulé</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date publication</TableHead>
                    <TableHead>Candidats</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Développeur Frontend</TableCell>
                    <TableCell>Tech</TableCell>
                    <TableCell>CDI</TableCell>
                    <TableCell>10/03/2023</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Chef de projet</TableCell>
                    <TableCell>Management</TableCell>
                    <TableCell>CDI</TableCell>
                    <TableCell>15/02/2023</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Assistant administratif</TableCell>
                    <TableCell>Administration</TableCell>
                    <TableCell>CDD</TableCell>
                    <TableCell>01/04/2023</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Commercial</TableCell>
                    <TableCell>Ventes</TableCell>
                    <TableCell>CDI</TableCell>
                    <TableCell>23/01/2023</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        En pause
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="applications">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>CV</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Sophie Martin</TableCell>
                    <TableCell>Développeur Frontend</TableCell>
                    <TableCell>01/04/2023</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileCheck className="h-3.5 w-3.5" /> Voir
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        À évaluer
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thomas Dubois</TableCell>
                    <TableCell>Développeur Frontend</TableCell>
                    <TableCell>28/03/2023</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileCheck className="h-3.5 w-3.5" /> Voir
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Présélectionné
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Julie Leroy</TableCell>
                    <TableCell>Chef de projet</TableCell>
                    <TableCell>15/03/2023</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileCheck className="h-3.5 w-3.5" /> Voir
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Entretien planifié
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pierre Moreau</TableCell>
                    <TableCell>Commercial</TableCell>
                    <TableCell>10/03/2023</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileCheck className="h-3.5 w-3.5" /> Voir
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Refusé
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Voir</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="interviews">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Date entretien</TableHead>
                    <TableHead>Lieu / Moyen</TableHead>
                    <TableHead>Interlocuteurs</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Julie Leroy</TableCell>
                    <TableCell>Chef de projet</TableCell>
                    <TableCell>12/04/2023 14:30</TableCell>
                    <TableCell>Visioconférence</TableCell>
                    <TableCell>Marc Dupont, Sarah Legrand</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Planifier
                        </Button>
                        <Button size="sm" variant="ghost">Voir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thomas Dubois</TableCell>
                    <TableCell>Développeur Frontend</TableCell>
                    <TableCell>15/04/2023 10:00</TableCell>
                    <TableCell>Bureau - Salle Everest</TableCell>
                    <TableCell>Céline Martin, Jean Petit</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Planifier
                        </Button>
                        <Button size="sm" variant="ghost">Voir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="archive">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Aucune candidature archivée</h3>
                <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
                  Les candidatures refusées ou pour des postes pourvus sont archivées ici pour référence future.
                </p>
              </div>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default EmployeesRecruitment;
