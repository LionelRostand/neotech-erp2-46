
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Clipboard, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
  Stethoscope,
  TestTube,
  Pill,
  ArrowRight,
  Upload,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Eye,
  UserCog,
  ChevronRight,
  Link2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Types pour les consultations
interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'initial' | 'follow_up' | 'emergency' | 'routine' | 'specialist';
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  symptoms: string[];
  diagnosis?: string;
  notes?: string;
  prescription?: string;
  testOrders?: TestOrder[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt?: string;
  duration: number; // durée en minutes
  vitalSigns?: VitalSigns;
}

// Types pour les signes vitaux
interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  pain?: number; // échelle de 0 à 10
}

// Types pour les ordres d'examens
interface TestOrder {
  id: string;
  type: 'blood_test' | 'radiology' | 'urine_test' | 'other';
  description: string;
  status: 'ordered' | 'completed' | 'canceled';
  results?: string;
  orderedDate: string;
  completedDate?: string;
}

// Types pour les pièces jointes
interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'report';
  url: string;
  uploadedAt: string;
  size: number; // taille en Ko
}

// Types simplifiés pour les patients
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  allergies: string[];
  chronicConditions: string[];
}

// Types simplifiés pour les médecins
interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

// Données de démonstration pour les consultations
const mockConsultations: Consultation[] = [
  {
    id: 'CONS001',
    patientId: 'PAT001',
    patientName: 'Jean Dupont',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-06-10',
    time: '09:30',
    type: 'follow_up',
    status: 'completed',
    symptoms: ['Fièvre', 'Toux', 'Fatigue'],
    diagnosis: 'Syndrome grippal',
    notes: 'Le patient se plaint de symptômes grippaux depuis 3 jours. Fièvre à 38.5°C, toux sèche et fatigue. Examen clinique normal par ailleurs.',
    prescription: 'Paracétamol 1000mg : 1 comprimé toutes les 6 heures si besoin (max 4/jour)\nIbuprofène 400mg : 1 comprimé matin et soir pendant les repas si douleurs\nRepos pendant 3 jours',
    testOrders: [
      {
        id: 'TEST001',
        type: 'blood_test',
        description: 'Numération formule sanguine',
        status: 'completed',
        results: 'Résultats normaux',
        orderedDate: '2023-06-10',
        completedDate: '2023-06-12'
      }
    ],
    createdAt: '2023-06-10',
    updatedAt: '2023-06-12',
    duration: 30,
    vitalSigns: {
      temperature: 38.5,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 88,
      respiratoryRate: 18,
      oxygenSaturation: 98,
      weight: 75,
      height: 175,
      bmi: 24.5,
      pain: 3
    }
  },
  {
    id: 'CONS002',
    patientId: 'PAT002',
    patientName: 'Marie Lambert',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-06-12',
    time: '11:00',
    type: 'initial',
    status: 'completed',
    symptoms: ['Douleurs lombaires', 'Difficulté à se pencher'],
    diagnosis: 'Lombalgie mécanique',
    notes: 'La patiente présente des douleurs lombaires depuis 1 semaine suite à un effort de soulèvement. Pas de signes neurologiques. Examen clinique retrouve une contracture paravertébrale.',
    prescription: 'Paracétamol 1000mg : 1 comprimé toutes les 6 heures si douleur (max 4/jour)\nMyorelaxant : 1 comprimé matin, midi et soir pendant 5 jours\nKinésithérapie : 10 séances',
    testOrders: [
      {
        id: 'TEST002',
        type: 'radiology',
        description: 'Radiographie lombaire',
        status: 'ordered',
        orderedDate: '2023-06-12'
      }
    ],
    createdAt: '2023-06-12',
    duration: 30,
    vitalSigns: {
      temperature: 37.0,
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 85,
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      weight: 65,
      height: 168,
      bmi: 23.0,
      pain: 6
    }
  },
  {
    id: 'CONS003',
    patientId: 'PAT003',
    patientName: 'Pierre Dubois',
    doctorId: 'DOC002',
    doctorName: 'Dr. Paul Lefebvre',
    date: '2023-06-15',
    time: '14:30',
    type: 'emergency',
    status: 'completed',
    symptoms: ['Douleur thoracique', 'Essoufflement', 'Palpitations'],
    diagnosis: 'Suspicion d\'angor',
    notes: 'Patient de 53 ans présentant une douleur thoracique constrictive irradiant dans le bras gauche, apparue au cours d\'un effort. Antécédents familiaux d\'infarctus.',
    prescription: 'Aspirine 75mg : 1 comprimé par jour\nTrinitrine spray : 1 à 2 bouffées en cas de crise',
    testOrders: [
      {
        id: 'TEST003',
        type: 'blood_test',
        description: 'Troponine, CPK-MB',
        status: 'completed',
        results: 'Troponine légèrement élevée',
        orderedDate: '2023-06-15',
        completedDate: '2023-06-15'
      },
      {
        id: 'TEST004',
        type: 'other',
        description: 'ECG',
        status: 'completed',
        results: 'Sous-décalage ST en V3-V4',
        orderedDate: '2023-06-15',
        completedDate: '2023-06-15'
      }
    ],
    createdAt: '2023-06-15',
    updatedAt: '2023-06-15',
    duration: 45,
    vitalSigns: {
      temperature: 37.2,
      bloodPressureSystolic: 160,
      bloodPressureDiastolic: 95,
      heartRate: 92,
      respiratoryRate: 20,
      oxygenSaturation: 97,
      weight: 85,
      height: 180,
      bmi: 26.2,
      pain: 7
    }
  },
  {
    id: 'CONS004',
    patientId: 'PAT004',
    patientName: 'Claire Moreau',
    doctorId: 'DOC003',
    doctorName: 'Dr. Julie Dubois',
    date: '2023-06-15',
    time: '16:00',
    type: 'routine',
    status: 'scheduled',
    symptoms: ['Contrôle annuel'],
    createdAt: '2023-06-01',
    duration: 30
  },
  {
    id: 'CONS005',
    patientId: 'PAT001',
    patientName: 'Jean Dupont',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-06-20',
    time: '10:00',
    type: 'follow_up',
    status: 'scheduled',
    symptoms: ['Suivi syndrome grippal'],
    createdAt: '2023-06-10',
    duration: 15
  }
];

// Données de démonstration pour les patients
const mockPatients: Patient[] = [
  {
    id: 'PAT001',
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1975-05-15',
    gender: 'male',
    allergies: ['Pénicilline'],
    chronicConditions: ['Hypertension', 'Diabète type 2']
  },
  {
    id: 'PAT002',
    firstName: 'Marie',
    lastName: 'Lambert',
    dateOfBirth: '1982-09-23',
    gender: 'female',
    allergies: ['Aspirine'],
    chronicConditions: []
  },
  {
    id: 'PAT003',
    firstName: 'Pierre',
    lastName: 'Dubois',
    dateOfBirth: '1968-02-14',
    gender: 'male',
    allergies: [],
    chronicConditions: ['Hypercholestérolémie']
  },
  {
    id: 'PAT004',
    firstName: 'Claire',
    lastName: 'Moreau',
    dateOfBirth: '1990-11-30',
    gender: 'female',
    allergies: ['Latex'],
    chronicConditions: ['Asthme']
  },
  {
    id: 'PAT005',
    firstName: 'Thomas',
    lastName: 'Bernard',
    dateOfBirth: '1995-07-18',
    gender: 'male',
    allergies: [],
    chronicConditions: []
  }
];

// Données de démonstration pour les médecins
const mockDoctors: Doctor[] = [
  {
    id: 'DOC001',
    firstName: 'Sophie',
    lastName: 'Martin',
    specialty: 'Médecine générale'
  },
  {
    id: 'DOC002',
    firstName: 'Paul',
    lastName: 'Lefebvre',
    specialty: 'Cardiologie'
  },
  {
    id: 'DOC003',
    firstName: 'Julie',
    lastName: 'Dubois',
    specialty: 'Dermatologie'
  },
  {
    id: 'DOC004',
    firstName: 'Antoine',
    lastName: 'Bernard',
    specialty: 'Pédiatrie'
  }
];

const ConsultationsPage: React.FC = () => {
  // États
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isCreatingConsultation, setIsCreatingConsultation] = useState(false);
  const [isAddingTestOrder, setIsAddingTestOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Nouvel état pour le formulaire de consultation
  const [newConsultation, setNewConsultation] = useState<Partial<Consultation>>({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'initial',
    status: 'scheduled',
    symptoms: [],
    duration: 30
  });
  
  // Nouvel état pour le formulaire des signes vitaux
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    temperature: undefined,
    bloodPressureSystolic: undefined,
    bloodPressureDiastolic: undefined,
    heartRate: undefined,
    respiratoryRate: undefined,
    oxygenSaturation: undefined,
    weight: undefined,
    height: undefined,
    bmi: undefined,
    pain: undefined
  });
  
  // Nouvel état pour le formulaire de demande d'examen
  const [newTestOrder, setNewTestOrder] = useState<Partial<TestOrder>>({
    type: 'blood_test',
    description: '',
    status: 'ordered',
    orderedDate: new Date().toISOString().split('T')[0]
  });
  
  // Filtrage des consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (consultation.diagnosis && consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? consultation.status === statusFilter : true;
    const matchesDate = dateFilter ? consultation.date === dateFilter : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Hooks
  const consultationsCollection = useFirestore(COLLECTIONS.HEALTH);
  const { toast } = useToast();
  
  // Fonction pour calculer l'IMC
  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height) return undefined;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };
  
  // Fonction pour mettre à jour les signes vitaux
  const handleVitalSignsChange = (key: keyof VitalSigns, value: string) => {
    const numericValue = value ? parseFloat(value) : undefined;
    const newVitalSigns = { ...vitalSigns, [key]: numericValue };
    
    // Calculer l'IMC si le poids et la taille sont définis
    if (key === 'weight' || key === 'height') {
      const weight = key === 'weight' ? numericValue : vitalSigns.weight;
      const height = key === 'height' ? numericValue : vitalSigns.height;
      newVitalSigns.bmi = calculateBMI(weight, height);
    }
    
    setVitalSigns(newVitalSigns);
  };
  
  // Fonction pour ajouter une nouvelle consultation
  const handleCreateConsultation = () => {
    if (!newConsultation.patientId || !newConsultation.doctorId || !newConsultation.date || !newConsultation.type) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    // Simuler un délai pour l'API
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === newConsultation.patientId);
      const doctor = mockDoctors.find(d => d.id === newConsultation.doctorId);
      
      if (!patient || !doctor) {
        toast({
          title: "Erreur",
          description: "Patient ou médecin non trouvé.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      const consultationId = `CONS${String(consultations.length + 1).padStart(3, '0')}`;
      
      const createdConsultation: Consultation = {
        id: consultationId,
        patientId: newConsultation.patientId!,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: newConsultation.doctorId!,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        date: newConsultation.date!,
        time: newConsultation.time || '09:00',
        type: newConsultation.type as Consultation['type'],
        status: newConsultation.status as Consultation['status'],
        symptoms: newConsultation.symptoms || [],
        diagnosis: newConsultation.diagnosis,
        notes: newConsultation.notes,
        prescription: newConsultation.prescription,
        testOrders: [],
        attachments: [],
        createdAt: new Date().toISOString().split('T')[0],
        duration: newConsultation.duration || 30,
        vitalSigns: Object.values(vitalSigns).some(value => value !== undefined) ? vitalSigns : undefined
      };

      setConsultations([...consultations, createdConsultation]);
      setIsCreatingConsultation(false);
      setNewConsultation({
        patientId: '',
        doctorId: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'initial',
        status: 'scheduled',
        symptoms: [],
        duration: 30
      });
      setVitalSigns({
        temperature: undefined,
        bloodPressureSystolic: undefined,
        bloodPressureDiastolic: undefined,
        heartRate: undefined,
        respiratoryRate: undefined,
        oxygenSaturation: undefined,
        weight: undefined,
        height: undefined,
        bmi: undefined,
        pain: undefined
      });

      toast({
        title: "Consultation créée",
        description: `La consultation a été créée avec succès pour ${patient.firstName} ${patient.lastName}.`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour mettre à jour le statut d'une consultation
  const handleUpdateConsultationStatus = (consultationId: string, newStatus: Consultation['status']) => {
    setConsultations(consultations.map(consultation => 
      consultation.id === consultationId 
        ? { 
            ...consultation, 
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : consultation
    ));

    toast({
      title: "Statut mis à jour",
      description: `Le statut de la consultation a été modifié avec succès.`
    });
    
    if (selectedConsultation?.id === consultationId) {
      setSelectedConsultation({ 
        ...selectedConsultation, 
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };
  
  // Fonction pour ajouter une demande d'examen à une consultation
  const handleAddTestOrder = () => {
    if (!selectedConsultation || !newTestOrder.type || !newTestOrder.description) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    // Simuler un délai pour l'API
    setTimeout(() => {
      const testOrderId = `TEST${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      const testOrder: TestOrder = {
        id: testOrderId,
        type: newTestOrder.type as TestOrder['type'],
        description: newTestOrder.description!,
        status: newTestOrder.status as TestOrder['status'],
        orderedDate: newTestOrder.orderedDate || new Date().toISOString().split('T')[0],
        completedDate: newTestOrder.completedDate
      };

      const updatedTestOrders = selectedConsultation.testOrders 
        ? [...selectedConsultation.testOrders, testOrder]
        : [testOrder];

      const updatedConsultation = {
        ...selectedConsultation,
        testOrders: updatedTestOrders,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setConsultations(consultations.map(consultation => 
        consultation.id === selectedConsultation.id ? updatedConsultation : consultation
      ));
      
      setSelectedConsultation(updatedConsultation);
      setIsAddingTestOrder(false);
      setNewTestOrder({
        type: 'blood_test',
        description: '',
        status: 'ordered',
        orderedDate: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Demande d'examen ajoutée",
        description: "La demande d'examen a été ajoutée avec succès."
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour mettre à jour le diagnostic et la prescription
  const handleUpdateDiagnosisAndPrescription = (consultationId: string, diagnosis: string, prescription: string) => {
    setConsultations(consultations.map(consultation => 
      consultation.id === consultationId 
        ? { 
            ...consultation, 
            diagnosis,
            prescription,
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : consultation
    ));

    toast({
      title: "Consultation mise à jour",
      description: "Le diagnostic et la prescription ont été mis à jour avec succès."
    });
    
    if (selectedConsultation?.id === consultationId) {
      setSelectedConsultation({ 
        ...selectedConsultation, 
        diagnosis,
        prescription,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater le type de consultation
  const getConsultationTypeLabel = (type: string) => {
    switch (type) {
      case 'initial': return 'Première consultation';
      case 'follow_up': return 'Suivi';
      case 'emergency': return 'Urgence';
      case 'routine': return 'Routine';
      case 'specialist': return 'Spécialiste';
      default: return type;
    }
  };
  
  // Formater le statut de consultation
  const getConsultationStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifiée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'canceled': return 'Annulée';
      default: return status;
    }
  };
  
  // Couleurs des badges de type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-blue-100 text-blue-800';
      case 'follow_up': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'routine': return 'bg-purple-100 text-purple-800';
      case 'specialist': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Couleurs des badges de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Formater le type d'examen
  const getTestTypeLabel = (type: string) => {
    switch (type) {
      case 'blood_test': return 'Analyse sanguine';
      case 'radiology': return 'Radiologie';
      case 'urine_test': return 'Analyse d\'urine';
      case 'other': return 'Autre';
      default: return type;
    }
  };
  
  // Couleurs des badges de type d'examen
  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'blood_test': return 'bg-red-100 text-red-800';
      case 'radiology': return 'bg-blue-100 text-blue-800';
      case 'urine_test': return 'bg-yellow-100 text-yellow-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Formater le statut d'examen
  const getTestStatusLabel = (status: string) => {
    switch (status) {
      case 'ordered': return 'Demandé';
      case 'completed': return 'Terminé';
      case 'canceled': return 'Annulé';
      default: return status;
    }
  };
  
  // Couleurs des badges de statut d'examen
  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clipboard className="h-6 w-6 text-blue-500" />
        Gestion des Consultations
      </h2>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            Liste des consultations
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dossier de consultation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter ? getConsultationStatusLabel(statusFilter) : "Tous les statuts"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="scheduled">Planifiées</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="canceled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setIsCreatingConsultation(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle consultation
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Symptômes</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucune consultation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(consultation.date)}</div>
                          <div className="text-sm text-muted-foreground">{consultation.time}</div>
                        </TableCell>
                        <TableCell>{consultation.patientName}</TableCell>
                        <TableCell>{consultation.doctorName}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(consultation.type)}>
                            {getConsultationTypeLabel(consultation.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(consultation.status)}>
                            {getConsultationStatusLabel(consultation.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {consultation.symptoms.join(', ')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {consultation.diagnosis || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedConsultation(consultation);
                                const tabTrigger = document.querySelector('[data-value="form"]') as HTMLElement;
                                if (tabTrigger) tabTrigger.click();
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Voir
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {consultation.status === 'scheduled' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleUpdateConsultationStatus(consultation.id, 'in_progress')}>
                                      <ArrowRight className="h-4 w-4 mr-2" />
                                      Démarrer la consultation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateConsultationStatus(consultation.id, 'canceled')}>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Annuler
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {consultation.status === 'in_progress' && (
                                  <DropdownMenuItem onClick={() => handleUpdateConsultationStatus(consultation.id, 'completed')}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Terminer la consultation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Lier à un dossier médical
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          {selectedConsultation ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedConsultation(null);
                      const tabTrigger = document.querySelector('[data-value="list"]') as HTMLElement;
                      if (tabTrigger) tabTrigger.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Retour à la liste
                  </Button>
                  <h3 className="text-xl font-bold">
                    Consultation du {formatDate(selectedConsultation.date)} - {selectedConsultation.patientName}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedConsultation.status)}>
                    {getConsultationStatusLabel(selectedConsultation.status)}
                  </Badge>
                  <Badge className={getTypeColor(selectedConsultation.type)}>
                    {getConsultationTypeLabel(selectedConsultation.type)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Informations médicales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Patient</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedConsultation.patientName}</p>
                            <Link2 
                              className="text-sm text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
                              onClick={() => {
                                toast({
                                  title: "Navigation",
                                  description: "Redirection vers le dossier patient (fonctionnalité à implémenter)."
                                });
                              }}
                            >
                              <span>Voir le dossier patient</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link2>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Médecin</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedConsultation.doctorName}</p>
                            <p className="text-sm text-muted-foreground">
                              {mockDoctors.find(d => d.id === selectedConsultation.doctorId)?.specialty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Symptômes</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedConsultation.symptoms.length > 0 ? (
                          selectedConsultation.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline">
                              {symptom}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">Aucun symptôme enregistré</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedConsultation.status === 'in_progress' || selectedConsultation.status === 'completed' ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-muted-foreground">Diagnostic</h4>
                            {selectedConsultation.status === 'in_progress' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const diagnosis = prompt("Diagnostic:", selectedConsultation.diagnosis || '');
                                  const prescription = prompt("Prescription:", selectedConsultation.prescription || '');
                                  if (diagnosis !== null && prescription !== null) {
                                    handleUpdateDiagnosisAndPrescription(selectedConsultation.id, diagnosis, prescription);
                                  }
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            )}
                          </div>
                          <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                            {selectedConsultation.diagnosis ? (
                              <p className="whitespace-pre-line">{selectedConsultation.diagnosis}</p>
                            ) : (
                              <p className="text-muted-foreground">Aucun diagnostic enregistré</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Prescription</h4>
                          <div className="p-3 bg-gray-50 rounded-md min-h-[100px] font-mono text-sm">
                            {selectedConsultation.prescription ? (
                              <p className="whitespace-pre-line">{selectedConsultation.prescription}</p>
                            ) : (
                              <p className="text-muted-foreground">Aucune prescription enregistrée</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      selectedConsultation.status === 'scheduled' && (
                        <div className="text-center p-6">
                          <Button 
                            onClick={() => handleUpdateConsultationStatus(selectedConsultation.id, 'in_progress')}
                            className="flex items-center gap-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Démarrer la consultation
                          </Button>
                        </div>
                      )
                    )}
                    
                    {selectedConsultation.notes && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="whitespace-pre-line">{selectedConsultation.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {selectedConsultation.status === 'in_progress' && (
                      <Button 
                        onClick={() => handleUpdateConsultationStatus(selectedConsultation.id, 'completed')}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Terminer la consultation
                      </Button>
                    )}
                    {selectedConsultation.status === 'scheduled' && (
                      <Button 
                        variant="outline"
                        onClick={() => handleUpdateConsultationStatus(selectedConsultation.id, 'canceled')}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                        Annuler la consultation
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                <div className="space-y-4">
                  {selectedConsultation.vitalSigns && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Signes vitaux</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedConsultation.vitalSigns.temperature !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Température</span>
                              <span>{selectedConsultation.vitalSigns.temperature} °C</span>
                            </div>
                          )}
                          {(selectedConsultation.vitalSigns.bloodPressureSystolic !== undefined && 
                            selectedConsultation.vitalSigns.bloodPressureDiastolic !== undefined) && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Tension artérielle</span>
                              <span>{selectedConsultation.vitalSigns.bloodPressureSystolic}/{selectedConsultation.vitalSigns.bloodPressureDiastolic} mmHg</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.heartRate !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Pouls</span>
                              <span>{selectedConsultation.vitalSigns.heartRate} bpm</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.respiratoryRate !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Fréquence respiratoire</span>
                              <span>{selectedConsultation.vitalSigns.respiratoryRate} /min</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.oxygenSaturation !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">SpO2</span>
                              <span>{selectedConsultation.vitalSigns.oxygenSaturation} %</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.weight !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Poids</span>
                              <span>{selectedConsultation.vitalSigns.weight} kg</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.height !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Taille</span>
                              <span>{selectedConsultation.vitalSigns.height} cm</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.bmi !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">IMC</span>
                              <span>{selectedConsultation.vitalSigns.bmi} kg/m²</span>
                            </div>
                          )}
                          {selectedConsultation.vitalSigns.pain !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Douleur (0-10)</span>
                              <span>{selectedConsultation.vitalSigns.pain}/10</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Examens demandés</CardTitle>
                        {(selectedConsultation.status === 'in_progress' || selectedConsultation.status === 'completed') && (
                          <Button 
                            size="sm"
                            onClick={() => setIsAddingTestOrder(true)}
                            className="flex items-center gap-1"
                          >
                            <PlusCircle className="h-3 w-3" />
                            Ajouter
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedConsultation.testOrders && selectedConsultation.testOrders.length > 0 ? (
                        <div className="space-y-3">
                          {selectedConsultation.testOrders.map((test, index) => (
                            <div key={index} className="p-2 border rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge className={getTestTypeColor(test.type)}>
                                    {getTestTypeLabel(test.type)}
                                  </Badge>
                                  <p className="font-medium mt-1">{test.description}</p>
                                </div>
                                <Badge className={getTestStatusColor(test.status)}>
                                  {getTestStatusLabel(test.status)}
                                </Badge>
                              </div>
                              {test.results && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                                  <p className="font-medium text-xs text-muted-foreground mb-1">Résultats:</p>
                                  <p className="whitespace-pre-line">{test.results}</p>
                                </div>
                              )}
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Demandé le {formatDate(test.orderedDate)}</span>
                                {test.completedDate && (
                                  <span>Complété le {formatDate(test.completedDate)}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          Aucun examen demandé
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Pièces jointes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {selectedConsultation.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-gray-500" />
                                <span>{attachment.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(attachment.size / 1024).toFixed(1)} MB
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          Aucune pièce jointe
                          {(selectedConsultation.status === 'in_progress' || selectedConsultation.status === 'completed') && (
                            <div className="mt-2">
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Ajouter un fichier
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Dialogue pour ajouter une demande d'examen */}
              <Dialog open={isAddingTestOrder} onOpenChange={setIsAddingTestOrder}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une demande d'examen</DialogTitle>
                    <DialogDescription>
                      Ajoutez un nouvel examen pour le patient {selectedConsultation.patientName}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="testType">Type d'examen*</Label>
                      <Select
                        value={newTestOrder.type}
                        onValueChange={(value: TestOrder['type']) => setNewTestOrder({...newTestOrder, type: value})}
                      >
                        <SelectTrigger id="testType">
                          <SelectValue placeholder="Sélectionner un type d'examen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood_test">Analyse sanguine</SelectItem>
                          <SelectItem value="radiology">Radiologie</SelectItem>
                          <SelectItem value="urine_test">Analyse d'urine</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testDescription">Description*</Label>
                      <Textarea
                        id="testDescription"
                        value={newTestOrder.description}
                        onChange={(e) => setNewTestOrder({...newTestOrder, description: e.target.value})}
                        placeholder="Ex: Numération formule sanguine"
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testStatus">Statut</Label>
                      <Select
                        value={newTestOrder.status}
                        onValueChange={(value: TestOrder['status']) => setNewTestOrder({...newTestOrder, status: value})}
                      >
                        <SelectTrigger id="testStatus">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordered">Demandé</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="canceled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testOrderedDate">Date de demande</Label>
                      <Input
                        id="testOrderedDate"
                        type="date"
                        value={newTestOrder.orderedDate}
                        onChange={(e) => setNewTestOrder({...newTestOrder, orderedDate: e.target.value})}
                      />
                    </div>
                    
                    {newTestOrder.status === 'completed' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="testCompletedDate">Date de réalisation</Label>
                          <Input
                            id="testCompletedDate"
                            type="date"
                            value={newTestOrder.completedDate}
                            onChange={(e) => setNewTestOrder({...newTestOrder, completedDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="testResults">Résultats</Label>
                          <Textarea
                            id="testResults"
                            value={newTestOrder.results}
                            onChange={(e) => setNewTestOrder({...newTestOrder, results: e.target.value})}
                            placeholder="Saisissez les résultats de l'examen..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTestOrder(false)}>Annuler</Button>
                    <Button onClick={handleAddTestOrder} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Ajout...
                        </>
                      ) : (
                        'Ajouter l\'examen'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucune consultation sélectionnée</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Veuillez sélectionner une consultation dans la liste ou créer une nouvelle consultation pour commencer.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const tabTrigger = document.querySelector('[data-value="list"]') as HTMLElement;
                    if (tabTrigger) tabTrigger.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Voir la liste
                </Button>
                <Button 
                  onClick={() => setIsCreatingConsultation(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle consultation
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogue pour créer une nouvelle consultation */}
      <Dialog open={isCreatingConsultation} onOpenChange={setIsCreatingConsultation}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle consultation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle consultation pour un patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient*</Label>
                <Select
                  value={newConsultation.patientId}
                  onValueChange={(value) => setNewConsultation({...newConsultation, patientId: value})}
                >
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Sélectionner un patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Médecin*</Label>
                <Select
                  value={newConsultation.doctorId}
                  onValueChange={(value) => setNewConsultation({...newConsultation, doctorId: value})}
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Sélectionner un médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDoctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={newConsultation.date}
                  onChange={(e) => setNewConsultation({...newConsultation, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Heure*</Label>
                <Input
                  id="time"
                  type="time"
                  value={newConsultation.time}
                  onChange={(e) => setNewConsultation({...newConsultation, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de consultation*</Label>
                <Select
                  value={newConsultation.type}
                  onValueChange={(value: Consultation['type']) => setNewConsultation({...newConsultation, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Première consultation</SelectItem>
                    <SelectItem value="follow_up">Suivi</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="specialist">Spécialiste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Select
                  value={String(newConsultation.duration || 30)}
                  onValueChange={(value) => setNewConsultation({...newConsultation, duration: parseInt(value)})}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Sélectionner une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptômes (séparés par des virgules)</Label>
              <Input
                id="symptoms"
                value={(newConsultation.symptoms || []).join(', ')}
                onChange={(e) => setNewConsultation({
                  ...newConsultation, 
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="Ex: Fièvre, Toux, Fatigue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newConsultation.notes || ''}
                onChange={(e) => setNewConsultation({...newConsultation, notes: e.target.value})}
                placeholder="Notes pour cette consultation..."
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Ajouter les signes vitaux
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px]">
                <div className="grid gap-4">
                  <h4 className="font-medium mb-2">Signes vitaux</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Température (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={vitalSigns.temperature !== undefined ? vitalSigns.temperature : ''}
                        onChange={(e) => handleVitalSignsChange('temperature', e.target.value)}
                        placeholder="Ex: 37.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Pouls (bpm)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        value={vitalSigns.heartRate !== undefined ? vitalSigns.heartRate : ''}
                        onChange={(e) => handleVitalSignsChange('heartRate', e.target.value)}
                        placeholder="Ex: 75"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodPressureSystolic">TA Systolique (mmHg)</Label>
                      <Input
                        id="bloodPressureSystolic"
                        type="number"
                        value={vitalSigns.bloodPressureSystolic !== undefined ? vitalSigns.bloodPressureSystolic : ''}
                        onChange={(e) => handleVitalSignsChange('bloodPressureSystolic', e.target.value)}
                        placeholder="Ex: 120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodPressureDiastolic">TA Diastolique (mmHg)</Label>
                      <Input
                        id="bloodPressureDiastolic"
                        type="number"
                        value={vitalSigns.bloodPressureDiastolic !== undefined ? vitalSigns.bloodPressureDiastolic : ''}
                        onChange={(e) => handleVitalSignsChange('bloodPressureDiastolic', e.target.value)}
                        placeholder="Ex: 80"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="respiratoryRate">Freq. respiratoire (/min)</Label>
                      <Input
                        id="respiratoryRate"
                        type="number"
                        value={vitalSigns.respiratoryRate !== undefined ? vitalSigns.respiratoryRate : ''}
                        onChange={(e) => handleVitalSignsChange('respiratoryRate', e.target.value)}
                        placeholder="Ex: 16"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygenSaturation">SpO2 (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        value={vitalSigns.oxygenSaturation !== undefined ? vitalSigns.oxygenSaturation : ''}
                        onChange={(e) => handleVitalSignsChange('oxygenSaturation', e.target.value)}
                        placeholder="Ex: 98"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={vitalSigns.weight !== undefined ? vitalSigns.weight : ''}
                        onChange={(e) => handleVitalSignsChange('weight', e.target.value)}
                        placeholder="Ex: 70.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={vitalSigns.height !== undefined ? vitalSigns.height : ''}
                        onChange={(e) => handleVitalSignsChange('height', e.target.value)}
                        placeholder="Ex: 175"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bmi">IMC (kg/m²)</Label>
                      <Input
                        id="bmi"
                        type="number"
                        step="0.1"
                        value={vitalSigns.bmi !== undefined ? vitalSigns.bmi : ''}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pain">Douleur (0-10)</Label>
                      <Input
                        id="pain"
                        type="number"
                        min="0"
                        max="10"
                        value={vitalSigns.pain !== undefined ? vitalSigns.pain : ''}
                        onChange={(e) => handleVitalSignsChange('pain', e.target.value)}
                        placeholder="Ex: 3"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingConsultation(false)}>Annuler</Button>
            <Button onClick={handleCreateConsultation} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la consultation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsPage;
