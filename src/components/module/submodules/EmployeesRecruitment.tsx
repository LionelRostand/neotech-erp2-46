
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, UserPlus, Briefcase, Calendar, Star, MapPin, CheckCircle2, XCircle, PieChart } from 'lucide-react';

const EmployeesRecruitment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample job openings data
  const jobOpenings = [
    { 
      id: 1, 
      title: 'Développeur Front-end React', 
      department: 'Développement',
      location: 'Paris, France',
      type: 'CDI',
      postedDate: '2025-01-05', 
      status: 'Ouvert',
      applicants: 12,
      interviews: 4
    },
    { 
      id: 2, 
      title: 'Chef de Projet Marketing', 
      department: 'Marketing',
      location: 'Paris, France',
      type: 'CDI',
      postedDate: '2024-12-15', 
      status: 'Ouvert',
      applicants: 8,
      interviews: 3
    },
    { 
      id: 3, 
      title: 'Comptable', 
      department: 'Finance',
      location: 'Lyon, France',
      type: 'CDI',
      postedDate: '2024-12-01', 
      status: 'Fermé',
      applicants: 15,
      interviews: 6
    },
    { 
      id: 4, 
      title: 'Assistant Commercial', 
      department: 'Ventes',
      location: 'Paris, France',
      type: 'CDD',
      postedDate: '2025-01-10', 
      status: 'Ouvert',
      applicants: 6,
      interviews: 0
    },
    { 
      id: 5, 
      title: 'Stagiaire Développement', 
      department: 'Développement',
      location: 'Bordeaux, France',
      type: 'Stage',
      postedDate: '2024-12-20', 
      status: 'Ouvert',
      applicants: 9,
      interviews: 2
    }
  ];
  
  // Sample candidates data
  const candidates = [
    { 
      id: 1, 
      name: 'Julie Martin', 
      position: 'Développeur Front-end React',
      email: 'julie.martin@example.com',
      phone: '06 12 34 56 78',
      source: 'LinkedIn',
      status: 'Entretien planifié',
      rating: 4,
      lastContact: '2025-01-15'
    },
    { 
      id: 2, 
      name: 'Alexandre Dubois', 
      position: 'Développeur Front-end React',
      email: 'alex.dubois@example.com',
      phone: '06 23 45 67 89',
      source: 'Indeed',
      status: 'Entretien complété',
      rating: 5,
      lastContact: '2025-01-12'
    },
    { 
      id: 3, 
      name: 'Sarah Lambert', 
      position: 'Chef de Projet Marketing',
      email: 'sarah.lambert@example.com',
      phone: '06 34 56 78 90',
      source: 'Site Web',
      status: 'Candidature reçue',
      rating: 3,
      lastContact: '2025-01-10'
    },
    { 
      id: 4, 
      name: 'Thomas Petit', 
      position: 'Développeur Front-end React',
      email: 'thomas.petit@example.com',
      phone: '06 45 67 89 01',
      source: 'Recommandation',
      status: 'Offre envoyée',
      rating: 5,
      lastContact: '2025-01-14'
    },
    { 
      id: 5, 
      name: 'Emma Leroy', 
      position: 'Chef de Projet Marketing',
      email: 'emma.leroy@example.com',
      phone: '06 56 78 90 12',
      source: 'LinkedIn',
      status: 'Entretien planifié',
      rating: 4,
      lastContact: '2025-01-16'
    }
  ];
  
  // Filter job openings based on search query
  const filteredJobOpenings = jobOpenings.filter(
    job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter candidates based on search query
  const filteredCandidates = candidates.filter(
    candidate => 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Recrutement</h2>
        
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un candidat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau candidat</DialogTitle>
                <DialogDescription>
                  Entrez les informations du candidat pour le suivi du recrutement.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nom complet *</label>
                    <Input id="name" placeholder="Ex: Julie Martin" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email *</label>
                    <Input id="email" type="email" placeholder="Ex: julie.martin@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                    <Input id="phone" placeholder="Ex: 06 12 34 56 78" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="position" className="text-sm font-medium">Poste concerné *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev-frontend">Développeur Front-end React</SelectItem>
                        <SelectItem value="chef-marketing">Chef de Projet Marketing</SelectItem>
                        <SelectItem value="assistant">Assistant Commercial</SelectItem>
                        <SelectItem value="stagiaire">Stagiaire Développement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="source" className="text-sm font-medium">Source</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Source de candidature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="indeed">Indeed</SelectItem>
                        <SelectItem value="website">Site Web</SelectItem>
                        <SelectItem value="recommendation">Recommandation</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Statut</label>
                    <Select defaultValue="new">
                      <SelectTrigger>
                        <SelectValue placeholder="Statut du candidat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Candidature reçue</SelectItem>
                        <SelectItem value="screening">Présélection</SelectItem>
                        <SelectItem value="interview">Entretien planifié</SelectItem>
                        <SelectItem value="offer">Offre envoyée</SelectItem>
                        <SelectItem value="hired">Embauché</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="resume" className="text-sm font-medium">CV</label>
                  <Input id="resume" type="file" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <textarea 
                    id="notes" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                    placeholder="Notes sur le candidat..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Annuler</Button>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Nouvelle offre
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Publier une nouvelle offre d'emploi</DialogTitle>
                <DialogDescription>
                  Complétez les informations pour créer une offre d'emploi.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">Titre du poste *</label>
                  <Input id="jobTitle" placeholder="Ex: Développeur Front-end React" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium">Département *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Développement</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="sales">Ventes</SelectItem>
                        <SelectItem value="hr">Ressources Humaines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">Localisation *</label>
                    <Input id="location" placeholder="Ex: Paris, France" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Type de contrat *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de contrat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cdi">CDI</SelectItem>
                        <SelectItem value="cdd">CDD</SelectItem>
                        <SelectItem value="stage">Stage</SelectItem>
                        <SelectItem value="alternance">Alternance</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="salary" className="text-sm font-medium">Fourchette de salaire</label>
                    <Input id="salary" placeholder="Ex: 35 000 € - 45 000 €" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description du poste *</label>
                  <textarea 
                    id="description" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={5}
                    placeholder="Description détaillée du poste..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium">Prérequis *</label>
                  <textarea 
                    id="requirements" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                    placeholder="Qualifications et expérience requises..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="publish" className="flex items-center space-x-2">
                    <input type="checkbox" id="publish" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm">Publier immédiatement sur les sites d'emploi partenaires</span>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Enregistrer comme brouillon</Button>
                <Button type="submit">Publier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
          <TabsTrigger value="candidates">Candidats</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Offres d'emploi actives</h3>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher une offre..."
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
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de publication</TableHead>
                      <TableHead>Candidats</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobOpenings.length > 0 ? (
                      filteredJobOpenings.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 text-primary mr-2" />
                              {job.title}
                            </div>
                          </TableCell>
                          <TableCell>{job.department}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                              {job.location}
                            </div>
                          </TableCell>
                          <TableCell>{job.type}</TableCell>
                          <TableCell>{new Date(job.postedDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span>{job.applicants} candidats</span>
                              {job.interviews > 0 && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 ml-1">
                                  {job.interviews} entretiens
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              job.status === 'Ouvert' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Voir</Button>
                            <Button variant="ghost" size="sm">Modifier</Button>
                            {job.status === 'Ouvert' ? (
                              <Button variant="ghost" size="sm">Fermer</Button>
                            ) : (
                              <Button variant="ghost" size="sm">Réouvrir</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune offre d'emploi trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Offres actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">Postes ouverts actuellement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Candidatures reçues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">+12</span> ce mois-ci
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Entretiens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground mt-1">Prévus pour ce mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25.7%</div>
                <p className="text-xs text-muted-foreground mt-1">Candidature → Entretien</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <Tabs defaultValue="all" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="new">Nouveaux</TabsTrigger>
                    <TabsTrigger value="interview">Entretien</TabsTrigger>
                    <TabsTrigger value="offer">Offre</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un candidat..."
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
                      <TableHead>Candidat</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {candidate.name}
                            </div>
                          </TableCell>
                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs">
                              <span>{candidate.email}</span>
                              <span className="text-muted-foreground">{candidate.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>{candidate.source}</TableCell>
                          <TableCell>
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < candidate.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              candidate.status === 'Candidature reçue' 
                                ? 'bg-blue-100 text-blue-800' 
                                : candidate.status === 'Entretien planifié'
                                ? 'bg-amber-100 text-amber-800'
                                : candidate.status === 'Entretien complété'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }>
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(candidate.lastContact).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Voir</Button>
                            <Button variant="ghost" size="sm">
                              {candidate.status === 'Candidature reçue' ? 'Planifier' : 'Avancer'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucun candidat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                  <Badge>9</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {candidates
                    .filter(c => c.status === 'Candidature reçue')
                    .map((c, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-md text-sm">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.position}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Présélection</CardTitle>
                  <Badge>5</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    <div className="font-medium">Maxime Bernard</div>
                    <div className="text-xs text-muted-foreground">Développeur Front-end React</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    <div className="font-medium">Claire Fournier</div>
                    <div className="text-xs text-muted-foreground">Chef de Projet Marketing</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    <div className="font-medium">Lucas Moreau</div>
                    <div className="text-xs text-muted-foreground">Stagiaire Développement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Entretien</CardTitle>
                  <Badge>4</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {candidates
                    .filter(c => c.status === 'Entretien planifié' || c.status === 'Entretien complété')
                    .map((c, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-md text-sm">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.position}</div>
                        <div className="text-xs mt-1 flex items-center">
                          {c.status === 'Entretien planifié' ? (
                            <Calendar className="h-3 w-3 text-amber-500 mr-1" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                          )}
                          <span>{c.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Offre</CardTitle>
                  <Badge>2</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {candidates
                    .filter(c => c.status === 'Offre envoyée')
                    .map((c, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-md text-sm">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.position}</div>
                        <div className="flex items-center mt-1">
                          <div className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                            Offre envoyée
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="p-2 bg-gray-50 rounded-md text-sm">
                    <div className="font-medium">Sophie Laurent</div>
                    <div className="text-xs text-muted-foreground">Assistant Commercial</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                        Offre envoyée
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        En attente
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Performance du recrutement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Temps de recrutement moyen</h4>
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-2xl font-bold">32</div>
                      <div className="text-xs text-muted-foreground">jours</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    De la publication à l'embauche
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Candidats par poste</h4>
                  <div className="flex items-center">
                    <UserPlus className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-2xl font-bold">11.6</div>
                      <div className="text-xs text-muted-foreground">candidats/poste</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    En moyenne pour tous les postes
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Taux de recrutement</h4>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-2xl font-bold">82%</div>
                      <div className="text-xs text-muted-foreground">postes pourvus</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sur les 6 derniers mois
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium mb-3">Sources de candidatures</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>LinkedIn</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Indeed</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Site Web</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Recommandations</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Autres</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesRecruitment;
