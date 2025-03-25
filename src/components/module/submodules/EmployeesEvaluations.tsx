
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { employees } from '@/data/employees';
import { CalendarIcon, Check, Download, Eye, Plus, Search, Play, FilePenLine, FileText } from 'lucide-react';

// Types
interface Evaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluatorId: string | null;
  evaluatorName: string | null;
  title: string;
  type: 'performance' | 'skills' | 'objectives' | 'probation';
  status: 'planned' | 'in-progress' | 'completed';
  scheduledDate: string;
  completedDate: string | null;
  score: number | null;
  feedback: string | null;
  strengths: string[];
  improvements: string[];
  objectives: { id: string; text: string; completed: boolean }[];
}

// Sample evaluations data
const initialEvaluations: Evaluation[] = [
  {
    id: 'EVAL001',
    employeeId: 'EMP001',
    employeeName: 'Martin Dupont',
    evaluatorId: 'EMP002',
    evaluatorName: 'Lionel Djossa',
    title: 'Évaluation annuelle 2023',
    type: 'performance',
    status: 'completed',
    scheduledDate: '2023-06-15',
    completedDate: '2023-06-18',
    score: 4.2,
    feedback: 'Très bonne performance générale. Excellent travail d\'équipe.',
    strengths: ['Communication', 'Expertise technique', 'Résolution de problèmes'],
    improvements: ['Documentation', 'Gestion du temps'],
    objectives: [
      { id: 'obj1', text: 'Obtenir la certification React avancée', completed: true },
      { id: 'obj2', text: 'Améliorer la documentation du projet CRM', completed: false }
    ]
  },
  {
    id: 'EVAL002',
    employeeId: 'EMP003',
    employeeName: 'Sophie Martin',
    evaluatorId: 'EMP002',
    evaluatorName: 'Lionel Djossa',
    title: 'Évaluation de mi-année 2023',
    type: 'objectives',
    status: 'in-progress',
    scheduledDate: '2023-07-10',
    completedDate: null,
    score: null,
    feedback: null,
    strengths: [],
    improvements: [],
    objectives: [
      { id: 'obj3', text: 'Augmenter le trafic web de 15%', completed: false },
      { id: 'obj4', text: 'Former l\'équipe sur les nouvelles stratégies marketing', completed: true }
    ]
  },
  {
    id: 'EVAL003',
    employeeId: 'EMP005',
    employeeName: 'Jean Lefebvre',
    evaluatorId: 'EMP003',
    evaluatorName: 'Sophie Martin',
    title: 'Évaluation des compétences',
    type: 'skills',
    status: 'planned',
    scheduledDate: '2023-08-20',
    completedDate: null,
    score: null,
    feedback: null,
    strengths: [],
    improvements: [],
    objectives: []
  }
];

const EmployeesEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('in-progress');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewEvaluationOpen, setIsNewEvaluationOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  // Form state for new evaluation
  const [newEvaluation, setNewEvaluation] = useState({
    employeeId: '',
    evaluatorId: '',
    title: '',
    type: 'performance',
    scheduledDate: new Date().toISOString().split('T')[0],
    sendNotification: true
  });
  
  // Filter evaluations based on status and search query
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesStatus = activeTab === 'all' || 
                         (activeTab === 'planned' && evaluation.status === 'planned') ||
                         (activeTab === 'in-progress' && evaluation.status === 'in-progress') ||
                         (activeTab === 'completed' && evaluation.status === 'completed');
    
    const matchesSearch = evaluation.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (evaluation.evaluatorName && evaluation.evaluatorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         evaluation.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Handle input change for new evaluation form
  const handleNewEvaluationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvaluation(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change for new evaluation form
  const handleSelectChange = (name: string, value: string) => {
    setNewEvaluation(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox change for new evaluation form
  const handleCheckboxChange = (checked: boolean) => {
    setNewEvaluation(prev => ({ ...prev, sendNotification: checked }));
  };
  
  // Handle view evaluation details
  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsViewDialogOpen(true);
  };
  
  // Handle starting an evaluation
  const handleStartEvaluation = (evaluation: Evaluation) => {
    const updatedEvaluations = evaluations.map(ev => {
      if (ev.id === evaluation.id) {
        return { ...ev, status: 'in-progress' as const };
      }
      return ev;
    });
    
    setEvaluations(updatedEvaluations);
    toast.success(`Évaluation de ${evaluation.employeeName} démarrée`);
  };
  
  // Handle completing an evaluation
  const handleCompleteEvaluation = (evaluation: Evaluation) => {
    const updatedEvaluations = evaluations.map(ev => {
      if (ev.id === evaluation.id) {
        return { 
          ...ev, 
          status: 'completed' as const,
          completedDate: new Date().toISOString().split('T')[0],
          score: ev.score || 3.5 // Default score if not set
        };
      }
      return ev;
    });
    
    setEvaluations(updatedEvaluations);
    toast.success(`Évaluation de ${evaluation.employeeName} terminée`);
  };
  
  // Handle creating a new evaluation
  const handleCreateEvaluation = () => {
    // Validate form
    if (!newEvaluation.employeeId || !newEvaluation.evaluatorId || !newEvaluation.title || !newEvaluation.scheduledDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Find employee and evaluator
    const employee = employees.find(emp => emp.id === newEvaluation.employeeId);
    const evaluator = employees.find(emp => emp.id === newEvaluation.evaluatorId);
    
    if (!employee || !evaluator) {
      toast.error("Employé ou évaluateur non trouvé");
      return;
    }
    
    // Create new evaluation
    const newEvaluationData: Evaluation = {
      id: `EVAL${evaluations.length + 1}`.padStart(6, '0'),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      evaluatorId: evaluator.id,
      evaluatorName: `${evaluator.firstName} ${evaluator.lastName}`,
      title: newEvaluation.title,
      type: newEvaluation.type as 'performance' | 'skills' | 'objectives' | 'probation',
      status: 'planned',
      scheduledDate: newEvaluation.scheduledDate,
      completedDate: null,
      score: null,
      feedback: null,
      strengths: [],
      improvements: [],
      objectives: []
    };
    
    // Add to evaluations
    setEvaluations([...evaluations, newEvaluationData]);
    
    // Reset form and close dialog
    setNewEvaluation({
      employeeId: '',
      evaluatorId: '',
      title: '',
      type: 'performance',
      scheduledDate: new Date().toISOString().split('T')[0],
      sendNotification: true
    });
    
    setIsNewEvaluationOpen(false);
    
    // Show success message
    toast.success(`Nouvelle évaluation planifiée pour ${employee.firstName} ${employee.lastName}`);
    
    // Show notification toast if selected
    if (newEvaluation.sendNotification) {
      toast.info(`Notification envoyée à ${employee.firstName} ${employee.lastName} et ${evaluator.firstName} ${evaluator.lastName}`);
    }
  };
  
  // Handle exporting evaluation as PDF
  const handleExportPDF = (evaluation: Evaluation) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("ÉVALUATION DE PERFORMANCE", 105, 20, { align: "center" });
    
    // Add evaluation title
    doc.setFontSize(16);
    doc.text(evaluation.title, 105, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(44, 62, 80);
    doc.line(20, 35, 190, 35);
    
    // Add evaluation information section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS GÉNÉRALES", 20, 45);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Référence : ${evaluation.id}`, 20, 55);
    doc.text(`Employé : ${evaluation.employeeName}`, 20, 65);
    doc.text(`Évaluateur : ${evaluation.evaluatorName || 'Non assigné'}`, 20, 75);
    doc.text(`Type : ${getEvaluationTypeLabel(evaluation.type)}`, 20, 85);
    doc.text(`Statut : ${getStatusLabel(evaluation.status)}`, 20, 95);
    doc.text(`Date planifiée : ${formatDate(evaluation.scheduledDate)}`, 20, 105);
    
    if (evaluation.completedDate) {
      doc.text(`Date de réalisation : ${formatDate(evaluation.completedDate)}`, 20, 115);
    }
    
    if (evaluation.score !== null) {
      doc.text(`Score global : ${evaluation.score} / 5`, 20, evaluation.completedDate ? 125 : 115);
    }
    
    // Add feedback section if exists
    if (evaluation.feedback) {
      let yPosition = evaluation.score !== null ? 
                     (evaluation.completedDate ? 135 : 125) : 
                     (evaluation.completedDate ? 125 : 115);
      
      doc.setFont("helvetica", "bold");
      doc.text("COMMENTAIRES", 20, yPosition);
      doc.setFont("helvetica", "normal");
      
      const feedbackLines = doc.splitTextToSize(evaluation.feedback, 170);
      doc.text(feedbackLines, 20, yPosition + 10);
      
      yPosition += 10 + (feedbackLines.length * 7);
      
      // Add strengths section if exists
      if (evaluation.strengths.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("POINTS FORTS", 20, yPosition);
        doc.setFont("helvetica", "normal");
        
        yPosition += 10;
        
        evaluation.strengths.forEach((strength, index) => {
          doc.text(`• ${strength}`, 25, yPosition);
          yPosition += 7;
        });
      }
      
      // Add improvements section if exists
      if (evaluation.improvements.length > 0) {
        yPosition += 5;
        doc.setFont("helvetica", "bold");
        doc.text("AXES D'AMÉLIORATION", 20, yPosition);
        doc.setFont("helvetica", "normal");
        
        yPosition += 10;
        
        evaluation.improvements.forEach((improvement, index) => {
          doc.text(`• ${improvement}`, 25, yPosition);
          yPosition += 7;
        });
      }
    }
    
    // Add objectives section if exists
    if (evaluation.objectives.length > 0) {
      let yPosition = evaluation.feedback ? 
                     220 : // After feedback section
                     (evaluation.score !== null ? 
                     (evaluation.completedDate ? 135 : 125) : 
                     (evaluation.completedDate ? 125 : 115));
      
      doc.setFont("helvetica", "bold");
      doc.text("OBJECTIFS", 20, yPosition);
      doc.setFont("helvetica", "normal");
      
      yPosition += 10;
      
      evaluation.objectives.forEach((objective, index) => {
        const status = objective.completed ? "✓" : "○";
        doc.text(`${status} ${objective.text}`, 25, yPosition);
        yPosition += 7;
      });
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Document généré le " + new Date().toLocaleDateString('fr-FR'), 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`evaluation-${evaluation.id}-${evaluation.employeeName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast.success("Évaluation exportée en PDF");
  };
  
  // Utility function to get type label
  const getEvaluationTypeLabel = (type: string) => {
    switch (type) {
      case 'performance': return 'Évaluation de performance';
      case 'skills': return 'Évaluation des compétences';
      case 'objectives': return 'Revue d\'objectifs';
      case 'probation': return 'Période d\'essai';
      default: return type;
    }
  };
  
  // Utility function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Planifiée';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };
  
  // Utility function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Évaluations et Performance</h2>
          <p className="text-gray-500">Gérez les évaluations de performance des employés</p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button size="sm" onClick={() => setIsNewEvaluationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par employé, évaluateur ou titre..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="planned">Planifiées</TabsTrigger>
          <TabsTrigger value="in-progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Complétées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Évaluateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date planifiée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.evaluatorName || '—'}</TableCell>
                      <TableCell>{getEvaluationTypeLabel(evaluation.type)}</TableCell>
                      <TableCell>{formatDate(evaluation.scheduledDate)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          evaluation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusLabel(evaluation.status)}
                        </span>
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
                        
                        {evaluation.status === 'planned' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStartEvaluation(evaluation)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Démarrer
                          </Button>
                        )}
                        
                        {evaluation.status === 'in-progress' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCompleteEvaluation(evaluation)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                        
                        {evaluation.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleExportPDF(evaluation)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Exporter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEvaluations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        Aucune évaluation trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planned" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Évaluateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date planifiée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.evaluatorName || '—'}</TableCell>
                      <TableCell>{getEvaluationTypeLabel(evaluation.type)}</TableCell>
                      <TableCell>{formatDate(evaluation.scheduledDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewEvaluation(evaluation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEvaluation(evaluation)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Démarrer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEvaluations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Aucune évaluation planifiée trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Évaluateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date planifiée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.evaluatorName || '—'}</TableCell>
                      <TableCell>{getEvaluationTypeLabel(evaluation.type)}</TableCell>
                      <TableCell>{formatDate(evaluation.scheduledDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewEvaluation(evaluation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCompleteEvaluation(evaluation)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Terminer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEvaluations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Aucune évaluation en cours trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Évaluateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date de réalisation</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                      <TableCell>{evaluation.title}</TableCell>
                      <TableCell>{evaluation.evaluatorName || '—'}</TableCell>
                      <TableCell>{getEvaluationTypeLabel(evaluation.type)}</TableCell>
                      <TableCell>{evaluation.completedDate ? formatDate(evaluation.completedDate) : '—'}</TableCell>
                      <TableCell>{evaluation.score ? `${evaluation.score} / 5` : '—'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewEvaluation(evaluation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleExportPDF(evaluation)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Exporter
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredEvaluations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        Aucune évaluation complétée trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Evaluation Dialog */}
      {selectedEvaluation && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Évaluation de {selectedEvaluation.employeeName}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedEvaluation.title}</h3>
                  <p className="text-gray-500">{getEvaluationTypeLabel(selectedEvaluation.type)}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedEvaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedEvaluation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusLabel(selectedEvaluation.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Employé</p>
                  <p className="font-medium">{selectedEvaluation.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Évaluateur</p>
                  <p>{selectedEvaluation.evaluatorName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date planifiée</p>
                  <p>{formatDate(selectedEvaluation.scheduledDate)}</p>
                </div>
                {selectedEvaluation.completedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Date de réalisation</p>
                    <p>{formatDate(selectedEvaluation.completedDate)}</p>
                  </div>
                )}
                {selectedEvaluation.score !== null && (
                  <div>
                    <p className="text-sm text-gray-500">Score global</p>
                    <p className="font-medium">{selectedEvaluation.score} / 5</p>
                  </div>
                )}
              </div>
              
              {selectedEvaluation.feedback && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Commentaires</p>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedEvaluation.feedback}</p>
                </div>
              )}
              
              {selectedEvaluation.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Points forts</p>
                  <ul className="list-disc pl-5 bg-gray-50 p-3 rounded-md">
                    {selectedEvaluation.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvaluation.improvements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Axes d'amélioration</p>
                  <ul className="list-disc pl-5 bg-gray-50 p-3 rounded-md">
                    {selectedEvaluation.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm">{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvaluation.objectives.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Objectifs</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedEvaluation.objectives.map((objective, idx) => (
                      <div key={idx} className="flex items-start mb-2 last:mb-0">
                        <div className={`mt-0.5 w-4 h-4 border rounded-sm mr-2 flex items-center justify-center ${
                          objective.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                        }`}>
                          {objective.completed && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm">{objective.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              {selectedEvaluation.status === 'planned' && (
                <Button 
                  onClick={() => {
                    handleStartEvaluation(selectedEvaluation);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer
                </Button>
              )}
              
              {selectedEvaluation.status === 'in-progress' && (
                <Button 
                  onClick={() => {
                    handleCompleteEvaluation(selectedEvaluation);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Terminer
                </Button>
              )}
              
              {selectedEvaluation.status === 'completed' && (
                <Button 
                  onClick={() => handleExportPDF(selectedEvaluation)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter PDF
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* New Evaluation Dialog */}
      <Dialog open={isNewEvaluationOpen} onOpenChange={setIsNewEvaluationOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Planifier une nouvelle évaluation</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="employeeId" className="text-right text-sm font-medium">
                Employé
              </label>
              <div className="col-span-3">
                <Select 
                  value={newEvaluation.employeeId} 
                  onValueChange={(value) => handleSelectChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="evaluatorId" className="text-right text-sm font-medium">
                Évaluateur
              </label>
              <div className="col-span-3">
                <Select 
                  value={newEvaluation.evaluatorId} 
                  onValueChange={(value) => handleSelectChange('evaluatorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un évaluateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Titre
              </label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={newEvaluation.title}
                  onChange={handleNewEvaluationChange}
                  placeholder="Ex: Évaluation annuelle 2023"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <div className="col-span-3">
                <Select 
                  value={newEvaluation.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Évaluation de performance</SelectItem>
                    <SelectItem value="skills">Évaluation des compétences</SelectItem>
                    <SelectItem value="objectives">Revue d'objectifs</SelectItem>
                    <SelectItem value="probation">Période d'essai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="scheduledDate" className="text-right text-sm font-medium">
                Date planifiée
              </label>
              <div className="col-span-3">
                <div className="relative">
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={newEvaluation.scheduledDate}
                    onChange={handleNewEvaluationChange}
                  />
                  <CalendarIcon className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox 
                  id="sendNotification" 
                  checked={newEvaluation.sendNotification}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="sendNotification"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Envoyer une notification à l'employé et à l'évaluateur
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEvaluationOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEvaluation}>
              Planifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesEvaluations;
