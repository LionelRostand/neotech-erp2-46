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
import { Search, Plus, Star, Calendar, ClipboardList, Award, ChevronRight, Eye, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Evaluation {
  id: number; 
  employee: string;
  position: string;
  department: string;
  evaluationDate: string;
  evaluator: string;
  status: 'Planifié' | 'En cours' | 'Complété';
  score: number | null;
  nextDate: string | null;
  skills?: Array<{ skill: string; rating: number; comment?: string }>;
  strengths?: string[];
  areasToImprove?: string[];
  goals?: string[];
  comments?: string;
}

const EmployeesEvaluations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { 
      id: 1, 
      employee: 'Thomas Martin', 
      position: 'Responsable Marketing',
      department: 'Marketing',
      evaluationDate: '2025-01-15', 
      evaluator: 'Jean Dupont',
      status: 'Complété',
      score: 4.2,
      nextDate: '2025-07-15',
      skills: [
        { skill: 'Communication', rating: 4, comment: 'Très bonne communication' },
        { skill: 'Technique', rating: 5, comment: 'Excellente maitrise technique' },
        { skill: 'Leadership', rating: 3, comment: 'Peut encore s\'améliorer' },
        { skill: 'Travail d\'équipe', rating: 4, comment: 'Bon esprit d\'équipe' }
      ],
      strengths: ['Capacité d\'analyse', 'Créativité', 'Organisation'],
      areasToImprove: ['Communication écrite', 'Gestion du stress'],
      goals: ['Améliorer leadership', 'Approfondir connaissances marketing digital'],
      comments: 'Excellent élément dans l\'équipe. Démontre une grande motivation.'
    },
    { 
      id: 2, 
      employee: 'Sophie Dubois', 
      position: 'Développeuse Front-end',
      department: 'Développement',
      evaluationDate: '2025-02-01', 
      evaluator: 'Pierre Durand',
      status: 'Complété',
      score: 4.5,
      nextDate: '2025-08-01',
      skills: [
        { skill: 'Communication', rating: 4, comment: 'Bonne communication' },
        { skill: 'Technique', rating: 5, comment: 'Excellente connaissance technique' },
        { skill: 'Résolution de problèmes', rating: 5, comment: 'Très performante' }
      ],
      strengths: ['Expertise technique', 'Autonomie', 'Curiosité'],
      areasToImprove: ['Communication avec les clients'],
      goals: ['Maîtriser nouvelles technologies', 'Monter en compétence management'],
      comments: 'Très bonne développeuse, à fort potentiel d\'évolution.'
    },
    { 
      id: 3, 
      employee: 'Jean Dupont', 
      position: 'Directeur Financier',
      department: 'Finance',
      evaluationDate: '2024-12-10', 
      evaluator: 'Marie Lambert',
      status: 'Complété',
      score: 3.8,
      nextDate: '2025-06-10',
      skills: [
        { skill: 'Finance', rating: 5, comment: 'Expert en finance' },
        { skill: 'Management', rating: 3, comment: 'Peut améliorer son management' }
      ],
      strengths: ['Analyse financière', 'Rigueur'],
      areasToImprove: ['Communication interne', 'Délégation'],
      goals: ['Améliorer management d\'équipe'],
      comments: 'Excellent directeur financier mais doit travailler son management.'
    },
    { 
      id: 4, 
      employee: 'Marie Lambert', 
      position: 'Responsable RH',
      department: 'Ressources Humaines',
      evaluationDate: '2025-01-05', 
      evaluator: 'Jean Dupont',
      status: 'Planifié',
      score: null,
      nextDate: null
    },
    { 
      id: 5, 
      employee: 'Pierre Durand', 
      position: 'Chef de projet technique',
      department: 'Développement',
      evaluationDate: '2025-01-20', 
      evaluator: 'Sophie Dubois',
      status: 'En cours',
      score: null,
      nextDate: null
    }
  ]);
  
  const skillsData = [
    { skill: 'Communication', value: 85 },
    { skill: 'Technique', value: 92 },
    { skill: 'Leadership', value: 78 },
    { skill: 'Travail d\'équipe', value: 90 },
    { skill: 'Résolution de problèmes', value: 88 },
    { skill: 'Organisation', value: 82 }
  ];
  
  const filteredEvaluations = evaluations.filter(
    evaluation => 
      evaluation.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setViewDialogOpen(true);
  };

  const handleStartEvaluation = (evaluationId: number) => {
    setEvaluations(prevEvaluations => 
      prevEvaluations.map(evaluation => 
        evaluation.id === evaluationId 
          ? { ...evaluation, status: 'En cours' } 
          : evaluation
      )
    );
    toast.success("Évaluation démarrée avec succès");
  };

  const handleContinueEvaluation = (evaluationId: number) => {
    toast.info("Reprise de l'évaluation en cours");
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Évaluations et Performance</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle évaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Planifier une nouvelle évaluation</DialogTitle>
              <DialogDescription>
                Complétez les détails pour planifier une évaluation de performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="employee" className="text-sm font-medium">Employé *</label>
                  <Select>
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thomas">Thomas Martin</SelectItem>
                      <SelectItem value="sophie">Sophie Dubois</SelectItem>
                      <SelectItem value="jean">Jean Dupont</SelectItem>
                      <SelectItem value="marie">Marie Lambert</SelectItem>
                      <SelectItem value="pierre">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="evaluator" className="text-sm font-medium">Évaluateur *</label>
                  <Select>
                    <SelectTrigger id="evaluator">
                      <SelectValue placeholder="Sélectionner un évaluateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thomas">Thomas Martin</SelectItem>
                      <SelectItem value="sophie">Sophie Dubois</SelectItem>
                      <SelectItem value="jean">Jean Dupont</SelectItem>
                      <SelectItem value="marie">Marie Lambert</SelectItem>
                      <SelectItem value="pierre">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date d'évaluation *</label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="template" className="text-sm font-medium">Modèle d'évaluation *</label>
                  <Select>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Évaluation standard</SelectItem>
                      <SelectItem value="manager">Évaluation manager</SelectItem>
                      <SelectItem value="developer">Évaluation développeur</SelectItem>
                      <SelectItem value="sales">Évaluation commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="objectives" className="text-sm font-medium">Objectifs à évaluer</label>
                <textarea 
                  id="objectives" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={4}
                  placeholder="Objectifs et compétences spécifiques à évaluer..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="notification" className="flex items-center space-x-2">
                  <input type="checkbox" id="notification" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm">Envoyer une notification à l'employé et à l'évaluateur</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Planifier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="upcoming">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="completed">Complétées</TabsTrigger>
                <TabsTrigger value="all">Toutes</TabsTrigger>
              </TabsList>
              
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
            
            <TabsContent value="upcoming" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Évaluateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvaluations
                      .filter(e => e.status === 'Planifié' || e.status === 'En cours')
                      .length > 0 ? (
                      filteredEvaluations
                        .filter(e => e.status === 'Planifié' || e.status === 'En cours')
                        .map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell className="font-medium">{evaluation.employee}</TableCell>
                            <TableCell>{evaluation.position}</TableCell>
                            <TableCell>{evaluation.department}</TableCell>
                            <TableCell>{new Date(evaluation.evaluationDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{evaluation.evaluator}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                evaluation.status === 'Planifié' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }>
                                {evaluation.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewEvaluation(evaluation)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              {evaluation.status === 'Planifié' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStartEvaluation(evaluation.id)}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Démarrer
                                </Button>
                              )}
                              {evaluation.status === 'En cours' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleContinueEvaluation(evaluation.id)}
                                >
                                  Continuer
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune évaluation à venir trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Évaluateur</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Prochaine</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvaluations
                      .filter(e => e.status === 'Complété')
                      .length > 0 ? (
                      filteredEvaluations
                        .filter(e => e.status === 'Complété')
                        .map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell className="font-medium">{evaluation.employee}</TableCell>
                            <TableCell>{evaluation.position}</TableCell>
                            <TableCell>{evaluation.department}</TableCell>
                            <TableCell>{new Date(evaluation.evaluationDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{evaluation.evaluator}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-amber-500 mr-1" />
                                <span>{evaluation.score}/5</span>
                              </div>
                            </TableCell>
                            <TableCell>{evaluation.nextDate ? new Date(evaluation.nextDate).toLocaleDateString('fr-FR') : '-'}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewEvaluation(evaluation)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              <Button variant="ghost" size="sm">Exporter</Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune évaluation complétée trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Évaluateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvaluations.length > 0 ? (
                      filteredEvaluations.map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">{evaluation.employee}</TableCell>
                          <TableCell>{evaluation.position}</TableCell>
                          <TableCell>{evaluation.department}</TableCell>
                          <TableCell>{new Date(evaluation.evaluationDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{evaluation.evaluator}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              evaluation.status === 'Complété' 
                                ? 'bg-green-100 text-green-800' 
                                : evaluation.status === 'Planifié'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }>
                              {evaluation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewEvaluation(evaluation)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            {evaluation.status === 'Complété' && (
                              <Button variant="ghost" size="sm">Exporter</Button>
                            )}
                            {evaluation.status === 'Planifié' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStartEvaluation(evaluation.id)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Démarrer
                              </Button>
                            )}
                            {evaluation.status === 'En cours' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleContinueEvaluation(evaluation.id)}
                              >
                                Continuer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune évaluation trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Statistiques d'évaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score moyen</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="font-medium">4.2/5</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Évaluations complétées</span>
                <span className="font-medium">3</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Évaluations en attente</span>
                <span className="font-medium">2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taux de complétion</span>
                <span className="font-medium">60%</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Répartition des scores</h4>
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <span className="w-12">5 étoiles</span>
                  <div className="flex-1 mx-2">
                    <Progress value={20} className="h-2" />
                  </div>
                  <span>20%</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-12">4 étoiles</span>
                  <div className="flex-1 mx-2">
                    <Progress value={60} className="h-2" />
                  </div>
                  <span>60%</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-12">3 étoiles</span>
                  <div className="flex-1 mx-2">
                    <Progress value={20} className="h-2" />
                  </div>
                  <span>20%</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-12">2 étoiles</span>
                  <div className="flex-1 mx-2">
                    <Progress value={0} className="h-2" />
                  </div>
                  <span>0%</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-12">1 étoile</span>
                  <div className="flex-1 mx-2">
                    <Progress value={0} className="h-2" />
                  </div>
                  <span>0%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Top Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{skill.skill}</span>
                    <span className="font-medium">{skill.value}%</span>
                  </div>
                  <Progress value={skill.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">À venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md flex items-start">
                <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Marie Lambert</h4>
                  <p className="text-xs text-muted-foreground">Évaluation prévue le 05/01/2025</p>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-4 w-4 mr-1">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">Par Jean Dupont</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md flex items-start">
                <ClipboardList className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Pierre Durand</h4>
                  <p className="text-xs text-muted-foreground">Évaluation en cours depuis le 20/01/2025</p>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-4 w-4 mr-1">
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">Par Sophie Dubois</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">
                <span>Voir le calendrier des évaluations</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <

