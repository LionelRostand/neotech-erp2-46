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
  UserCog, 
  User,
  Users,
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronRight,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  RefreshCw,
  Clipboard,
  ClipboardCheck,
  ClipboardList,
  Heart,
  Shield,
  BadgeCheck,
  Star
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Types pour le personnel soignant
interface Nurse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'nurse' | 'auxiliary_nurse' | 'nursing_assistant' | 'midwife' | 'specialist_nurse';
  specialties: string[];
  licenseNumber: string;
  dateOfBirth: string;
  startDate: string;
  department: string;
  status: 'active' | 'leave' | 'inactive';
  availableShifts: ('morning' | 'afternoon' | 'night')[];
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
  languages: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
  avatar?: string;
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

interface Certification {
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
  documentRef?: string;
}

interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  field: string;
}

// Interface pour la planification
interface Schedule {
  id: string;
  nurseId: string;
  nurseName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  department: string;
  status: 'scheduled' | 'completed' | 'absent' | 'modified';
  notes?: string;
}

// Données de test pour le personnel soignant
const mockNurses: Nurse[] = [
  {
    id: 'N001',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@hospital.com',
    phone: '0123456789',
    role: 'nurse',
    specialties: ['Soins intensifs', 'Urgences'],
    licenseNumber: 'INF12345',
    dateOfBirth: '1985-04-12',
    startDate: '2015-06-01',
    department: 'Urgences',
    status: 'active',
    availableShifts: ['morning', 'afternoon', 'night'],
    skills: [
      { name: 'Pose de cathéter', level: 'expert', verified: true, verifiedBy: 'Dr. Martin', verifiedDate: '2022-01-15' },
      { name: 'Soins de plaies', level: 'advanced', verified: true, verifiedBy: 'Dr. Martin', verifiedDate: '2022-01-15' },
      { name: 'Réanimation cardio-pulmonaire', level: 'expert', verified: true, verifiedBy: 'Dr. Leclerc', verifiedDate: '2022-03-10' }
    ],
    certifications: [
      { name: 'ACLS (Advanced Cardiovascular Life Support)', issuedBy: 'American Heart Association', issueDate: '2021-05-10', expiryDate: '2023-05-10' },
      { name: 'PALS (Pediatric Advanced Life Support)', issuedBy: 'American Heart Association', issueDate: '2021-06-15', expiryDate: '2023-06-15' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Paris', graduationYear: '2010', field: 'Soins infirmiers' },
      { degree: 'Master en Soins Infirmiers', institution: 'Université de Paris', graduationYear: '2014', field: 'Soins d\'urgence' }
    ],
    languages: ['Français', 'Anglais', 'Espagnol'],
    emergencyContact: {
      name: 'Pierre Dupont',
      relationship: 'Époux',
      phone: '0987654321'
    },
    notes: 'Excellente infirmière avec une grande expérience en soins d\'urgence.',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg'
  },
  {
    id: 'N002',
    firstName: 'Jean',
    lastName: 'Martin',
    email: 'jean.martin@hospital.com',
    phone: '0123456788',
    role: 'specialist_nurse',
    specialties: ['Anesthésie', 'Bloc opératoire'],
    licenseNumber: 'INFS6789',
    dateOfBirth: '1980-11-25',
    startDate: '2012-03-15',
    department: 'Chirurgie',
    status: 'active',
    availableShifts: ['morning', 'afternoon'],
    skills: [
      { name: 'Assistance opératoire', level: 'expert', verified: true, verifiedBy: 'Dr. Petit', verifiedDate: '2021-12-05' },
      { name: 'Surveillance post-anesthésique', level: 'advanced', verified: true, verifiedBy: 'Dr. Petit', verifiedDate: '2021-12-05' }
    ],
    certifications: [
      { name: 'IBODE (Infirmier de Bloc Opératoire Diplômé d\'État)', issuedBy: 'Ministère de la Santé', issueDate: '2014-07-20' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Lyon', graduationYear: '2008', field: 'Soins infirmiers' },
      { degree: 'Spécialisation IBODE', institution: 'École d\'IBODE de Lyon', graduationYear: '2014', field: 'Bloc opératoire' }
    ],
    languages: ['Français', 'Anglais'],
    emergencyContact: {
      name: 'Claire Martin',
      relationship: 'Épouse',
      phone: '0987654322'
    },
    notes: 'Infirmier spécialisé en bloc opératoire avec d\'excellentes compétences techniques.',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg'
  },
  {
    id: 'N003',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@hospital.com',
    phone: '0123456787',
    role: 'nurse',
    specialties: ['Pédiatrie'],
    licenseNumber: 'INF34567',
    dateOfBirth: '1990-08-03',
    startDate: '2018-09-01',
    department: 'Pédiatrie',
    status: 'active',
    availableShifts: ['morning', 'afternoon'],
    skills: [
      { name: 'Soins pédiatriques', level: 'advanced', verified: true, verifiedBy: 'Dr. Rousseau', verifiedDate: '2022-02-28' },
      { name: 'Vaccination', level: 'intermediate', verified: true, verifiedBy: 'Dr. Rousseau', verifiedDate: '2022-02-28' }
    ],
    certifications: [
      { name: 'Certificat de Puériculture', issuedBy: 'Institut de Puériculture', issueDate: '2019-11-12' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Marseille', graduationYear: '2016', field: 'Soins infirmiers' }
    ],
    languages: ['Français', 'Italien'],
    emergencyContact: {
      name: 'Michel Bernard',
      relationship: 'Père',
      phone: '0987654323'
    },
    notes: 'Infirmière attentionnée et patiente avec les enfants.',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    id: 'N004',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@hospital.com',
    phone: '0123456786',
    role: 'auxiliary_nurse',
    specialties: ['Gériatrie'],
    licenseNumber: 'AID12345',
    dateOfBirth: '1988-02-14',
    startDate: '2014-11-15',
    department: 'Gériatrie',
    status: 'leave',
    availableShifts: ['morning', 'night'],
    skills: [
      { name: 'Soins de confort', level: 'advanced', verified: true, verifiedBy: 'Dr. Moreau', verifiedDate: '2021-10-15' },
      { name: 'Mobilisation des patients', level: 'advanced', verified: true, verifiedBy: 'Dr. Moreau', verifiedDate: '2021-10-15' }
    ],
    certifications: [
      { name: 'DEAS (Diplôme d\'État d\'Aide-Soignant)', issuedBy: 'Ministère de la Santé', issueDate: '2013-07-01' }
    ],
    education: [
      { degree: 'DEAS', institution: 'IFAS Paris', graduationYear: '2013', field: 'Aide aux soins' }
    ],
    languages: ['Français'],
    emergencyContact: {
      name: 'Émilie Dubois',
      relationship: 'Sœur',
      phone: '0987654324'
    },
    notes: 'Aide-soignant expérimenté en gériatrie, actuellement en congé parental jusqu\'au 15/07/2023.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: 'N005',
    firstName: 'Laura',
    lastName: 'Petit',
    email: 'laura.petit@hospital.com',
    phone: '0123456785',
    role: 'midwife',
    specialties: ['Obstétrique', 'Suivi de grossesse'],
    licenseNumber: 'SF78901',
    dateOfBirth: '1986-05-30',
    startDate: '2016-04-01',
    department: 'Maternité',
    status: 'active',
    availableShifts: ['morning', 'afternoon', 'night'],
    skills: [
      { name: 'Accouchement naturel', level: 'expert', verified: true, verifiedBy: 'Dr. Lambert', verifiedDate: '2022-04-10' },
      { name: 'Suivi prénatal', level: 'advanced', verified: true, verifiedBy: 'Dr. Lambert', verifiedDate: '2022-04-10' }
    ],
    certifications: [
      { name: 'Diplôme d\'État de Sage-Femme', issuedBy: 'Université de Médecine', issueDate: '2012-06-30' }
    ],
    education: [
      { degree: 'Diplôme d\'État de Sage-Femme', institution: 'Université de Médecine de Lyon', graduationYear: '2012', field: 'Obstétrique' }
    ],
    languages: ['Français', 'Anglais', 'Allemand'],
    emergencyContact: {
      name: 'David Petit',
      relationship: 'Époux',
      phone: '0987654325'
    },
    notes: 'Sage-femme très appréciée des patientes pour son approche rassurante et professionnelle.',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  }
];

// Données de test pour les plannings
const mockSchedules: Schedule[] = [
  {
    id: 'SCH001',
    nurseId: 'N001',
    nurseName: 'Marie Dupont',
    date: '2023-07-01',
    shift: 'morning',
    department: 'Urgences',
    status: 'scheduled'
  },
  {
    id: 'SCH002',
    nurseId: 'N001',
    nurseName: 'Marie Dupont',
    date: '2023-07-02',
    shift: 'afternoon',
    department: 'Urgences',
    status: 'scheduled'
  },
  {
    id: 'SCH003',
    nurseId: 'N002',
    nurseName: 'Jean Martin',
    date: '2023-07-01',
    shift: 'morning',
    department: 'Chirurgie',
    status: 'scheduled'
  },
  {
    id: 'SCH004',
    nurseId: 'N002',
    nurseName: 'Jean Martin',
    date: '2023-07-03',
    shift: 'afternoon',
    department: 'Chirurgie',
    status: 'scheduled'
  },
  {
    id: 'SCH005',
    nurseId: 'N003',
    nurseName: 'Sophie Bernard',
    date: '2023-07-01',
    shift: 'morning',
    department: 'Pédiatrie',
    status: 'scheduled'
  },
  {
    id: 'SCH006',
    nurseId: 'N003',
    nurseName: 'Sophie Bernard',
    date: '2023-07-02',
    shift: 'morning',
    department: 'Pédiatrie',
    status: 'scheduled'
  },
  {
    id: 'SCH007',
    nurseId: 'N005',
    nurseName: 'Laura Petit',
    date: '2023-07-01',
    shift: 'night',
    department: 'Maternité',
    status: 'scheduled'
  },
  {
    id: 'SCH008',
    nurseId: 'N005',
    nurseName: 'Laura Petit',
    date: '2023-07-02',
    shift: 'morning',
    department: 'Maternité',
    status: 'scheduled'
  }
];

// Données pour les départements
const departments = [
  { id: 'DEP001', name: 'Urgences' },
  { id: 'DEP002', name: 'Chirurgie' },
  { id: 'DEP003', name: 'Médecine interne' },
  { id: 'DEP004', name: 'Pédiatrie' },
  { id: 'DEP005', name: 'Gériatrie' },
  { id: 'DEP006', name: 'Maternité' },
  { id: 'DEP007', name: 'Cardiologie' },
  { id: 'DEP008', name: 'Neurologie' },
  { id: 'DEP009', name: 'Psychiatrie' },
  { id: 'DEP010', name: 'Soins intensifs' }
];

const NursesPage: React.FC = () => {
  // États pour les données
  const [nurses, setNurses] = useState<Nurse[]>(mockNurses);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  
  // États pour l'UI
  const [activeTab, setActiveTab] = useState('nurses');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [isAddingNurse, setIsAddingNurse] = useState(false);
  const [isEditingNurse, setIsEditingNurse] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // État pour le formulaire de nouveau personnel
  const [newNurse, setNewNurse] = useState<Partial<Nurse>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'nurse',
    specialties: [],
    licenseNumber: '',
    dateOfBirth: '',
    startDate: new Date().toISOString().split('T')[0],
    department: '',
    status: 'active',
    availableShifts: ['morning'],
    skills: [],
    certifications: [],
    education: [],
    languages: ['Français'],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  
  // État pour le formulaire de planning
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    nurseId: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    department: '',
    status: 'scheduled'
  });
  
  // État pour les compétences temporaires lors de l'édition
  const [tempSkill, setTempSkill] = useState({
    name: '',
    level: 'intermediate' as const,
    verified: false
  });
  
  // État pour les certifications temporaires lors de l'édition
  const [tempCertification, setTempCertification] = useState({
    name: '',
    issuedBy: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });
  
  // État pour l'éducation temporaire lors de l'édition
  const [tempEducation, setTempEducation] = useState({
    degree: '',
    institution: '',
    graduationYear: '',
    field: ''
  });
  
  // Hooks
  const nursesCollection = useFirestore(COLLECTIONS.HEALTH);
  const { toast } = useToast();
  
  // Filtrage du personnel
  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = 
      `${nurse.firstName} ${nurse.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter ? nurse.department === departmentFilter : true;
    const matchesRole = roleFilter ? nurse.role === roleFilter : true;
    const matchesStatus = statusFilter ? nurse.status === statusFilter : true;
    const matchesSpecialty = specialtyFilter 
      ? nurse.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase())) 
      : true;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus && matchesSpecialty;
  });
  
  // Filtrage des plannings
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.nurseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter ? schedule.department === departmentFilter : true;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Fonction pour créer un nouveau membre du personnel
  const handleCreateNurse = () => {
    if (!newNurse.firstName || !newNurse.lastName || !newNurse.email || !newNurse.role || !newNurse.department) {
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
      const nurseId = `N${String(nurses.length + 1).padStart(3, '0')}`;
      
      const createdNurse: Nurse = {
        id: nurseId,
        firstName: newNurse.firstName!,
        lastName: newNurse.lastName!,
        email: newNurse.email!,
        phone: newNurse.phone || '',
        role: newNurse.role as Nurse['role'],
        specialties: newNurse.specialties || [],
        licenseNumber: newNurse.licenseNumber || '',
        dateOfBirth: newNurse.dateOfBirth || new Date().toISOString().split('T')[0],
        startDate: newNurse.startDate || new Date().toISOString().split('T')[0],
        department: newNurse.department!,
        status: newNurse.status as Nurse['status'],
        availableShifts: newNurse.availableShifts as ('morning' | 'afternoon' | 'night')[],
        skills: newNurse.skills || [],
        certifications: newNurse.certifications || [],
        education: newNurse.education || [],
        languages: newNurse.languages || ['Français'],
        emergencyContact: newNurse.emergencyContact || {
          name: '',
          relationship: '',
          phone: ''
        },
        notes: newNurse.notes
      };

      setNurses([...nurses, createdNurse]);
      setIsAddingNurse(false);
      setNewNurse({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'nurse',
        specialties: [],
        licenseNumber: '',
        dateOfBirth: '',
        startDate: new Date().toISOString().split('T')[0],
        department: '',
        status: 'active',
        availableShifts: ['morning'],
        skills: [],
        certifications: [],
        education: [],
        languages: ['Français'],
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        }
      });

      toast({
        title: "Personnel ajouté",
        description: `${createdNurse.firstName} ${createdNurse.lastName} a été ajouté avec succès.`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour mettre à jour un membre du personnel
  const handleUpdateNurse = () => {
    if (!selectedNurse) return;
    
    setIsSaving(true);

    // Simuler un délai pour l'API
    setTimeout(() => {
      setNurses(nurses.map(nurse => 
        nurse.id === selectedNurse.id ? selectedNurse : nurse
      ));
      
      setIsEditingNurse(false);

      toast({
        title: "Personnel mis à jour",
        description: `Les informations de ${selectedNurse.firstName} ${selectedNurse.lastName} ont été mises à jour avec succès.`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour créer un nouveau planning
  const handleCreateSchedule = () => {
    if (!newSchedule.nurseId || !newSchedule.date || !newSchedule.shift || !newSchedule.department) {
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
      const scheduleId = `SCH${String(schedules.length + 1).padStart(3, '0')}`;
      const nurse = nurses.find(n => n.id === newSchedule.nurseId);
      
      if (!nurse) {
        toast({
          title: "Erreur",
          description: "Membre du personnel non trouvé.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      const nurseName = `${nurse.firstName} ${nurse.lastName}`;
      
      const createdSchedule: Schedule = {
        id: scheduleId,
        nurseId: newSchedule.nurseId!,
        nurseName: nurseName,
        date: newSchedule.date!,
        shift: newSchedule.shift as Schedule['shift'],
        department: newSchedule.department!,
        status: newSchedule.status as Schedule['status'],
        notes: newSchedule.notes
      };

      setSchedules([...schedules, createdSchedule]);
      setIsAddingSchedule(false);
      setNewSchedule({
        nurseId: '',
        date: new Date().toISOString().split('T')[0],
        shift: 'morning',
        department: '',
        status: 'scheduled'
      });

      toast({
        title: "Planning créé",
        description: `Le planning a été créé avec succès pour ${nurseName}.`
      });

      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour mettre à jour le statut d'un planning
  const handleUpdateScheduleStatus = (scheduleId: string, newStatus: Schedule['status']) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: newStatus } 
        : schedule
    ));

    toast({
      title: "Statut mis à jour",
      description: `Le statut du planning a été modifié avec succès.`
    });
  };
  
  // Fonction pour ajouter une compétence
  const handleAddSkill = () => {
    if (!tempSkill.name) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez entrer un nom de compétence.",
        variant: "destructive"
      });
      return;
    }
    
    const newSkill: Skill = {
      name: tempSkill.name,
      level: tempSkill.level,
      verified: tempSkill.verified,
      verifiedBy: tempSkill.verified ? 'Dr. Admin' : undefined,
      verifiedDate: tempSkill.verified ? new Date().toISOString().split('T')[0] : undefined
    };
    
    if (isEditingNurse && selectedNurse) {
      setSelectedNurse({
        ...selectedNurse,
        skills: [...(selectedNurse.skills || []), newSkill]
      });
    } else {
      setNewNurse({
        ...newNurse,
        skills: [...(newNurse.skills || []), newSkill]
      });
    }
    
    setTempSkill({
      name: '',
      level: 'intermediate',
      verified: false
    });
    
    toast({
      title: "Compétence ajoutée",
      description: "La compétence a été ajoutée avec succès."
    });
  };
  
  // Fonction pour supprimer une compétence
  const handleRemoveSkill = (index: number) => {
    if (isEditingNurse && selectedNurse) {
      const updatedSkills = [...selectedNurse.skills];
      updatedSkills.splice(index, 1);
      setSelectedNurse({
        ...selectedNurse,
        skills: updatedSkills
      });
    } else {
      const updatedSkills = [...(newNurse.skills || [])];
      updatedSkills.splice(index, 1);
      setNewNurse({
        ...newNurse,
        skills: updatedSkills
      });
    }
    
    toast({
      title: "Compétence supprimée",
      description: "La compétence a été supprimée avec succès."
    });
  };
  
  // Fonction pour ajouter une certification
  const handleAddCertification = () => {
    if (!tempCertification.name || !tempCertification.issuedBy) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newCertification: Certification = {
      name: tempCertification.name,
      issuedBy: tempCertification.issuedBy,
      issueDate: tempCertification.issueDate,
      expiryDate: tempCertification.expiryDate || undefined
    };
    
    if (isEditingNurse && selectedNurse) {
      setSelectedNurse({
        ...selectedNurse,
        certifications: [...(selectedNurse.certifications || []), newCertification]
      });
    } else {
      setNewNurse({
        ...newNurse,
        certifications: [...(newNurse.certifications || []), newCertification]
      });
    }
    
    setTempCertification({
      name: '',
      issuedBy: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: ''
    });
    
    toast({
      title: "Certification ajoutée",
      description: "La certification a été ajoutée avec succès."
    });
  };
  
  // Fonction pour supprimer une certification
  const handleRemoveCertification = (index: number) => {
    if (isEditingNurse && selectedNurse) {
      const updatedCertifications = [...selectedNurse.certifications];
      updatedCertifications.splice(index, 1);
      setSelectedNurse({
        ...selectedNurse,
        certifications: updatedCertifications
      });
    } else {
      const updatedCertifications = [...(newNurse.certifications || [])];
      updatedCertifications.splice(index, 1);
      setNewNurse({
        ...newNurse,
        certifications: updatedCertifications
      });
    }
    
    toast({
      title: "Certification supprimée",
      description: "La certification a été supprimée avec succès."
    });
  };
  
  // Fonction pour ajouter une formation
  const handleAddEducation = () => {
    if (!tempEducation.degree || !tempEducation.institution || !tempEducation.graduationYear) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newEducation: Education = {
      degree: tempEducation.degree,
      institution: tempEducation.institution,
      graduationYear: tempEducation.graduationYear,
      field: tempEducation.field
    };
    
    if (isEditingNurse && selectedNurse) {
      setSelectedNurse({
        ...selectedNurse,
        education: [...(selectedNurse.education || []), newEducation]
      });
    } else {
      setNewNurse({
        ...newNurse,
        education: [...(newNurse.education || []), newEducation]
      });
    }
    
    setTempEducation({
      degree: '',
      institution: '',
      graduationYear: '',
      field: ''
    });
    
    toast({
      title: "Formation ajoutée",
      description: "La formation a été ajoutée avec succès."
    });
  };
  
  // Fonction pour supprimer une formation
  const handleRemoveEducation = (index: number) => {
    if (isEditingNurse && selectedNurse) {
      const updatedEducation = [...selectedNurse.education];
      updatedEducation.splice(index, 1);
      setSelectedNurse({
        ...selectedNurse,
        education: updatedEducation
      });
    } else {
      const updatedEducation = [...(newNurse.education || [])];
      updatedEducation.splice(index, 1);
      setNewNurse({
        ...newNurse,
        education: updatedEducation
      });
    }
    
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès."
    });
  };
  
  // Fonction pour mettre à jour les quarts de travail disponibles
  const toggleShift = (shift: 'morning' | 'afternoon' | 'night') => {
    if (isEditingNurse && selectedNurse) {
      const currentShifts = [...selectedNurse.availableShifts];
      const isSelected = currentShifts.includes(shift);
      
      if (isSelected) {
        setSelectedNurse({
          ...selectedNurse,
          availableShifts: currentShifts.filter(s => s !== shift)
        });
      } else {
        setSelectedNurse({
          ...selectedNurse,
          availableShifts: [...currentShifts, shift]
        });
      }
    } else {
      const currentShifts = newNurse.availableShifts || [];
      const isSelected = currentShifts.includes(shift);
      
      if (isSelected) {
        setNewNurse({
          ...newNurse,
          availableShifts: currentShifts.filter(s => s !== shift)
        });
      } else {
        setNewNurse({
          ...newNurse,
          availableShifts: [...currentShifts, shift]
        });
      }
    }
  };
  
  // Fonction pour mettre à jour les langues
  const toggleLanguage = (language: string) => {
    if (isEditingNurse && selectedNurse) {
      const currentLanguages = [...selectedNurse.languages];
      const isSelected = currentLanguages.includes(language);
      
      if (isSelected) {
        setSelectedNurse({
          ...selectedNurse,
          languages: currentLanguages.filter(l => l !== language)
        });
      } else {
        setSelectedNurse({
          ...selectedNurse,
          languages: [...currentLanguages, language]
        });
      }
    } else {
      const currentLanguages = newNurse.languages || [];
      const isSelected = currentLanguages.includes(language);
      
      if (isSelected) {
        setNewNurse({
          ...newNurse,
          languages: currentLanguages.filter(l => l !== language)
        });
      } else {
        setNewNurse({
          ...newNurse,
          languages: [...currentLanguages, language]
        });
      }
    }
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Fonction pour formater le rôle
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'nurse': return 'Infirmier/ère';
      case 'auxiliary_nurse': return 'Aide-soignant(e)';
      case 'nursing_assistant': return 'Auxiliaire de puériculture';
      case 'midwife': return 'Sage-femme';
      case 'specialist_nurse': return 'Infirmier/ère spécialisé(e)';
      default: return role;
    }
  };
  
  // Fonction pour formater le statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'leave': return 'En congé';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };
  
  // Fonction pour formater le niveau de compétence
  const getSkillLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return level;
    }
  };
  
  // Fonction pour formater le quart de travail
  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'morning': return 'Matin (6h-14h)';
      case 'afternoon': return 'Après-midi (14h-22h)';
      case 'night': return 'Nuit (22h-6h)';
      default: return shift;
    }
  };
  
  // Fonction pour formater le statut du planning
  const getScheduleStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Prévu';
      case 'completed': return 'Effectué';
      case 'absent': return 'Absent';
      case 'modified': return 'Modifié';
      default: return status;
    }
  };
  
  // Couleurs des badges de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Couleurs des badges de rôle
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'nurse': return 'bg-blue-100 text-blue-800';
      case 'auxiliary_nurse': return 'bg-purple-100 text-purple-800';
      case 'nursing_assistant': return 'bg-indigo-100 text-indigo-800';
      case 'midwife': return 'bg-pink-100 text-pink-800';
      case 'specialist_nurse': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Couleurs des badges de quart de travail
  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Couleurs des badges de statut de planning
  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'modified': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <UserCog className="h-6 w-6 text-blue-500" />
        Gestion du Personnel Soignant
      </h2>

      <Tabs defaultValue="nurses" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="nurses" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Plannings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nurses" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {departmentFilter || "Tous les services"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les services</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={roleFilter || ""} onValueChange={(value) => setRoleFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <span className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    {roleFilter ? getRoleLabel(roleFilter) : "Tous les rôles"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les rôles</SelectItem>
                  <SelectItem value="nurse">Infirmier/ère</SelectItem>
                  <SelectItem value="auxiliary_nurse">Aide-soignant(e)</SelectItem>
                  <SelectItem value="nursing_assistant">Auxiliaire de puériculture</SelectItem>
                  <SelectItem value="midwife">Sage-femme</SelectItem>
                  <SelectItem value="specialist_nurse">Infirmier/ère spécialisé(e)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                <SelectTrigger className="w-[150px]">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter ? getStatusLabel(statusFilter) : "Tous les statuts"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="leave">En congé</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setIsAddingNurse(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un membre
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Spécialités</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNurses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun personnel trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNurses.map((nurse) => (
                      <TableRow key={nurse.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {nurse.avatar ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={nurse.avatar} alt={`${nurse.firstName} ${nurse.lastName}`} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{nurse.firstName} {nurse.lastName}</div>
                              <div className="text-sm text-muted-foreground">{nurse.licenseNumber}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{nurse.department}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(nurse.role)}>
                            {getRoleLabel(nurse.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{nurse.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{nurse.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {nurse.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {nurse.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{nurse.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(nurse.status)}>
                            {getStatusLabel(nurse.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedNurse(nurse);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Détails
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedNurse(nurse);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedNurse(nurse);
                                    setIsEditingNurse(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    const updatedNurse = { ...nurse, status: nurse.status === 'active' ? 'leave' : 'active' };
                                    setNurses(nurses.map(n => n.id === nurse.id ? updatedNurse : n));
                                    toast({
                                      title: "Statut mis à jour",
                                      description: `Le statut de ${nurse.firstName} ${nurse.lastName} a été modifié en "${getStatusLabel(updatedNurse.status)}".`
                                    });
                                  }}
                                >
                                  {nurse.status === 'active' ? (
                                    <>
                                      <Calendar className="mr-2 h-4 w-4" />
                                      Mettre en congé
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Activer
                                    </>
                                  )}
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

        <TabsContent value="schedules" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {departmentFilter || "Tous les services"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les services</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setIsAddingSchedule(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un planning
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quart</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun planning trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.nurseName}</TableCell>
                        <TableCell>{formatDate(schedule.date)}</TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(schedule.shift)}>
                            {getShiftLabel(schedule.shift)}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.department}</TableCell>
                        <TableCell>
                          <Badge className={getScheduleStatusColor(schedule.status)}>
                            {getScheduleStatusLabel(schedule.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {schedule.notes || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUpdateScheduleStatus(schedule.id, 'completed')}
                                  disabled={schedule.status === 'completed' || schedule.status === 'absent'}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Marquer comme effectué
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateScheduleStatus(schedule.id, 'absent')}
                                  disabled={schedule.status === 'completed' || schedule.status === 'absent'}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Marquer comme absent
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateScheduleStatus(schedule.id, 'modified')}
                                  disabled={schedule.status === 'completed' || schedule.status === 'absent'}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier le planning
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
      </Tabs>
      
      {/* Modal for nurse details */}
      <Dialog open={!!selectedNurse && !isEditingNurse} onOpenChange={(open) => {
        if (!open) setSelectedNurse(null);
      }}>
        <DialogContent className="max-w-3xl">
          {selectedNurse && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-blue-500" />
                  {selectedNurse.firstName} {selectedNurse.lastName}
                </DialogTitle>
                <DialogDescription>
                  {getRoleLabel(selectedNurse.role)} - {selectedNurse.department}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden">
                      {selectedNurse.avatar ? (
                        <img 
                          src={selectedNurse.avatar} 
                          alt={`${selectedNurse.firstName} ${selectedNurse.lastName}`}
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <User className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge className={getStatusColor(selectedNurse.status)}>
                        {getStatusLabel(selectedNurse.status)}
                      </Badge>
                      
                      <h3 className="text-sm font-medium flex items-center gap-1 mt-4">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </h3>
                      <p className="text-sm">{selectedNurse.email}</p>
                      
                      <h3 className="text-sm font-medium flex items-center gap-1 mt-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Téléphone
                      </h3>
                      <p className="text-sm">{selectedNurse.phone}</p>
                      
                      <h3 className="text-sm font-medium flex items-center gap-1 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Date de naissance
                      </h3>
                      <p className="text-sm">{formatDate(selectedNurse.dateOfBirth)}</p>
                      
                      <h3 className="text-sm font-medium flex items-center gap-1 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Date d'entrée
                      </h3>
                      <p className="text-sm">{formatDate(selectedNurse.startDate)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Contact d'urgence
                      </h3>
                      <p className="text-sm font-medium">{selectedNurse.emergencyContact.name}</p>
                      <p className="text-sm">{selectedNurse.emergencyContact.relationship}</p>
                      <p className="text-sm">{selectedNurse.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      Spécialités
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNurse.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                      {selectedNurse.specialties.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune spécialité enregistrée</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Disponibilité
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['morning', 'afternoon', 'night'].map((shift) => (
                        <Badge 
                          key={shift} 
                          variant={selectedNurse.availableShifts.includes(shift as any) ? 'default' : 'outline'}
                          className={selectedNurse.availableShifts.includes(shift as any) ? getShiftColor(shift) : ''}
                        >
                          {getShiftLabel(shift)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-500" />
                      Compétences
                    </h3>
                    <div className="space-y-2">
                      {selectedNurse.skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-muted-foreground">{getSkillLevelLabel(skill.level)}</p>
                          </div>
                          <div>
                            {skill.verified ? (
                              <Badge className="bg-green-100 text-green-800">Vérifiée</Badge>
                            ) : (
                              <Badge variant="outline">Non vérifiée</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {selectedNurse.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune compétence enregistrée</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-blue-500" />
                      Certifications
                    </h3>
                    <div className="space-y-2">
                      {selectedNurse.certifications.map((cert, index) => (
                        <div key={index} className="p-2 border rounded-md">
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm">Délivré par: {cert.issuedBy}</p>
                          <div className="flex gap-4 mt-1 text-sm">
                            <p>Date: {formatDate(cert.issueDate)}</p>
                            {cert.expiryDate && <p>Expiration: {formatDate(cert.expiryDate)}</p>}
                          </div>
                        </div>
                      ))}
                      {selectedNurse.certifications.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune certification enregistrée</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      Formation
                    </h3>
                    <div className="space-y-2">
                      {selectedNurse.education.map((edu, index) => (
                        <div key={index} className="p-2 border rounded-md">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm">{edu.institution}</p>
                          <p className="text-sm">
                            Promotion {edu.graduationYear}
                            {edu.field && ` - ${edu.field}`}
                          </p>
                        </div>
                      ))}
                      {selectedNurse.education.length === 0 && (
                        <p className="text-sm text-muted-foreground">Aucune formation enregistrée</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Languages className="h-5 w-5 text-blue-500" />
                      Langues
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNurse.languages.map((language, index) => (
                        <Badge key={index} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedNurse.notes && (
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Notes
                      </h3>
                      <p className="text-sm whitespace-pre-line">{selectedNurse.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedNurse(null)}>
                  Fermer
                </Button>
                <Button onClick={() => setIsEditingNurse(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding/editing nurse */}
      {/* ... keep existing code (Dialog for adding/editing nurse) */}
      
      {/* Dialog for adding schedule */}
      {/* ... keep existing code (Dialog for adding schedule) */}
    </div>
  );
};

export default NursesPage;
