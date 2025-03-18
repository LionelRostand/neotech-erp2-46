
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, GraduationCap, BookOpen, Calendar, CheckCircle2, Clock } from 'lucide-react';

const EmployeesTrainings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample trainings data
  const trainings = [
    { 
      id: 1, 
      title: 'Introduction à React', 
      category: 'Développement',
      provider: 'Tech Academy',
      duration: '14h',
      startDate: '2025-02-10', 
      endDate: '2025-02-12',
      status: 'Planifié',
      employees: ['Sophie Dubois', 'Pierre Durand']
    },
    { 
      id: 2, 
      title: 'Leadership & Management', 
      category: 'Management',
      provider: 'Business School',
      duration: '21h',
      startDate: '2025-01-15', 
      endDate: '2025-01-20',
      status: 'En cours',
      employees: ['Thomas Martin', 'Jean Dupont']
    },
    { 
      id: 3, 
      title: 'Excel Avancé', 
      category: 'Bureautique',
      provider: 'Office Learning',
      duration: '7h',
      startDate: '2024-12-05', 
      endDate: '2024-12-05',
      status: 'Terminé',
      employees: ['Marie Lambert', 'Jean Dupont', 'Sophie Dubois']
    },
    { 
      id: 4, 
      title: 'RGPD et Sécurité des données', 
      category: 'Juridique',
      provider: 'Legal Training',
      duration: '3.5h',
      startDate: '2024-11-20', 
      endDate: '2024-11-20',
      status: 'Terminé',
      employees: ['Thomas Martin', 'Marie Lambert', 'Jean Dupont', 'Sophie Dubois', 'Pierre Durand']
    },
    { 
      id: 5, 
      title: 'Communication et prise de parole', 
      category: 'Communication',
      provider: 'Speak Up',
      duration: '14h',
      startDate: '2025-03-01', 
      endDate: '2025-03-02',
      status: 'Planifié',
      employees: ['Marie Lambert', 'Thomas Martin']
    }
  ];
  
  // Sample employee training data
  const employeeTrainings = [
    {
      id: 1,
      employee: 'Thomas Martin',
      department: 'Marketing',
      completedTrainings: 2,
      ongoingTrainings: 1,
      plannedTrainings: 1,
      totalHours: 35,
      certifications: ['Marketing Digital', 'RGPD']
    },
    {
      id: 2,
      employee: 'Sophie Dubois',
      department: 'Développement',
      completedTrainings: 2,
      ongoingTrainings: 0,
      plannedTrainings: 1,
      totalHours: 21,
      certifications: ['React Advanced', 'TypeScript']
    },
    {
      id: 3,
      employee: 'Jean Dupont',
      department: 'Finance',
      completedTrainings: 2,
      ongoingTrainings: 1,
      plannedTrainings: 0,
      totalHours: 28,
      certifications: ['Analyse Financière']
    },
    {
      id: 4,
      employee: 'Marie Lambert',
      department: 'Ressources Humaines',
      completedTrainings: 2,
      ongoingTrainings: 0,
      plannedTrainings: 1,
      totalHours: 24.5,
      certifications: ['Gestion RH']
    },
    {
      id: 5,
      employee: 'Pierre Durand',
      department: 'Développement',
      completedTrainings: 1,
      ongoingTrainings: 0,
      plannedTrainings: 1,
      totalHours: 14,
      certifications: []
    }
  ];
  
  // Filter trainings based on search query and tab
  const filteredTrainings = trainings.filter(
    training => 
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.employees.some(emp => emp.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter employees based on search query
  const filteredEmployees = employeeTrainings.filter(
    empTraining => 
      empTraining.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      empTraining.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Formations</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle formation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle formation</DialogTitle>
              <DialogDescription>
                Complétez les informations pour organiser une formation pour vos employés.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Titre de la formation *</label>
                  <Input id="title" placeholder="Ex: Introduction à React" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Catégorie *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Développement</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="office">Bureautique</SelectItem>
                      <SelectItem value="legal">Juridique</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="provider" className="text-sm font-medium">Organisme de formation *</label>
                  <Input id="provider" placeholder="Ex: Tech Academy" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">Durée *</label>
                  <Input id="duration" placeholder="Ex: 14h" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">Date de début *</label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">Date de fin *</label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="employees" className="text-sm font-medium">Employés concernés *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner des employés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les employés</SelectItem>
                    <SelectItem value="dev">Équipe Développement</SelectItem>
                    <SelectItem value="marketing">Équipe Marketing</SelectItem>
                    <SelectItem value="finance">Équipe Finance</SelectItem>
                    <SelectItem value="hr">Équipe RH</SelectItem>
                    <SelectItem value="custom">Sélection personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea 
                  id="description" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  placeholder="Description de la formation..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="notification" className="flex items-center space-x-2">
                  <input type="checkbox" id="notification" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm">Envoyer des notifications aux employés concernés</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Créer la formation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="trainings">
        <TabsList className="mb-4">
          <TabsTrigger value="trainings">Formations</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainings" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Tabs defaultValue="all" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="all">Toutes</TabsTrigger>
                      <TabsTrigger value="active">En cours</TabsTrigger>
                      <TabsTrigger value="planned">Planifiées</TabsTrigger>
                      <TabsTrigger value="completed">Terminées</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formation</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Organisme</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainings.length > 0 ? (
                      filteredTrainings.map((training) => (
                        <TableRow key={training.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 text-primary mr-2" />
                              {training.title}
                            </div>
                          </TableCell>
                          <TableCell>{training.category}</TableCell>
                          <TableCell>{training.provider}</TableCell>
                          <TableCell>
                            {new Date(training.startDate).toLocaleDateString('fr-FR')} - {new Date(training.endDate).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>{training.duration}</TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {training.employees.slice(0, 3).map((employee, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px]">
                                    {employee.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {training.employees.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                                  +{training.employees.length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              training.status === 'Terminé' 
                                ? 'bg-green-100 text-green-800' 
                                : training.status === 'En cours'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }>
                              {training.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Voir</Button>
                            <Button variant="ghost" size="sm">Modifier</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune formation trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Formations par employé</h3>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un employé..."
                    className="w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Formations complétées</TableHead>
                      <TableHead>Formations en cours</TableHead>
                      <TableHead>Formations planifiées</TableHead>
                      <TableHead>Heures totales</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.employee}</TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              <span>{emp.completedTrainings}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-500 mr-1" />
                              <span>{emp.ongoingTrainings}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-amber-500 mr-1" />
                              <span>{emp.plannedTrainings}</span>
                            </div>
                          </TableCell>
                          <TableCell>{emp.totalHours}h</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {emp.certifications.length > 0 ? (
                                emp.certifications.map((cert, index) => (
                                  <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800">
                                    {cert}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">Aucune</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Détails</Button>
                            <Button variant="ghost" size="sm">Ajouter</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucun employé trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des formations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">Sur les 12 derniers mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Heures de formation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">59.5h</div>
                <p className="text-xs text-muted-foreground mt-1">Sur les 12 derniers mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Moyenne par employé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.9h</div>
                <p className="text-xs text-muted-foreground mt-1">Sur les 12 derniers mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Budget utilisé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,500€</div>
                <p className="text-xs text-muted-foreground mt-1">85% du budget annuel</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Développement</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Management</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Bureautique</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Juridique</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Communication</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Formations par département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      2
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">Développement</h4>
                      <p className="text-xs text-muted-foreground">28h de formation, 2 employés</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                      1
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">Marketing</h4>
                      <p className="text-xs text-muted-foreground">14h de formation, 1 employé</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                      1
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">Ressources Humaines</h4>
                      <p className="text-xs text-muted-foreground">10.5h de formation, 1 employé</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                      1
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-sm">Finance</h4>
                      <p className="text-xs text-muted-foreground">7h de formation, 1 employé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesTrainings;
