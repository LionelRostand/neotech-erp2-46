
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
  Pill, 
  Plus, 
  Search, 
  Filter, 
  FileText,
  User,
  UserCog,
  Clipboard,
  Send,
  Printer,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Signature,
  FileDown,
  ChevronRight,
  Calendar,
  Clock,
  Building,
  MessageSquare,
  Lock,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Types pour les prescriptions
interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  expirationDate: string;
  status: 'draft' | 'active' | 'expired' | 'canceled' | 'fulfilled';
  isRenewable: boolean;
  renewalCount: number;
  medications: Medication[];
  instructions?: string;
  diagnosis?: string;
  isSigned: boolean;
  signatureDate?: string;
  isShared: boolean;
  sharedWith?: PharmacyShare[];
  consultationId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Types pour les médicaments prescrits
interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'powder' | 'inhaler' | 'other';
  frequency: string;
  duration: string;
  quantity: number;
  notes?: string;
  isDispensed: boolean;
  dispensedDate?: string;
  dispensedBy?: string;
}

// Types pour le partage avec les pharmacies
interface PharmacyShare {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  sharedDate: string;
  status: 'sent' | 'viewed' | 'processed';
  processedDate?: string;
}

// Types simplifiés pour les patients
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  allergies: string[];
}

// Types simplifiés pour les médecins
interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
}

// Types pour les pharmacies
interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isPartner: boolean;
}

// Données de démonstration pour les prescriptions
const mockPrescriptions: Prescription[] = [
  {
    id: 'PRESC001',
    patientId: 'PAT001',
    patientName: 'Jean Dupont',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-06-10',
    expirationDate: '2023-09-10',
    status: 'active',
    isRenewable: true,
    renewalCount: 3,
    medications: [
      {
        id: 'MED001',
        name: 'Paracétamol 1000mg',
        dosage: '1 comprimé',
        form: 'tablet',
        frequency: 'toutes les 6 heures si besoin',
        duration: '7 jours',
        quantity: 14,
        notes: 'Ne pas dépasser 4 comprimés par jour',
        isDispensed: true,
        dispensedDate: '2023-06-11',
        dispensedBy: 'Pharmacie Centrale'
      },
      {
        id: 'MED002',
        name: 'Amoxicilline 500mg',
        dosage: '1 gélule',
        form: 'capsule',
        frequency: '3 fois par jour',
        duration: '7 jours',
        quantity: 21,
        notes: 'À prendre pendant les repas',
        isDispensed: true,
        dispensedDate: '2023-06-11',
        dispensedBy: 'Pharmacie Centrale'
      }
    ],
    instructions: 'Boire beaucoup d\'eau et se reposer.',
    diagnosis: 'Infection respiratoire',
    isSigned: true,
    signatureDate: '2023-06-10',
    isShared: true,
    sharedWith: [
      {
        id: 'SHARE001',
        pharmacyId: 'PHARM001',
        pharmacyName: 'Pharmacie Centrale',
        sharedDate: '2023-06-10',
        status: 'processed',
        processedDate: '2023-06-11'
      }
    ],
    consultationId: 'CONS001',
    createdAt: '2023-06-10',
    updatedAt: '2023-06-10'
  },
  {
    id: 'PRESC002',
    patientId: 'PAT002',
    patientName: 'Marie Lambert',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-06-12',
    expirationDate: '2023-09-12',
    status: 'active',
    isRenewable: false,
    renewalCount: 0,
    medications: [
      {
        id: 'MED003',
        name: 'Ibuprofène 400mg',
        dosage: '1 comprimé',
        form: 'tablet',
        frequency: '3 fois par jour',
        duration: '5 jours',
        quantity: 15,
        notes: 'À prendre pendant les repas',
        isDispensed: false
      },
      {
        id: 'MED004',
        name: 'Myorelaxant',
        dosage: '1 comprimé',
        form: 'tablet',
        frequency: '3 fois par jour',
        duration: '5 jours',
        quantity: 15,
        isDispensed: false
      }
    ],
    instructions: 'Éviter les efforts physiques. Kinésithérapie recommandée.',
    diagnosis: 'Lombalgie mécanique',
    isSigned: true,
    signatureDate: '2023-06-12',
    isShared: false,
    consultationId: 'CONS002',
    createdAt: '2023-06-12',
    updatedAt: '2023-06-12'
  },
  {
    id: 'PRESC003',
    patientId: 'PAT003',
    patientName: 'Pierre Dubois',
    doctorId: 'DOC002',
    doctorName: 'Dr. Paul Lefebvre',
    date: '2023-06-15',
    expirationDate: '2023-12-15',
    status: 'active',
    isRenewable: true,
    renewalCount: 5,
    medications: [
      {
        id: 'MED005',
        name: 'Aspirine 75mg',
        dosage: '1 comprimé',
        form: 'tablet',
        frequency: '1 fois par jour',
        duration: 'Long terme',
        quantity: 30,
        isDispensed: true,
        dispensedDate: '2023-06-16',
        dispensedBy: 'Pharmacie du Centre'
      },
      {
        id: 'MED006',
        name: 'Trinitrine spray',
        dosage: '1 à 2 bouffées',
        form: 'other',
        frequency: 'en cas de crise',
        duration: 'Au besoin',
        quantity: 1,
        notes: 'À renouveler si nécessaire',
        isDispensed: true,
        dispensedDate: '2023-06-16',
        dispensedBy: 'Pharmacie du Centre'
      }
    ],
    instructions: 'Consulter en urgence en cas de douleur thoracique prolongée.',
    diagnosis: 'Suspicion d\'angor',
    isSigned: true,
    signatureDate: '2023-06-15',
    isShared: true,
    sharedWith: [
      {
        id: 'SHARE002',
        pharmacyId: 'PHARM002',
        pharmacyName: 'Pharmacie du Centre',
        sharedDate: '2023-06-15',
        status: 'processed',
        processedDate: '2023-06-16'
      }
    ],
    consultationId: 'CONS003',
    createdAt: '2023-06-15',
    updatedAt: '2023-06-15'
  },
  {
    id: 'PRESC004',
    patientId: 'PAT001',
    patientName: 'Jean Dupont',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sophie Martin',
    date: '2023-05-05',
    expirationDate: '2023-06-05',
    status: 'expired',
    isRenewable: false,
    renewalCount: 0,
    medications: [
      {
        id: 'MED007',
        name: 'Antibiotique',
        dosage: '1 comprimé',
        form: 'tablet',
        frequency: '2 fois par jour',
        duration: '10 jours',
        quantity: 20,
        isDispensed: true,
        dispensedDate: '2023-05-05',
        dispensedBy: 'Pharmacie Centrale'
      }
    ],
    instructions: 'Terminer le traitement même si les symptômes disparaissent.',
    diagnosis: 'Infection bactérienne',
    isSigned: true,
    signatureDate: '2023-05-05',
    isShared: true,
    sharedWith: [
      {
        id: 'SHARE003',
        pharmacyId: 'PHARM001',
        pharmacyName: 'Pharmacie Centrale',
        sharedDate: '2023-05-05',
        status: 'processed',
        processedDate: '2023-05-05'
      }
    ],
    createdAt: '2023-05-05',
    updatedAt: '2023-05-05'
  },
  {
    id: 'PRESC005',
    patientId: 'PAT004',
    patientName: 'Claire Moreau',
    doctorId: 'DOC003',
    doctorName: 'Dr. Julie Dubois',
    date: '2023-06-14',
    expirationDate: '2023-09-14',
    status: 'draft',
    isRenewable: false,
    renewalCount: 0,
    medications: [
      {
        id: 'MED008',
        name: 'Crème anti-inflammatoire',
        dosage: 'Appliquer une noisette',
        form: 'cream',
        frequency: '2 fois par jour',
        duration: '14 jours',
        quantity: 1,
        notes: 'Appliquer sur les zones affectées',
        isDispensed: false
      }
    ],
    instructions: 'Éviter l\'exposition au soleil pendant le traitement.',
    diagnosis: 'Dermatite de contact',
    isSigned: false,
    isShared: false,
    createdAt: '2023-06-14'
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
    allergies: ['Pénicilline']
  },
  {
    id: 'PAT002',
    firstName: 'Marie',
    lastName: 'Lambert',
    dateOfBirth: '1982-09-23',
    gender: 'female',
    allergies: ['Aspirine']
  },
  {
    id: 'PAT003',
    firstName: 'Pierre',
    lastName: 'Dubois',
    dateOfBirth: '1968-02-14',
    gender: 'male',
    allergies: []
  },
  {
    id: 'PAT004',
    firstName: 'Claire',
    lastName: 'Moreau',
    dateOfBirth: '1990-11-30',
    gender: 'female',
    allergies: ['Latex']
  },
  {
    id: 'PAT005',
    firstName: 'Thomas',
    lastName: 'Bernard',
    dateOfBirth: '1995-07-18',
    gender: 'male',
    allergies: []
  }
];

// Données de démonstration pour les médecins
const mockDoctors: Doctor[] = [
  {
    id: 'DOC001',
    firstName: 'Sophie',
    lastName: 'Martin',
    specialty: 'Médecine générale',
    licenseNumber: 'MED-12345'
  },
  {
    id: 'DOC002',
    firstName: 'Paul',
    lastName: 'Lefebvre',
    specialty: 'Cardiologie',
    licenseNumber: 'MED-23456'
  },
  {
    id: 'DOC003',
    firstName: 'Julie',
    lastName: 'Dubois',
    specialty: 'Dermatologie',
    licenseNumber: 'MED-34567'
  },
  {
    id: 'DOC004',
    firstName: 'Antoine',
    lastName: 'Bernard',
    specialty: 'Pédiatrie',
    licenseNumber: 'MED-45678'
  }
];

// Données de démonstration pour les pharmacies
const mockPharmacies: Pharmacy[] = [
  {
    id: 'PHARM001',
    name: 'Pharmacie Centrale',
    address: '15 Rue du Commerce, 75001 Paris',
    phone: '0123456789',
    email: 'contact@pharmaciecentrale.com',
    isPartner: true
  },
  {
    id: 'PHARM002',
    name: 'Pharmacie du Centre',
    address: '25 Avenue des Fleurs, 75008 Paris',
    phone: '0234567890',
    email: 'contact@pharmacieducentre.com',
    isPartner: true
  },
  {
    id: 'PHARM003',
    name: 'Pharmacie de la Gare',
    address: '3 Place de la Gare, 75012 Paris',
    phone: '0345678901',
    email: 'contact@pharmaciegare.com',
    isPartner: false
  }
];

const PrescriptionsPage: React.FC = () => {
  // États
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false);
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isViewingPrintPreview, setIsViewingPrintPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  
  // Nouvel état pour le formulaire de prescription
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 jours par défaut
    status: 'draft',
    isRenewable: false,
    renewalCount: 0,
    medications: [],
    isSigned: false,
    isShared: false
  });
  
  // Nouvel état pour le formulaire de médicament
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    form: 'tablet',
    frequency: '',
    duration: '',
    quantity: 1,
    notes: '',
    isDispensed: false
  });
  
  // Filtrage des prescriptions
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? prescription.status === statusFilter : true;
    const matchesDate = dateFilter ? prescription.date === dateFilter : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Hooks
  const prescriptionsCollection = useFirestore(COLLECTIONS.HEALTH);
  const { toast } = useToast();
  
  // Fonction pour créer une nouvelle prescription
  const handleCreatePrescription = () => {
    if (!newPrescription.patientId || !newPrescription.doctorId || !newPrescription.date) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (newPrescription.medications?.length === 0) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez ajouter au moins un médicament à la prescription.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    // Simuler un délai pour l'API
    setTimeout(() => {
      const patient = mockPatients.find(p => p.id === newPrescription.patientId);
      const doctor = mockDoctors.find(d => d.id === newPrescription.doctorId);
      
      if (!patient || !doctor) {
        toast({
          title: "Erreur",
          description: "Patient ou médecin non trouvé.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      const prescriptionId = `PRESC${String(prescriptions.length + 1).padStart(3, '0')}`;
      
      const createdPrescription: Prescription = {
        id: prescriptionId,
        patientId: newPrescription.patientId!,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: newPrescription.doctorId!,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        date: newPrescription.date!,
        expirationDate: newPrescription.expirationDate!,
        status: newPrescription.status as Prescription['status'],
        isRenewable: newPrescription.isRenewable || false,
        renewalCount: newPrescription.renewalCount || 0,
        medications: newPrescription.medications as Medication[],
        instructions: newPrescription.instructions,
        diagnosis: newPrescription.diagnosis,
        isSigned: newPrescription.isSigned || false,
        signatureDate: newPrescription.isSigned ? new Date().toISOString().split('T')[0] : undefined,
        isShared: newPrescription.isShared || false,
        sharedWith: newPrescription.sharedWith,
        consultationId: newPrescription.consultationId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setPrescriptions([...prescriptions, createdPrescription]);
      setIsCreatingPrescription(false);
      setNewPrescription({
        patientId: '',
        doctorId: '',
        date: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        isRenewable: false,
        renewalCount: 0,
        medications: [],
        isSigned: false,
        isShared: false
      });

      toast({
        title: "Prescription créée",
        description: `La prescription a été créée avec succès pour ${patient.firstName} ${patient.lastName}.`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour ajouter un médicament à la prescription
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.duration) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const medicationId = `MED${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    const medication: Medication = {
      id: medicationId,
      name: newMedication.name!,
      dosage: newMedication.dosage!,
      form: newMedication.form as Medication['form'],
      frequency: newMedication.frequency!,
      duration: newMedication.duration!,
      quantity: newMedication.quantity || 1,
      notes: newMedication.notes,
      isDispensed: false
    };

    if (isCreatingPrescription) {
      // Ajouter à la nouvelle prescription
      setNewPrescription({
        ...newPrescription,
        medications: [...(newPrescription.medications || []), medication]
      });
    } else if (selectedPrescription) {
      // Ajouter à la prescription existante
      const updatedPrescription = {
        ...selectedPrescription,
        medications: [...selectedPrescription.medications, medication],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setPrescriptions(prescriptions.map(p => 
        p.id === selectedPrescription.id ? updatedPrescription : p
      ));
      
      setSelectedPrescription(updatedPrescription);
    }

    setIsAddingMedication(false);
    setNewMedication({
      name: '',
      dosage: '',
      form: 'tablet',
      frequency: '',
      duration: '',
      quantity: 1,
      notes: '',
      isDispensed: false
    });

    toast({
      title: "Médicament ajouté",
      description: "Le médicament a été ajouté à la prescription."
    });
  };
  
  // Fonction pour signer une prescription
  const handleSignPrescription = (prescriptionId: string) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { 
            ...prescription, 
            isSigned: true,
            signatureDate: new Date().toISOString().split('T')[0],
            status: prescription.status === 'draft' ? 'active' : prescription.status,
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : prescription
    ));

    toast({
      title: "Prescription signée",
      description: "La prescription a été signée avec succès."
    });
    
    if (selectedPrescription?.id === prescriptionId) {
      setSelectedPrescription({ 
        ...selectedPrescription, 
        isSigned: true,
        signatureDate: new Date().toISOString().split('T')[0],
        status: selectedPrescription.status === 'draft' ? 'active' : selectedPrescription.status,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };
  
  // Fonction pour partager une prescription avec des pharmacies
  const handleSharePrescription = () => {
    if (!selectedPrescription || selectedPharmacies.length === 0) {
      toast({
        title: "Erreur de partage",
        description: "Veuillez sélectionner au moins une pharmacie.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    // Simuler un délai pour l'API
    setTimeout(() => {
      // Créer les partages avec les pharmacies sélectionnées
      const newShares = selectedPharmacies.map(pharmacyId => {
        const pharmacy = mockPharmacies.find(p => p.id === pharmacyId);
        return {
          id: `SHARE${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          pharmacyId,
          pharmacyName: pharmacy?.name || 'Pharmacie inconnue',
          sharedDate: new Date().toISOString().split('T')[0],
          status: 'sent' as const
        };
      });

      // Mettre à jour la prescription
      const updatedPrescription = {
        ...selectedPrescription,
        isShared: true,
        sharedWith: [...(selectedPrescription.sharedWith || []), ...newShares],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      setPrescriptions(prescriptions.map(p => 
        p.id === selectedPrescription.id ? updatedPrescription : p
      ));
      
      setSelectedPrescription(updatedPrescription);
      setShowShareDialog(false);
      setSelectedPharmacies([]);

      toast({
        title: "Prescription partagée",
        description: `La prescription a été partagée avec ${newShares.length} pharmacie(s).`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour annuler une prescription
  const handleCancelPrescription = (prescriptionId: string) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { 
            ...prescription, 
            status: 'canceled',
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : prescription
    ));

    toast({
      title: "Prescription annulée",
      description: "La prescription a été annulée avec succès."
    });
    
    if (selectedPrescription?.id === prescriptionId) {
      setSelectedPrescription({ 
        ...selectedPrescription, 
        status: 'canceled',
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }
  };
  
  // Fonction pour renouveler une prescription
  const handleRenewPrescription = (prescriptionId: string) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (!prescription || !prescription.isRenewable || prescription.renewalCount <= 0) {
      toast({
        title: "Erreur",
        description: "Cette prescription ne peut pas être renouvelée.",
        variant: "destructive"
      });
      return;
    }

    // Créer une nouvelle prescription basée sur la précédente
    const today = new Date().toISOString().split('T')[0];
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);
    
    const newPrescriptionId = `PRESC${String(prescriptions.length + 1).padStart(3, '0')}`;
    
    const renewedPrescription: Prescription = {
      ...prescription,
      id: newPrescriptionId,
      date: today,
      expirationDate: expirationDate.toISOString().split('T')[0],
      status: 'active',
      renewalCount: prescription.renewalCount - 1,
      medications: prescription.medications.map(med => ({
        ...med,
        id: `MED${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        isDispensed: false,
        dispensedDate: undefined,
        dispensedBy: undefined
      })),
      isSigned: true,
      signatureDate: today,
      isShared: false,
      sharedWith: [],
      createdAt: today,
      updatedAt: today
    };

    setPrescriptions([...prescriptions, renewedPrescription]);

    toast({
      title: "Prescription renouvelée",
      description: "Une nouvelle prescription a été créée avec les mêmes médicaments."
    });
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater le statut de prescription
  const getPrescriptionStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'active': return 'Active';
      case 'expired': return 'Expirée';
      case 'canceled': return 'Annulée';
      case 'fulfilled': return 'Délivrée';
      default: return status;
    }
  };
  
  // Couleurs des badges de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Formater le type de forme du médicament
  const getMedicationFormLabel = (form: string) => {
    switch (form) {
      case 'tablet': return 'Comprimé';
      case 'capsule': return 'Gélule';
      case 'syrup': return 'Sirop';
      case 'injection': return 'Injection';
      case 'cream': return 'Crème';
      case 'drops': return 'Gouttes';
      case 'powder': return 'Poudre';
      case 'inhaler': return 'Inhalateur';
      case 'other': return 'Autre';
      default: return form;
    }
  };
  
  // Icon pour chaque forme de médicament
  const getMedicationFormIcon = (form: string) => {
    switch (form) {
      case 'tablet': return <div className="w-4 h-4 rounded-full border border-current"></div>;
      case 'capsule': return <div className="w-6 h-3 rounded-full border border-current"></div>;
      case 'syrup': return <div className="w-4 h-5 rounded-sm border border-current"></div>;
      case 'injection': return <div className="w-1 h-5 border border-current"></div>;
      case 'cream': return <div className="w-4 h-4 rounded-sm border border-current"></div>;
      case 'drops': return <div className="w-3 h-5 rounded-b-full border border-current"></div>;
      case 'powder': return <div className="w-4 h-4 border border-current"></div>;
      case 'inhaler': return <div className="w-4 h-5 border border-current"></div>;
      default: return <Pill className="h-4 w-4" />;
    }
  };
  
  // Formater le statut de partage
  const getShareStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Envoyé';
      case 'viewed': return 'Consulté';
      case 'processed': return 'Traité';
      default: return status;
    }
  };
  
  // Couleurs des badges de statut de partage
  const getShareStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'processed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-500" />
        Gestion des Ordonnances
      </h2>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Liste des ordonnances
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Détail de l'ordonnance
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
                    {statusFilter ? getPrescriptionStatusLabel(statusFilter) : "Tous les statuts"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expirée</SelectItem>
                  <SelectItem value="canceled">Annulée</SelectItem>
                  <SelectItem value="fulfilled">Délivrée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setIsCreatingPrescription(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle ordonnance
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
                    <TableHead>Médicaments</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucune ordonnance trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>
                          <div className="font-medium">{formatDate(prescription.date)}</div>
                          <div className="text-xs text-muted-foreground">{prescription.id}</div>
                        </TableCell>
                        <TableCell>{prescription.patientName}</TableCell>
                        <TableCell>{prescription.doctorName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {prescription.medications.slice(0, 2).map((med, index) => (
                              <div key={index} className="text-sm truncate max-w-[200px]">
                                {med.name}
                              </div>
                            ))}
                            {prescription.medications.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                + {prescription.medications.length - 2} autres
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(prescription.status)}>
                            {getPrescriptionStatusLabel(prescription.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {prescription.isSigned ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Signée
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Non signée
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${
                            new Date(prescription.expirationDate) < new Date() ? 'text-red-600' : ''
                          }`}>
                            {formatDate(prescription.expirationDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                const tabTrigger = document.querySelector('[data-value="detail"]') as HTMLElement;
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
                                {!prescription.isSigned && prescription.status !== 'canceled' && (
                                  <DropdownMenuItem onClick={() => handleSignPrescription(prescription.id)}>
                                    <Signature className="h-4 w-4 mr-2" />
                                    Signer
                                  </DropdownMenuItem>
                                )}
                                {prescription.isSigned && prescription.status === 'active' && !prescription.isShared && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedPrescription(prescription);
                                    setShowShareDialog(true);
                                  }}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Partager
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => {
                                  setSelectedPrescription(prescription);
                                  setIsViewingPrintPreview(true);
                                }}>
                                  <Printer className="h-4 w-4 mr-2" />
                                  Imprimer
                                </DropdownMenuItem>
                                {prescription.status === 'active' && prescription.isRenewable && prescription.renewalCount > 0 && (
                                  <DropdownMenuItem onClick={() => handleRenewPrescription(prescription.id)}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Renouveler
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {prescription.status !== 'canceled' && prescription.status !== 'expired' && (
                                  <DropdownMenuItem onClick={() => handleCancelPrescription(prescription.id)}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Annuler
                                  </DropdownMenuItem>
                                )}
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

        <TabsContent value="detail" className="space-y-4">
          {selectedPrescription ? (
            <>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPrescription(null);
                    const tabTrigger = document.querySelector('[data-value="list"]') as HTMLElement;
                    if (tabTrigger) tabTrigger.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Retour à la liste
                </Button>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedPrescription.status)}>
                    {getPrescriptionStatusLabel(selectedPrescription.status)}
                  </Badge>
                  {selectedPrescription.isRenewable && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Renouvelable {selectedPrescription.renewalCount} fois
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Ordonnance médicale</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {selectedPrescription.id}
                      </div>
                    </div>
                    <CardDescription>
                      Délivrée le {formatDate(selectedPrescription.date)} - Expire le {formatDate(selectedPrescription.expirationDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Patient</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedPrescription.patientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {mockPatients.find(p => p.id === selectedPrescription.patientId)?.dateOfBirth 
                                ? `Né(e) le ${formatDate(mockPatients.find(p => p.id === selectedPrescription.patientId)!.dateOfBirth)}`
                                : ''
                              }
                            </p>
                          </div>
                        </div>
                        {mockPatients.find(p => p.id === selectedPrescription.patientId)?.allergies.length! > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-red-600 font-medium">Allergies:</p>
                            <p className="text-xs text-red-600">
                              {mockPatients.find(p => p.id === selectedPrescription.patientId)?.allergies.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Médecin</h4>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedPrescription.doctorName}</p>
                            <p className="text-sm text-muted-foreground">
                              {mockDoctors.find(d => d.id === selectedPrescription.doctorId)?.specialty || ''}
                            </p>
                          </div>
                        </div>
                        {selectedPrescription.consultationId && (
                          <div className="mt-2">
                            <p className="text-xs text-blue-600 font-medium">Consultation liée: {selectedPrescription.consultationId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPrescription.diagnosis && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Diagnostic</h4>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p>{selectedPrescription.diagnosis}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2 pt-2">
                      <h4 className="text-base font-medium">Médicaments prescrits</h4>
                      <div className="space-y-3">
                        {selectedPrescription.medications.map((medication, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="text-gray-500">
                                  {getMedicationFormIcon(medication.form)}
                                </div>
                                <div>
                                  <p className="font-medium">{medication.name}</p>
                                  <p className="text-sm">{medication.dosage} • {getMedicationFormLabel(medication.form)}</p>
                                </div>
                              </div>
                              {medication.isDispensed ? (
                                <Badge className="bg-blue-100 text-blue-800">
                                  Délivré
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Non délivré
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 text-sm">
                              <p><span className="font-medium">Posologie:</span> {medication.frequency}</p>
                              <p><span className="font-medium">Durée:</span> {medication.duration}</p>
                              <p><span className="font-medium">Quantité:</span> {medication.quantity}</p>
                            </div>
                            {medication.notes && (
                              <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
                                {medication.notes}
                              </div>
                            )}
                            {medication.isDispensed && medication.dispensedDate && (
                              <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                                Délivré le {formatDate(medication.dispensedDate)} par {medication.dispensedBy}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {selectedPrescription.status !== 'expired' && selectedPrescription.status !== 'canceled' && (
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsAddingMedication(true)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Ajouter un médicament
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {selectedPrescription.instructions && (
                      <div className="space-y-2 pt-2 border-t">
                        <h4 className="text-sm font-medium text-muted-foreground">Instructions</h4>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="whitespace-pre-line">{selectedPrescription.instructions}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-between gap-2 pt-2 border-t">
                    <div>
                      {!selectedPrescription.isSigned ? (
                        <Button 
                          variant="default" 
                          onClick={() => handleSignPrescription(selectedPrescription.id)}
                          className="flex items-center gap-2"
                          disabled={selectedPrescription.status === 'canceled' || selectedPrescription.status === 'expired'}
                        >
                          <Signature className="h-4 w-4" />
                          Signer l'ordonnance
                        </Button>
                      ) : (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <Signature className="h-4 w-4" />
                          Signée le {formatDate(selectedPrescription.signatureDate!)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setIsViewingPrintPreview(true)}
                        className="flex items-center gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Imprimer
                      </Button>
                      
                      {selectedPrescription.isSigned && selectedPrescription.status === 'active' && !selectedPrescription.isShared && (
                        <Button 
                          variant="outline"
                          onClick={() => setShowShareDialog(true)}
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Partager
                        </Button>
                      )}
                      
                      {selectedPrescription.status === 'active' && selectedPrescription.isRenewable && selectedPrescription.renewalCount > 0 && (
                        <Button 
                          variant="outline"
                          onClick={() => handleRenewPrescription(selectedPrescription.id)}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Renouveler
                        </Button>
                      )}
                      
                      {selectedPrescription.status !== 'canceled' && selectedPrescription.status !== 'expired' && (
                        <Button 
                          variant="destructive"
                          onClick={() => handleCancelPrescription(selectedPrescription.id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
                
                <div className="space-y-4">
                  {selectedPrescription.isShared && selectedPrescription.sharedWith && selectedPrescription.sharedWith.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Partagé avec</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedPrescription.sharedWith.map((share, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                              <div>
                                <p className="font-medium">{share.pharmacyName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Partagé le {formatDate(share.sharedDate)}
                                </p>
                              </div>
                              <Badge className={getShareStatusColor(share.status)}>
                                {getShareStatusLabel(share.status)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        
                        {selectedPrescription.status === 'active' && (
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              className="w-full flex items-center gap-2"
                              onClick={() => setShowShareDialog(true)}
                            >
                              <Send className="h-4 w-4" />
                              Partager avec d'autres pharmacies
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Historique</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <FileText className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Prescription créée</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedPrescription.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {selectedPrescription.isSigned && (
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                              <Signature className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Signée par {selectedPrescription.doctorName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedPrescription.signatureDate!)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPrescription.isShared && selectedPrescription.sharedWith && (
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <Send className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Partagée avec une pharmacie</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedPrescription.sharedWith[0].sharedDate)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPrescription.medications.some(med => med.isDispensed) && (
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                              <Pill className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">Médicaments délivrés</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedPrescription.medications.find(med => med.isDispensed)?.dispensedDate!)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPrescription.status === 'expired' && (
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                              <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">Expirée</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedPrescription.expirationDate)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPrescription.status === 'canceled' && (
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">Annulée</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(selectedPrescription.updatedAt!)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Dialogue pour ajouter un médicament */}
              <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un médicament</DialogTitle>
                    <DialogDescription>
                      Ajoutez un médicament à la prescription
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="medName">Nom du médicament*</Label>
                        <Input
                          id="medName"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                          placeholder="Ex: Paracétamol 1000mg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medDosage">Dosage*</Label>
                        <Input
                          id="medDosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                          placeholder="Ex: 1 comprimé"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medForm">Forme*</Label>
                        <Select
                          value={newMedication.form}
                          onValueChange={(value: Medication['form']) => setNewMedication({...newMedication, form: value})}
                        >
                          <SelectTrigger id="medForm">
                            <SelectValue placeholder="Sélectionner une forme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tablet">Comprimé</SelectItem>
                            <SelectItem value="capsule">Gélule</SelectItem>
                            <SelectItem value="syrup">Sirop</SelectItem>
                            <SelectItem value="injection">Injection</SelectItem>
                            <SelectItem value="cream">Crème</SelectItem>
                            <SelectItem value="drops">Gouttes</SelectItem>
                            <SelectItem value="powder">Poudre</SelectItem>
                            <SelectItem value="inhaler">Inhalateur</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medFrequency">Fréquence*</Label>
                        <Input
                          id="medFrequency"
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                          placeholder="Ex: 3 fois par jour"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medDuration">Durée*</Label>
                        <Input
                          id="medDuration"
                          value={newMedication.duration}
                          onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                          placeholder="Ex: 7 jours"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medQuantity">Quantité</Label>
                        <Input
                          id="medQuantity"
                          type="number"
                          min="1"
                          value={newMedication.quantity || ''}
                          onChange={(e) => setNewMedication({...newMedication, quantity: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="medNotes">Notes</Label>
                        <Textarea
                          id="medNotes"
                          value={newMedication.notes || ''}
                          onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                          placeholder="Ex: À prendre pendant les repas"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingMedication(false)}>Annuler</Button>
                    <Button onClick={handleAddMedication}>
                      Ajouter le médicament
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Dialogue pour partager une ordonnance */}
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Partager l'ordonnance</DialogTitle>
                    <DialogDescription>
                      Sélectionnez les pharmacies avec lesquelles partager cette ordonnance
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="space-y-4">
                      <div className="rounded-md border p-4 bg-blue-50 text-blue-800">
                        <div className="flex gap-2">
                          <Send className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Informations importantes</p>
                            <p className="text-sm mt-1">
                              En partageant cette ordonnance, vous autorisez la ou les pharmacies sélectionnées à accéder
                              aux informations médicales contenues dans cette prescription.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Pharmacies partenaires</Label>
                        <div className="space-y-2">
                          {mockPharmacies
                            .filter(pharmacy => pharmacy.isPartner)
                            .filter(pharmacy => 
                              !(selectedPrescription.sharedWith || [])
                                .some(share => share.pharmacyId === pharmacy.id)
                            )
                            .map(pharmacy => (
                              <div 
                                key={pharmacy.id} 
                                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`pharmacy-${pharmacy.id}`}
                                    checked={selectedPharmacies.includes(pharmacy.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedPharmacies([...selectedPharmacies, pharmacy.id]);
                                      } else {
                                        setSelectedPharmacies(selectedPharmacies.filter(id => id !== pharmacy.id));
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`pharmacy-${pharmacy.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {pharmacy.name}
                                  </label>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {pharmacy.address}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="patient-consent" defaultChecked />
                          <label
                            htmlFor="patient-consent"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Le patient a donné son consentement pour le partage de cette ordonnance
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowShareDialog(false)}>Annuler</Button>
                    <Button 
                      onClick={handleSharePrescription}
                      disabled={selectedPharmacies.length === 0 || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Partage...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Partager l'ordonnance
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Dialogue pour l'aperçu avant impression */}
              <Dialog open={isViewingPrintPreview} onOpenChange={setIsViewingPrintPreview}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Aperçu avant impression</DialogTitle>
                    <DialogDescription>
                      Ordonnance pour {selectedPrescription.patientName}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="border p-8 bg-white rounded-md">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-bold">{selectedPrescription.doctorName}</h3>
                          <p>{mockDoctors.find(d => d.id === selectedPrescription.doctorId)?.specialty}</p>
                          <p className="text-sm">No RPPS: {mockDoctors.find(d => d.id === selectedPrescription.doctorId)?.licenseNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Cabinet Médical</p>
                          <p className="text-sm">123 Avenue de la Médecine</p>
                          <p className="text-sm">75001 Paris</p>
                          <p className="text-sm">Tél: 01 23 45 67 89</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-b py-4 mb-6">
                        <p className="text-right">{formatDate(selectedPrescription.date)}</p>
                        <div className="mt-4">
                          <p><span className="font-bold">Patient:</span> {selectedPrescription.patientName}</p>
                          {selectedPrescription.diagnosis && (
                            <p className="mt-2"><span className="font-bold">Diagnostic:</span> {selectedPrescription.diagnosis}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h4 className="text-center font-bold mb-4 text-lg">ORDONNANCE</h4>
                        <div className="space-y-4">
                          {selectedPrescription.medications.map((medication, index) => (
                            <div key={index} className="space-y-1">
                              <p className="font-bold">{medication.name}</p>
                              <p className="ml-4">{medication.dosage} • {getMedicationFormLabel(medication.form)}</p>
                              <p className="ml-4">Posologie: {medication.frequency}</p>
                              <p className="ml-4">Durée: {medication.duration}</p>
                              <p className="ml-4">Quantité: {medication.quantity}</p>
                              {medication.notes && (
                                <p className="ml-4 text-sm italic">{medication.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {selectedPrescription.instructions && (
                          <div className="mt-6 p-3 border rounded-md">
                            <p className="font-bold">Instructions:</p>
                            <p className="whitespace-pre-line">{selectedPrescription.instructions}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p>Ordonnance valable jusqu'au {formatDate(selectedPrescription.expirationDate)}</p>
                          {selectedPrescription.isRenewable && (
                            <p>Renouvelable {selectedPrescription.renewalCount} fois</p>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="border-b pb-2 mb-2">
                            {selectedPrescription.isSigned && (
                              <p className="font-bold italic">{selectedPrescription.doctorName}</p>
                            )}
                          </div>
                          <p>Signature</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsViewingPrintPreview(false)}
                      className="flex items-center gap-2"
                    >
                      Fermer
                    </Button>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Impression",
                          description: "Ordonnance envoyée à l'imprimante"
                        });
                        setIsViewingPrintPreview(false);
                      }}
                    >
                      <Printer className="h-4 w-4" />
                      Imprimer
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Téléchargement",
                          description: "Ordonnance téléchargée au format PDF"
                        });
                        setIsViewingPrintPreview(false);
                      }}
                    >
                      <FileDown className="h-4 w-4" />
                      Télécharger PDF
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucune ordonnance sélectionnée</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Veuillez sélectionner une ordonnance dans la liste ou créer une nouvelle ordonnance pour commencer.
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
                  onClick={() => setIsCreatingPrescription(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle ordonnance
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogue pour créer une nouvelle ordonnance */}
      <Dialog open={isCreatingPrescription} onOpenChange={setIsCreatingPrescription}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nouvelle ordonnance</DialogTitle>
            <DialogDescription>
              Créez une nouvelle ordonnance pour un patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient*</Label>
                <Select
                  value={newPrescription.patientId}
                  onValueChange={(value) => setNewPrescription({...newPrescription, patientId: value})}
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
                  value={newPrescription.doctorId}
                  onValueChange={(value) => setNewPrescription({...newPrescription, doctorId: value})}
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
                <Label htmlFor="date">Date de prescription*</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPrescription.date}
                  onChange={(e) => setNewPrescription({...newPrescription, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Date d'expiration*</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={newPrescription.expirationDate}
                  onChange={(e) => setNewPrescription({...newPrescription, expirationDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut initial</Label>
                <Select
                  value={newPrescription.status}
                  onValueChange={(value: Prescription['status']) => setNewPrescription({...newPrescription, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isRenewable">Ordonnance renouvelable</Label>
                  <Switch
                    id="isRenewable"
                    checked={newPrescription.isRenewable}
                    onCheckedChange={(checked) => setNewPrescription({...newPrescription, isRenewable: checked})}
                  />
                </div>
                
                {newPrescription.isRenewable && (
                  <div className="mt-2">
                    <Label htmlFor="renewalCount">Nombre de renouvellements</Label>
                    <Input
                      id="renewalCount"
                      type="number"
                      min="1"
                      max="12"
                      value={newPrescription.renewalCount || ''}
                      onChange={(e) => setNewPrescription({...newPrescription, renewalCount: parseInt(e.target.value)})}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnostic</Label>
              <Input
                id="diagnosis"
                value={newPrescription.diagnosis || ''}
                onChange={(e) => setNewPrescription({...newPrescription, diagnosis: e.target.value})}
                placeholder="Ex: Infection respiratoire"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Médicaments</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingMedication(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              
              {newPrescription.medications && newPrescription.medications.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {newPrescription.medications.map((medication, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm">{medication.dosage} - {medication.frequency}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const updatedMedications = [...newPrescription.medications!];
                          updatedMedications.splice(index, 1);
                          setNewPrescription({...newPrescription, medications: updatedMedications});
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md bg-gray-50 text-muted-foreground">
                  Aucun médicament ajouté
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={newPrescription.instructions || ''}
                onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                placeholder="Instructions supplémentaires pour le patient..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isSigned" 
                checked={newPrescription.isSigned}
                onCheckedChange={(checked) => setNewPrescription({...newPrescription, isSigned: !!checked})}
              />
              <label
                htmlFor="isSigned"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Signer immédiatement
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingPrescription(false)}>Annuler</Button>
            <Button 
              onClick={handleCreatePrescription}
              disabled={isSaving || newPrescription.medications?.length === 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer l\'ordonnance'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionsPage;
