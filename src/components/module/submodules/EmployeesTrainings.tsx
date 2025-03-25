
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
import { CalendarIcon, Download, Eye, Plus, Search, Edit, Users, Star, BookOpen, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

// Types
interface Training {
  id: string;
  title: string;
  description: string;
  type: 'présentiel' | 'en ligne' | 'mixte';
  category: string;
  startDate: string;
  endDate: string;
  duration: number;
  provider: string;
  location: string;
  maxParticipants: number;
  status: 'planifiée' | 'en cours' | 'terminée' | 'annulée';
  participants: string[];
  cost: number;
  skills: string[];
  materials: string[];
}

interface TrainingEnrollment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  employeeId: string;
  employeeName: string;
  department: string;
  enrollmentDate: string;
  status: 'inscrit' | 'en cours' | 'terminé' | 'annulé';
  progress: number;
  completionDate: string | null;
  score: number | null;
  certification: boolean;
  feedback: string | null;
}

// Sample trainings data
const initialTrainings: Training[] = [
  {
    id: 'TR001',
    title: 'Développement React Avancé',
    description: 'Formation approfondie sur React, Redux et React Hooks pour les développeurs front-end.',
    type: 'mixte',
    category: 'Développement web',
    startDate: '2023-09-15',
    endDate: '2023-09-20',
    duration: 35,
    provider: 'Tech Academy',
    location: 'Paris et en ligne',
    maxParticipants: 12,
    status: 'planifiée',
    participants: ['EMP001', 'EMP005'],
    cost: 1500,
    skills: ['React', 'Redux', 'JavaScript', 'Hooks API'],
    materials: ['Support de cours', 'Exercices pratiques', 'Projets']
  },
  {
    id: 'TR002',
    title: 'Leadership et gestion d\'équipe',
    description: 'Formation pour les managers et responsables d\'équipe visant à développer les compétences en leadership.',
    type: 'présentiel',
    category: 'Management',
    startDate: '2023-10-05',
    endDate: '2023-10-07',
    duration: 21,
    provider: 'Business School',
    location: 'Lyon',
    maxParticipants: 8,
    status: 'planifiée',
    participants: ['EMP002', 'EMP003'],
    cost: 2200,
    skills: ['Leadership', 'Communication', 'Gestion de conflit', 'Motivation d\'équipe'],
    materials: ['Livre "Leadership efficace"', 'Études de cas', 'Exercices de groupe']
  },
  {
    id: 'TR003',
    title: 'Certification RGPD',
    description: 'Formation sur la protection des données personnelles et la mise en conformité RGPD.',
    type: 'en ligne',
    category: 'Juridique',
    startDate: '2023-08-10',
    endDate: '2023-08-11',
    duration: 14,
    provider: 'Legal Academy',
    location: 'En ligne',
    maxParticipants: 20,
    status: 'terminée',
    participants: ['EMP001', 'EMP002', 'EMP003', 'EMP004'],
    cost: 800,
    skills: ['RGPD', 'Protection des données', 'Conformité légale'],
    materials: ['Guide RGPD', 'Templates de documents', 'Quiz']
  }
];

// Sample enrollments data
const initialEnrollments: TrainingEnrollment[] = [
  {
    id: 'ENR001',
    trainingId: 'TR001',
    trainingTitle: 'Développement React Avancé',
    employeeId: 'EMP001',
    employeeName: 'Martin Dupont',
    department: 'IT',
    enrollmentDate: '2023-08-20',
    status: 'inscrit',
    progress: 0,
    completionDate: null,
    score: null,
    certification: false,
    feedback: null
  },
  {
    id: 'ENR002',
    trainingId: 'TR001',
    trainingTitle: 'Développement React Avancé',
    employeeId: 'EMP005',
    employeeName: 'Jean Lefebvre',
    department: 'IT',
    enrollmentDate: '2023-08-22',
    status: 'inscrit',
    progress: 0,
    completionDate: null,
    score: null,
    certification: false,
    feedback: null
  },
  {
    id: 'ENR003',
    trainingId: 'TR002',
    trainingTitle: 'Leadership et gestion d\'équipe',
    employeeId: 'EMP002',
    employeeName: 'Lionel Djossa',
    department: 'Direction',
    enrollmentDate: '2023-08-15',
    status: 'inscrit',
    progress: 0,
    completionDate: null,
    score: null,
    certification: false,
    feedback: null
  },
  {
    id: 'ENR004',
    trainingId: 'TR002',
    trainingTitle: 'Leadership et gestion d\'équipe',
    employeeId: 'EMP003',
    employeeName: 'Sophie Martin',
    department: 'Marketing',
    enrollmentDate: '2023-08-18',
    status: 'inscrit',
    progress: 0,
    completionDate: null,
    score: null,
    certification: false,
    feedback: null
  },
  {
    id: 'ENR005',
    trainingId: 'TR003',
    trainingTitle: 'Certification RGPD',
    employeeId: 'EMP001',
    employeeName: 'Martin Dupont',
    department: 'IT',
    enrollmentDate: '2023-07-25',
    status: 'terminé',
    progress: 100,
    completionDate: '2023-08-11',
    score: 85,
    certification: true,
    feedback: "Formation très instructive et pratique."
  },
  {
    id: 'ENR006',
    trainingId: 'TR003',
    trainingTitle: 'Certification RGPD',
    employeeId: 'EMP002',
    employeeName: 'Lionel Djossa',
    department: 'Direction',
    enrollmentDate: '2023-07-26',
    status: 'terminé',
    progress: 100,
    completionDate: '2023-08-11',
    score: 92,
    certification: true,
    feedback: "Excellente formation, très complète."
  }
];

const EmployeesTrainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>(initialEnrollments);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trainings');
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  
  // Dialog states
  const [isViewTrainingOpen, setIsViewTrainingOpen] = useState(false);
  const [isEditTrainingOpen, setIsEditTrainingOpen] = useState(false);
  const [isAddEnrollmentOpen, setIsAddEnrollmentOpen] = useState(false);
  const [isViewEmployeeDetailsOpen, setIsViewEmployeeDetailsOpen] = useState(false);
  
  // Form state for editing training
  const [formData, setFormData] = useState<Partial<Training>>({});
  
  // Selected employee for details view
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
    enrollments: TrainingEnrollment[];
  } | null>(null);
  
  // State for adding enrollment
  const [newEnrollment, setNewEnrollment] = useState({
    trainingId: '',
    employeeId: ''
  });
  
  // Filter trainings based on search query
  const filteredTrainings = trainings.filter(training =>
    training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.trainingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group enrollments by employee
  const enrollmentsByEmployee = employees.map(employee => {
    const employeeEnrollments = enrollments.filter(
      enrollment => enrollment.employeeId === employee.id
    );
    
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      position: employee.position,
      department: employee.department,
      enrollments: employeeEnrollments,
      completedCount: employeeEnrollments.filter(e => e.status === 'terminé').length,
      inProgressCount: employeeEnrollments.filter(e => e.status === 'en cours').length,
      plannedCount: employeeEnrollments.filter(e => e.status === 'inscrit').length
    };
  }).filter(item => item.enrollments.length > 0);
  
  // Handle viewing training details
  const handleViewTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsViewTrainingOpen(true);
  };
  
  // Handle editing training
  const handleEditTraining = (training: Training) => {
    setSelectedTraining(training);
    setFormData({ ...training });
    setIsEditTrainingOpen(true);
  };
  
  // Handle input change for editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'duration' || name === 'maxParticipants' 
        ? parseInt(value, 10) 
        : value
    }));
  };
  
  // Handle select change for editing
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle update training
  const handleUpdateTraining = () => {
    if (!selectedTraining || !formData) return;
    
    const updatedTraining: Training = {
      ...selectedTraining,
      ...formData as Training
    };
    
    setTrainings(trainings.map(t => 
      t.id === selectedTraining.id ? updatedTraining : t
    ));
    
    toast.success(`Formation "${updatedTraining.title}" mise à jour avec succès`);
    setIsEditTrainingOpen(false);
  };
  
  // Handle viewing employee details
  const handleViewEmployeeDetails = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    const employeeEnrollments = enrollments.filter(
      enrollment => enrollment.employeeId === employeeId
    );
    
    setSelectedEmployee({
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      enrollments: employeeEnrollments
    });
    
    setIsViewEmployeeDetailsOpen(true);
  };
  
  // Handle adding enrollment
  const handleAddEnrollmentChange = (field: string, value: string) => {
    setNewEnrollment(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle submitting new enrollment
  const handleSubmitEnrollment = () => {
    if (!newEnrollment.trainingId || !newEnrollment.employeeId) {
      toast.error("Veuillez sélectionner une formation et un employé");
      return;
    }
    
    // Check if enrollment already exists
    const existingEnrollment = enrollments.find(
      e => e.trainingId === newEnrollment.trainingId && e.employeeId === newEnrollment.employeeId
    );
    
    if (existingEnrollment) {
      toast.error("Cet employé est déjà inscrit à cette formation");
      return;
    }
    
    // Find the training and employee
    const training = trainings.find(t => t.id === newEnrollment.trainingId);
    const employee = employees.find(e => e.id === newEnrollment.employeeId);
    
    if (!training || !employee) {
      toast.error("Formation ou employé introuvable");
      return;
    }
    
    // Create new enrollment
    const newEnrollmentEntry: TrainingEnrollment = {
      id: `ENR${enrollments.length + 1}`.padStart(6, '0'),
      trainingId: training.id,
      trainingTitle: training.title,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'inscrit',
      progress: 0,
      completionDate: null,
      score: null,
      certification: false,
      feedback: null
    };
    
    // Update enrollments
    setEnrollments([...enrollments, newEnrollmentEntry]);
    
    // Update training participants
    const updatedTraining = {
      ...training,
      participants: [...training.participants, employee.id]
    };
    
    setTrainings(trainings.map(t => 
      t.id === training.id ? updatedTraining : t
    ));
    
    toast.success(`${employee.firstName} ${employee.lastName} inscrit à la formation "${training.title}"`);
    setIsAddEnrollmentOpen(false);
    setNewEnrollment({
      trainingId: '',
      employeeId: ''
    });
  };
  
  // Handle downloading training program as PDF
  const handleDownloadProgram = (training: Training) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("PROGRAMME DE FORMATION", 105, 20, { align: "center" });
    
    // Add training title
    doc.setFontSize(16);
    doc.text(training.title, 105, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(44, 62, 80);
    doc.line(20, 35, 190, 35);
    
    // Add training information section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS GÉNÉRALES", 20, 45);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Référence : ${training.id}`, 20, 55);
    doc.text(`Type : ${training.type}`, 20, 65);
    doc.text(`Catégorie : ${training.category}`, 20, 75);
    doc.text(`Durée : ${training.duration} heures`, 20, 85);
    doc.text(`Dates : du ${formatDate(training.startDate)} au ${formatDate(training.endDate)}`, 20, 95);
    doc.text(`Lieu : ${training.location}`, 20, 105);
    doc.text(`Prestataire : ${training.provider}`, 20, 115);
    doc.text(`Nombre maximal de participants : ${training.maxParticipants}`, 20, 125);
    
    // Add description section
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 20, 140);
    doc.setFont("helvetica", "normal");
    
    const description = doc.splitTextToSize(training.description, 170);
    doc.text(description, 20, 150);
    
    // Add skills section
    let yPosition = 150 + (description.length * 7);
    
    doc.setFont("helvetica", "bold");
    doc.text("COMPÉTENCES DÉVELOPPÉES", 20, yPosition);
    doc.setFont("helvetica", "normal");
    
    yPosition += 10;
    
    training.skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, 25, yPosition);
      yPosition += 7;
    });
    
    // Add materials section
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("SUPPORTS DE FORMATION", 20, yPosition);
    doc.setFont("helvetica", "normal");
    
    yPosition += 10;
    
    training.materials.forEach((material, index) => {
      doc.text(`• ${material}`, 25, yPosition);
      yPosition += 7;
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Document généré le " + new Date().toLocaleDateString('fr-FR'), 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`programme-${training.id}-${training.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast.success("Programme de formation téléchargé");
  };
  
  // Handle downloading training data as Excel
  const handleExportData = (training: Training) => {
    // Get participants data
    const participantsData = training.participants.map(participantId => {
      const enrollment = enrollments.find(e => e.employeeId === participantId && e.trainingId === training.id);
      const employee = employees.find(e => e.id === participantId);
      
      return {
        'ID Employé': participantId,
        'Nom': employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu',
        'Département': employee ? employee.department : 'Inconnu',
        'Position': employee ? employee.position : 'Inconnu',
        'Statut': enrollment ? getStatusLabel(enrollment.status) : 'Inscrit',
        'Progression': enrollment ? `${enrollment.progress}%` : '0%',
        'Date d\'inscription': enrollment ? formatDate(enrollment.enrollmentDate) : 'N/A',
        'Date de complétion': enrollment && enrollment.completionDate ? formatDate(enrollment.completionDate) : 'N/A',
        'Score': enrollment && enrollment.score ? `${enrollment.score}/100` : 'N/A',
        'Certification': enrollment ? (enrollment.certification ? 'Oui' : 'Non') : 'Non',
      };
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(participantsData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    
    // Export to Excel
    XLSX.writeFile(wb, `formation-${training.id}-${training.title.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
    
    toast.success("Données de formation exportées");
  };
  
  // Utility function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Utility function to get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifiée': return 'Planifiée';
      case 'en cours': return 'En cours';
      case 'terminée': return 'Terminée';
      case 'annulée': return 'Annulée';
      case 'inscrit': return 'Inscrit';
      case 'terminé': return 'Terminé';
      default: return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Formations</h2>
          <p className="text-gray-500">Gérez les formations et le développement des compétences</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par titre, catégorie, employé..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="trainings" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Détails des formations</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Formations par employé</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainings" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle formation
            </Button>
          </div>
          
          {filteredTrainings.map(training => (
            <Card key={training.id} className="overflow-hidden">
              <div className="h-2 bg-blue-500"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    training.status === 'terminée' ? 'bg-green-100 text-green-800' :
                    training.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
                    training.status === 'planifiée' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusLabel(training.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{training.category}</div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Période</div>
                    <div>{formatDate(training.startDate)} - {formatDate(training.endDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Durée</div>
                    <div>{training.duration} heures</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="capitalize">{training.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Prestataire</div>
                    <div>{training.provider}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <p className="text-sm">{training.description}</p>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Compétences développées</div>
                  <div className="flex flex-wrap gap-1">
                    {training.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Participants ({training.participants.length}/{training.maxParticipants})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {training.participants.map(participantId => {
                      const employee = employees.find(emp => emp.id === participantId);
                      return employee ? (
                        <span 
                          key={participantId} 
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100"
                        >
                          {employee.firstName} {employee.lastName}
                        </span>
                      ) : null;
                    })}
                    
                    {training.participants.length < training.maxParticipants && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={() => {
                          setNewEnrollment({
                            trainingId: training.id,
                            employeeId: ''
                          });
                          setIsAddEnrollmentOpen(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewTraining(training)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditTraining(training)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadProgram(training)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger programme
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportData(training)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter données
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTrainings.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Aucune formation trouvée
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Formations</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollmentsByEmployee
                .filter(item => 
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.position.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.enrollments.length}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {item.completedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.completedCount} terminée(s)
                          </span>
                        )}
                        {item.inProgressCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.inProgressCount} en cours
                          </span>
                        )}
                        {item.plannedCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {item.plannedCount} à venir
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewEmployeeDetails(item.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setNewEnrollment({
                            trainingId: '',
                            employeeId: item.id
                          });
                          setIsAddEnrollmentOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
              {enrollmentsByEmployee.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Aucun employé inscrit à des formations
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      {/* View Training Dialog */}
      {selectedTraining && (
        <Dialog open={isViewTrainingOpen} onOpenChange={setIsViewTrainingOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedTraining.title}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Référence</div>
                  <div className="font-medium">{selectedTraining.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTraining.status === 'terminée' ? 'bg-green-100 text-green-800' :
                      selectedTraining.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
                      selectedTraining.status === 'planifiée' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusLabel(selectedTraining.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Catégorie</div>
                  <div>{selectedTraining.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="capitalize">{selectedTraining.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dates</div>
                  <div>{formatDate(selectedTraining.startDate)} au {formatDate(selectedTraining.endDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Durée</div>
                  <div>{selectedTraining.duration} heures</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Prestataire</div>
                  <div>{selectedTraining.provider}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lieu</div>
                  <div>{selectedTraining.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Coût</div>
                  <div>{selectedTraining.cost.toLocaleString('fr-FR')} €</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Participants</div>
                  <div>{selectedTraining.participants.length}/{selectedTraining.maxParticipants}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Description</div>
                <p className="bg-gray-50 p-3 rounded-md">{selectedTraining.description}</p>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Compétences développées</div>
                <div className="bg-gray-50 p-3 rounded-md flex flex-wrap gap-1">
                  {selectedTraining.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Supports de formation</div>
                <ul className="bg-gray-50 p-3 rounded-md list-disc pl-5">
                  {selectedTraining.materials.map((material, idx) => (
                    <li key={idx}>{material}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Participants</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  {selectedTraining.participants.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedTraining.participants.map(participantId => {
                        const employee = employees.find(emp => emp.id === participantId);
                        return employee ? (
                          <li key={participantId}>
                            {employee.firstName} {employee.lastName} - {employee.position}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Aucun participant inscrit</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleDownloadProgram(selectedTraining)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger programme
              </Button>
              <Button 
                onClick={() => {
                  setIsViewTrainingOpen(false);
                  handleEditTraining(selectedTraining);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Training Dialog */}
      {selectedTraining && (
        <Dialog open={isEditTrainingOpen} onOpenChange={setIsEditTrainingOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifier la formation</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm font-medium">
                  Titre
                </label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right text-sm font-medium">
                  Catégorie
                </label>
                <div className="col-span-3">
                  <Input
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right text-sm font-medium">
                  Type
                </label>
                <div className="col-span-3">
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="présentiel">Présentiel</SelectItem>
                      <SelectItem value="en ligne">En ligne</SelectItem>
                      <SelectItem value="mixte">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="provider" className="text-right text-sm font-medium">
                  Prestataire
                </label>
                <div className="col-span-3">
                  <Input
                    id="provider"
                    name="provider"
                    value={formData.provider || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="location" className="text-right text-sm font-medium">
                  Lieu
                </label>
                <div className="col-span-3">
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                  Description
                </label>
                <div className="col-span-3">
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="startDate" className="text-right text-sm font-medium">
                  Date début
                </label>
                <div className="col-span-3">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="endDate" className="text-right text-sm font-medium">
                  Date fin
                </label>
                <div className="col-span-3">
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="duration" className="text-right text-sm font-medium">
                  Durée (heures)
                </label>
                <div className="col-span-3">
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="cost" className="text-right text-sm font-medium">
                  Coût (€)
                </label>
                <div className="col-span-3">
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    value={formData.cost || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="maxParticipants" className="text-right text-sm font-medium">
                  Max participants
                </label>
                <div className="col-span-3">
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right text-sm font-medium">
                  Statut
                </label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planifiée">Planifiée</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="terminée">Terminée</SelectItem>
                      <SelectItem value="annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditTrainingOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateTraining}>
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Enrollment Dialog */}
      <Dialog open={isAddEnrollmentOpen} onOpenChange={setIsAddEnrollmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une inscription</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Formation
              </label>
              <Select 
                value={newEnrollment.trainingId} 
                onValueChange={(value) => handleAddEnrollmentChange('trainingId', value)}
                disabled={!!newEnrollment.trainingId && !!newEnrollment.employeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {trainings
                    .filter(t => t.status !== 'terminée' && t.status !== 'annulée')
                    .map(training => (
                      <SelectItem key={training.id} value={training.id}>
                        {training.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Employé
              </label>
              <Select 
                value={newEnrollment.employeeId} 
                onValueChange={(value) => handleAddEnrollmentChange('employeeId', value)}
                disabled={!!newEnrollment.trainingId && !!newEnrollment.employeeId}
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
            
            {newEnrollment.trainingId && newEnrollment.employeeId && (
              <div className="rounded-md bg-blue-50 p-3 text-blue-800 text-sm">
                <p>
                  Vous allez inscrire{' '}
                  <strong>
                    {(() => {
                      const employee = employees.find(e => e.id === newEnrollment.employeeId);
                      return employee ? `${employee.firstName} ${employee.lastName}` : 'cet employé';
                    })()}
                  </strong>{' '}
                  à la formation{' '}
                  <strong>
                    {(() => {
                      const training = trainings.find(t => t.id === newEnrollment.trainingId);
                      return training ? training.title : 'sélectionnée';
                    })()}
                  </strong>
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEnrollmentOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitEnrollment} disabled={!newEnrollment.trainingId || !newEnrollment.employeeId}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Employee Details Dialog */}
      {selectedEmployee && (
        <Dialog open={isViewEmployeeDetailsOpen} onOpenChange={setIsViewEmployeeDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Formations de {selectedEmployee.name}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                {selectedEmployee.enrollments.length > 0 ? (
                  selectedEmployee.enrollments.map(enrollment => {
                    const training = trainings.find(t => t.id === enrollment.trainingId);
                    
                    return (
                      <div key={enrollment.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{enrollment.trainingTitle}</h3>
                            <p className="text-sm text-gray-500">
                              {training ? `${training.type}, ${training.duration} heures` : ""}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enrollment.status === 'terminé' ? 'bg-green-100 text-green-800' :
                            enrollment.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
                            enrollment.status === 'inscrit' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getStatusLabel(enrollment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                          <div>
                            <span className="text-gray-500">Date d'inscription:</span>{' '}
                            {formatDate(enrollment.enrollmentDate)}
                          </div>
                          {enrollment.completionDate && (
                            <div>
                              <span className="text-gray-500">Date de complétion:</span>{' '}
                              {formatDate(enrollment.completionDate)}
                            </div>
                          )}
                          {enrollment.progress > 0 && (
                            <div>
                              <span className="text-gray-500">Progression:</span>{' '}
                              {enrollment.progress}%
                            </div>
                          )}
                          {enrollment.score !== null && (
                            <div>
                              <span className="text-gray-500">Score:</span>{' '}
                              {enrollment.score}/100
                            </div>
                          )}
                          {enrollment.certification !== null && (
                            <div>
                              <span className="text-gray-500">Certification:</span>{' '}
                              {enrollment.certification ? 'Oui' : 'Non'}
                            </div>
                          )}
                        </div>
                        
                        {enrollment.feedback && (
                          <div className="text-sm mt-2">
                            <span className="text-gray-500">Feedback:</span>{' '}
                            {enrollment.feedback}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Cet employé n'est inscrit à aucune formation
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewEnrollment({
                    trainingId: '',
                    employeeId: selectedEmployee.id
                  });
                  setIsViewEmployeeDetailsOpen(false);
                  setIsAddEnrollmentOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une formation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesTrainings;
