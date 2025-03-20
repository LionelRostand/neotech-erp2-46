
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
import {
  Users,
  Search,
  Plus,
  UserCog,
  Calendar,
  Clock,
  Filter,
  Edit,
  Trash,
  UserPlus,
  BadgeCheck,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  User,
  FileText,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  ChevronDown,
  Award,
  Briefcase,
  CalendarDays,
  Check,
  ClipboardList
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
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Types pour le personnel soignant
interface NursingStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'nurse' | 'nursing_assistant' | 'midwife' | 'physiotherapist' | 'technician';
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  department: string;
  licenseNumber?: string;
  specialties: string[];
  hireDate: string;
  endDate?: string;
  address?: string;
  schedules: Schedule[];
  availability: Availability[];
  skills: Skill[];
  education: Education[];
  notes?: string;
  photo?: string;
}

// Types pour les plannings
interface Schedule {
  id: string;
  staffId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night' | 'on_call';
  startTime: string;
  endTime: string;
  department: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
  notes?: string;
}

// Types pour les disponibilités
interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isAvailable: boolean;
  shifts: ('morning' | 'afternoon' | 'night' | 'on_call')[];
}

// Types pour les compétences/certifications
interface Skill {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  certificationDate?: string;
  expirationDate?: string;
  isVerified: boolean;
}

// Types pour les formations
interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

// Données de démonstration pour le personnel soignant
const mockNursingStaff: NursingStaff[] = [
  {
    id: 'NS001',
    firstName: 'Marie',
    lastName: 'Lambert',
    role: 'nurse',
    email: 'marie.lambert@example.com',
    phone: '0123456789',
    status: 'active',
    department: 'Cardiologie',
    licenseNumber: 'INF-12345',
    specialties: ['Soins intensifs', 'Gériatrie'],
    hireDate: '2019-06-15',
    address: '123 Rue des Soins, 75001 Paris',
    schedules: [
      {
        id: 'SCH001',
        staffId: 'NS001',
        date: '2023-06-15',
        shift: 'morning',
        startTime: '07:00',
        endTime: '15:00',
        department: 'Cardiologie',
        status: 'confirmed'
      },
      {
        id: 'SCH002',
        staffId: 'NS001',
        date: '2023-06-16',
        shift: 'morning',
        startTime: '07:00',
        endTime: '15:00',
        department: 'Cardiologie',
        status: 'confirmed'
      }
    ],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'tuesday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'wednesday', isAvailable: true, shifts: ['morning'] },
      { day: 'thursday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'friday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'saturday', isAvailable: false, shifts: [] },
      { day: 'sunday', isAvailable: false, shifts: [] }
    ],
    skills: [
      {
        id: 'SKILL001',
        name: 'Soins cardiaques',
        level: 'advanced',
        certificationDate: '2020-05-10',
        expirationDate: '2025-05-10',
        isVerified: true
      },
      {
        id: 'SKILL002',
        name: 'Réanimation',
        level: 'expert',
        certificationDate: '2021-03-15',
        expirationDate: '2024-03-15',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'EDU001',
        degree: 'Diplôme d\'État d\'Infirmier',
        institution: 'IFSI Paris',
        year: '2018',
        description: 'Formation générale en soins infirmiers'
      },
      {
        id: 'EDU002',
        degree: 'Spécialisation en soins intensifs',
        institution: 'Université Médicale de Paris',
        year: '2020',
        description: 'Formation spécialisée en soins intensifs et urgences'
      }
    ]
  },
  {
    id: 'NS002',
    firstName: 'Thomas',
    lastName: 'Moreau',
    role: 'nursing_assistant',
    email: 'thomas.moreau@example.com',
    phone: '0234567890',
    status: 'active',
    department: 'Pédiatrie',
    licenseNumber: 'AS-23456',
    specialties: ['Pédiatrie'],
    hireDate: '2020-03-10',
    schedules: [
      {
        id: 'SCH003',
        staffId: 'NS002',
        date: '2023-06-15',
        shift: 'afternoon',
        startTime: '15:00',
        endTime: '23:00',
        department: 'Pédiatrie',
        status: 'confirmed'
      }
    ],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['afternoon', 'night'] },
      { day: 'tuesday', isAvailable: true, shifts: ['afternoon', 'night'] },
      { day: 'wednesday', isAvailable: true, shifts: ['afternoon'] },
      { day: 'thursday', isAvailable: true, shifts: ['afternoon', 'night'] },
      { day: 'friday', isAvailable: true, shifts: ['afternoon', 'night'] },
      { day: 'saturday', isAvailable: false, shifts: [] },
      { day: 'sunday', isAvailable: false, shifts: [] }
    ],
    skills: [
      {
        id: 'SKILL003',
        name: 'Soins pédiatriques',
        level: 'intermediate',
        certificationDate: '2020-06-20',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'EDU003',
        degree: 'Diplôme d\'État d\'Aide-Soignant',
        institution: 'IFAS Paris',
        year: '2019',
        description: 'Formation en assistance aux soins'
      }
    ]
  },
  {
    id: 'NS003',
    firstName: 'Sophie',
    lastName: 'Petit',
    role: 'midwife',
    email: 'sophie.petit@example.com',
    phone: '0345678901',
    status: 'active',
    department: 'Maternité',
    licenseNumber: 'SF-34567',
    specialties: ['Obstétrique', 'Néonatalogie'],
    hireDate: '2017-09-01',
    schedules: [
      {
        id: 'SCH004',
        staffId: 'NS003',
        date: '2023-06-16',
        shift: 'morning',
        startTime: '07:00',
        endTime: '15:00',
        department: 'Maternité',
        status: 'confirmed'
      }
    ],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'tuesday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'wednesday', isAvailable: true, shifts: ['morning'] },
      { day: 'thursday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'friday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'saturday', isAvailable: true, shifts: ['on_call'] },
      { day: 'sunday', isAvailable: true, shifts: ['on_call'] }
    ],
    skills: [
      {
        id: 'SKILL004',
        name: 'Accouchement',
        level: 'expert',
        certificationDate: '2017-09-15',
        isVerified: true
      },
      {
        id: 'SKILL005',
        name: 'Soins aux nouveau-nés',
        level: 'expert',
        certificationDate: '2017-09-15',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'EDU004',
        degree: 'Diplôme d\'État de Sage-Femme',
        institution: 'École de Sages-Femmes Paris',
        year: '2017',
        description: 'Formation complète en obstétrique et soins maternels'
      }
    ]
  },
  {
    id: 'NS004',
    firstName: 'Lucas',
    lastName: 'Bernard',
    role: 'physiotherapist',
    email: 'lucas.bernard@example.com',
    phone: '0456789012',
    status: 'on_leave',
    department: 'Rééducation',
    licenseNumber: 'KIN-45678',
    specialties: ['Rééducation sportive', 'Neurologie'],
    hireDate: '2018-11-20',
    endDate: '2023-08-31',
    schedules: [],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'tuesday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'wednesday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'thursday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'friday', isAvailable: true, shifts: ['morning'] },
      { day: 'saturday', isAvailable: false, shifts: [] },
      { day: 'sunday', isAvailable: false, shifts: [] }
    ],
    skills: [
      {
        id: 'SKILL006',
        name: 'Rééducation neurologique',
        level: 'advanced',
        certificationDate: '2019-05-10',
        isVerified: true
      },
      {
        id: 'SKILL007',
        name: 'Kinésithérapie respiratoire',
        level: 'intermediate',
        certificationDate: '2020-02-15',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'EDU005',
        degree: 'Diplôme d\'État de Masseur-Kinésithérapeute',
        institution: 'IFMK Paris',
        year: '2018',
        description: 'Formation en kinésithérapie et techniques de rééducation'
      }
    ],
    notes: 'En congé sabbatique jusqu\'à fin août 2023.'
  },
  {
    id: 'NS005',
    firstName: 'Julie',
    lastName: 'Martin',
    role: 'technician',
    email: 'julie.martin@example.com',
    phone: '0567890123',
    status: 'active',
    department: 'Radiologie',
    licenseNumber: 'TEC-56789',
    specialties: ['Radiologie', 'Échographie'],
    hireDate: '2021-01-15',
    schedules: [
      {
        id: 'SCH005',
        staffId: 'NS005',
        date: '2023-06-15',
        shift: 'afternoon',
        startTime: '14:00',
        endTime: '22:00',
        department: 'Radiologie',
        status: 'confirmed'
      },
      {
        id: 'SCH006',
        staffId: 'NS005',
        date: '2023-06-17',
        shift: 'morning',
        startTime: '06:00',
        endTime: '14:00',
        department: 'Radiologie',
        status: 'scheduled'
      }
    ],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'tuesday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'wednesday', isAvailable: false, shifts: [] },
      { day: 'thursday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'friday', isAvailable: true, shifts: ['morning', 'afternoon'] },
      { day: 'saturday', isAvailable: true, shifts: ['morning'] },
      { day: 'sunday', isAvailable: false, shifts: [] }
    ],
    skills: [
      {
        id: 'SKILL008',
        name: 'Manipulation équipements radiologiques',
        level: 'advanced',
        certificationDate: '2021-02-10',
        isVerified: true
      },
      {
        id: 'SKILL009',
        name: 'Radioprotection',
        level: 'advanced',
        certificationDate: '2021-02-10',
        expirationDate: '2026-02-10',
        isVerified: true
      }
    ],
    education: [
      {
        id: 'EDU006',
        degree: 'DTS Imagerie Médicale et Radiologie Thérapeutique',
        institution: 'Lycée Technique de Santé Paris',
        year: '2020',
        description: 'Formation technique en radiologie médicale'
      }
    ]
  }
];

// Données de démonstration pour les départements
const departments = [
  'Cardiologie', 'Pédiatrie', 'Maternité', 'Rééducation', 
  'Radiologie', 'Chirurgie', 'Urgences', 'Gériatrie', 
  'Oncologie', 'Neurologie', 'Psychiatrie', 'Soins intensifs'
];

// Données de démonstration pour les compétences
const availableSkills = [
  'Soins cardiaques', 'Réanimation', 'Soins pédiatriques', 'Accouchement',
  'Soins aux nouveau-nés', 'Rééducation neurologique', 'Kinésithérapie respiratoire',
  'Manipulation équipements radiologiques', 'Radioprotection', 'Soins intensifs',
  'Gestion douleur', 'Prélèvements sanguins', 'Administration médicaments',
  'Pose cathéters', 'Soins plaies et pansements', 'Hygiène hospitalière'
];

const NursesPage: React.FC = () => {
  // États pour gérer les données
  const [staff, setStaff] = useState<NursingStaff[]>(mockNursingStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<NursingStaff | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [isSchedulingShift, setIsSchedulingShift] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [scheduleView, setScheduleView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Nouvel état pour le formulaire d'ajout/modification du personnel
  const [staffForm, setStaffForm] = useState<Partial<NursingStaff>>({
    firstName: '',
    lastName: '',
    role: 'nurse',
    email: '',
    phone: '',
    department: '',
    status: 'active',
    specialties: [],
    hireDate: new Date().toISOString().split('T')[0],
    skills: [],
    education: [],
    availability: [
      { day: 'monday', isAvailable: true, shifts: ['morning'] },
      { day: 'tuesday', isAvailable: true, shifts: ['morning'] },
      { day: 'wednesday', isAvailable: true, shifts: ['morning'] },
      { day: 'thursday', isAvailable: true, shifts: ['morning'] },
      { day: 'friday', isAvailable: true, shifts: ['morning'] },
      { day: 'saturday', isAvailable: false, shifts: [] },
      { day: 'sunday', isAvailable: false, shifts: [] }
    ],
    schedules: []
  });
  
  // Nouvel état pour l'ajout de plannings
  const [scheduleForm, setScheduleForm] = useState<Partial<Schedule>>({
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    startTime: '07:00',
    endTime: '15:00',
    department: '',
    status: 'scheduled',
    notes: ''
  });
  
  // État pour l'ajout de compétences
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: '',
    level: 'intermediate',
    certificationDate: new Date().toISOString().split('T')[0],
    isVerified: false
  });
  
  // État pour l'ajout de formations
  const [educationForm, setEducationForm] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    year: new Date().getFullYear().toString(),
    description: ''
  });
  
  // Hooks pour Firestore et toast
  const nursingStaffCollection = useFirestore(COLLECTIONS.HEALTH);
  const { toast } = useToast();
  
  // Filtrer le personnel selon les critères de recherche et filtres
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? member.role === roleFilter : true;
    const matchesDepartment = departmentFilter ? member.department === departmentFilter : true;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });
  
  // Fonction pour ajouter un nouveau membre du personnel
  const handleAddStaff = () => {
    if (!staffForm.firstName || !staffForm.lastName || !staffForm.role || !staffForm.department) {
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
      const newId = `NS${String(staff.length + 1).padStart(3, '0')}`;
      
      const newStaffMember: NursingStaff = {
        id: newId,
        firstName: staffForm.firstName!,
        lastName: staffForm.lastName!,
        role: staffForm.role as NursingStaff['role'],
        email: staffForm.email || '',
        phone: staffForm.phone || '',
        status: staffForm.status as NursingStaff['status'],
        department: staffForm.department!,
        specialties: staffForm.specialties || [],
        hireDate: staffForm.hireDate!,
        endDate: staffForm.endDate,
        licenseNumber: staffForm.licenseNumber,
        address: staffForm.address,
        schedules: [],
        availability: staffForm.availability || [
          { day: 'monday', isAvailable: true, shifts: ['morning'] },
          { day: 'tuesday', isAvailable: true, shifts: ['morning'] },
          { day: 'wednesday', isAvailable: true, shifts: ['morning'] },
          { day: 'thursday', isAvailable: true, shifts: ['morning'] },
          { day: 'friday', isAvailable: true, shifts: ['morning'] },
          { day: 'saturday', isAvailable: false, shifts: [] },
          { day: 'sunday', isAvailable: false, shifts: [] }
        ],
        skills: staffForm.skills || [],
        education: staffForm.education || [],
        notes: staffForm.notes
      };
      
      setStaff([...staff, newStaffMember]);
      resetStaffForm();
      setIsAddingStaff(false);
      
      toast({
        title: "Personnel ajouté",
        description: `${newStaffMember.firstName} ${newStaffMember.lastName} a été ajouté(e) avec succès.`
      });
      
      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour mettre à jour un membre du personnel
  const handleUpdateStaff = () => {
    if (!selectedStaff || !staffForm.firstName || !staffForm.lastName || !staffForm.role || !staffForm.department) {
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
      const updatedStaffMember: NursingStaff = {
        ...selectedStaff,
        firstName: staffForm.firstName!,
        lastName: staffForm.lastName!,
        role: staffForm.role as NursingStaff['role'],
        email: staffForm.email || '',
        phone: staffForm.phone || '',
        status: staffForm.status as NursingStaff['status'],
        department: staffForm.department!,
        specialties: staffForm.specialties || [],
        hireDate: staffForm.hireDate!,
        endDate: staffForm.endDate,
        licenseNumber: staffForm.licenseNumber,
        address: staffForm.address,
        availability: staffForm.availability || selectedStaff.availability,
        skills: staffForm.skills || selectedStaff.skills,
        education: staffForm.education || selectedStaff.education,
        notes: staffForm.notes
      };
      
      setStaff(staff.map(member => 
        member.id === selectedStaff.id ? updatedStaffMember : member
      ));
      
      setSelectedStaff(updatedStaffMember);
      setIsEditingStaff(false);
      
      toast({
        title: "Personnel mis à jour",
        description: `Les informations de ${updatedStaffMember.firstName} ${updatedStaffMember.lastName} ont été mises à jour.`
      });
      
      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour ajouter un planning
  const handleAddSchedule = () => {
    if (!selectedStaff || !scheduleForm.date || !scheduleForm.shift || !scheduleForm.startTime || !scheduleForm.endTime) {
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
      const newScheduleId = `SCH${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      const newSchedule: Schedule = {
        id: newScheduleId,
        staffId: selectedStaff.id,
        date: scheduleForm.date!,
        shift: scheduleForm.shift as Schedule['shift'],
        startTime: scheduleForm.startTime!,
        endTime: scheduleForm.endTime!,
        department: scheduleForm.department || selectedStaff.department,
        status: scheduleForm.status as Schedule['status'],
        notes: scheduleForm.notes
      };
      
      const updatedStaff = {
        ...selectedStaff,
        schedules: [...selectedStaff.schedules, newSchedule]
      };
      
      setStaff(staff.map(member => 
        member.id === selectedStaff.id ? updatedStaff : member
      ));
      
      setSelectedStaff(updatedStaff);
      setIsSchedulingShift(false);
      
      // Réinitialiser le formulaire de planning
      setScheduleForm({
        date: new Date().toISOString().split('T')[0],
        shift: 'morning',
        startTime: '07:00',
        endTime: '15:00',
        department: selectedStaff.department,
        status: 'scheduled',
        notes: ''
      });
      
      toast({
        title: "Planning ajouté",
        description: `Un nouveau service a été planifié pour ${selectedStaff.firstName} ${selectedStaff.lastName}.`
      });
      
      setIsSaving(false);
    }, 600);
  };
  
  // Fonction pour ajouter une compétence
  const handleAddSkill = () => {
    if (!selectedStaff || !skillForm.name || !skillForm.level) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newSkillId = `SKILL${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newSkill: Skill = {
      id: newSkillId,
      name: skillForm.name,
      level: skillForm.level as Skill['level'],
      certificationDate: skillForm.certificationDate,
      expirationDate: skillForm.expirationDate,
      isVerified: skillForm.isVerified || false
    };
    
    const updatedSkills = [...selectedStaff.skills, newSkill];
    const updatedStaff = {
      ...selectedStaff,
      skills: updatedSkills
    };
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ));
    
    setSelectedStaff(updatedStaff);
    
    // Réinitialiser le formulaire de compétence
    setSkillForm({
      name: '',
      level: 'intermediate',
      certificationDate: new Date().toISOString().split('T')[0],
      isVerified: false
    });
    
    toast({
      title: "Compétence ajoutée",
      description: `La compétence ${newSkill.name} a été ajoutée pour ${selectedStaff.firstName} ${selectedStaff.lastName}.`
    });
  };
  
  // Fonction pour ajouter une formation
  const handleAddEducation = () => {
    if (!selectedStaff || !educationForm.degree || !educationForm.institution || !educationForm.year) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newEducationId = `EDU${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newEducation: Education = {
      id: newEducationId,
      degree: educationForm.degree,
      institution: educationForm.institution,
      year: educationForm.year,
      description: educationForm.description
    };
    
    const updatedEducation = [...selectedStaff.education, newEducation];
    const updatedStaff = {
      ...selectedStaff,
      education: updatedEducation
    };
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ));
    
    setSelectedStaff(updatedStaff);
    
    // Réinitialiser le formulaire de formation
    setEducationForm({
      degree: '',
      institution: '',
      year: new Date().getFullYear().toString(),
      description: ''
    });
    
    toast({
      title: "Formation ajoutée",
      description: `La formation ${newEducation.degree} a été ajoutée pour ${selectedStaff.firstName} ${selectedStaff.lastName}.`
    });
  };
  
  // Fonction pour supprimer un membre du personnel
  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter(member => member.id !== staffId));
    
    if (selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff(null);
    }
    
    toast({
      title: "Personnel supprimé",
      description: "Le membre du personnel a été supprimé avec succès."
    });
  };
  
  // Fonction pour supprimer un planning
  const handleDeleteSchedule = (scheduleId: string) => {
    if (!selectedStaff) return;
    
    const updatedSchedules = selectedStaff.schedules.filter(schedule => schedule.id !== scheduleId);
    const updatedStaff = {
      ...selectedStaff,
      schedules: updatedSchedules
    };
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ));
    
    setSelectedStaff(updatedStaff);
    
    toast({
      title: "Planning supprimé",
      description: "Le planning a été supprimé avec succès."
    });
  };
  
  // Fonction pour supprimer une compétence
  const handleDeleteSkill = (skillId: string) => {
    if (!selectedStaff) return;
    
    const updatedSkills = selectedStaff.skills.filter(skill => skill.id !== skillId);
    const updatedStaff = {
      ...selectedStaff,
      skills: updatedSkills
    };
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ));
    
    setSelectedStaff(updatedStaff);
    
    toast({
      title: "Compétence supprimée",
      description: "La compétence a été supprimée avec succès."
    });
  };
  
  // Fonction pour supprimer une formation
  const handleDeleteEducation = (educationId: string) => {
    if (!selectedStaff) return;
    
    const updatedEducation = selectedStaff.education.filter(edu => edu.id !== educationId);
    const updatedStaff = {
      ...selectedStaff,
      education: updatedEducation
    };
    
    setStaff(staff.map(member => 
      member.id === selectedStaff.id ? updatedStaff : member
    ));
    
    setSelectedStaff(updatedStaff);
    
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès."
    });
  };
  
  // Fonction pour réinitialiser le formulaire d'ajout/modification du personnel
  const resetStaffForm = () => {
    setStaffForm({
      firstName: '',
      lastName: '',
      role: 'nurse',
      email: '',
      phone: '',
      department: '',
      status: 'active',
      specialties: [],
      hireDate: new Date().toISOString().split('T')[0],
      skills: [],
      education: [],
      availability: [
        { day: 'monday', isAvailable: true, shifts: ['morning'] },
        { day: 'tuesday', isAvailable: true, shifts: ['morning'] },
        { day: 'wednesday', isAvailable: true, shifts: ['morning'] },
        { day: 'thursday', isAvailable: true, shifts: ['morning'] },
        { day: 'friday', isAvailable: true, shifts: ['morning'] },
        { day: 'saturday', isAvailable: false, shifts: [] },
        { day: 'sunday', isAvailable: false, shifts: [] }
      ],
      schedules: []
    });
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Fonction pour obtenir le libellé du rôle
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'nurse': return 'Infirmier(ère)';
      case 'nursing_assistant': return 'Aide-soignant(e)';
      case 'midwife': return 'Sage-femme';
      case 'physiotherapist': return 'Kinésithérapeute';
      case 'technician': return 'Technicien(ne)';
      default: return role;
    }
  };
  
  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'on_leave': return 'En congé';
      default: return status;
    }
  };
  
  // Fonction pour obtenir le libellé du niveau de compétence
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'basic': return 'Basique';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return level;
    }
  };
  
  // Fonction pour obtenir le libellé du service
  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case 'morning': return 'Matin (07:00-15:00)';
      case 'afternoon': return 'Après-midi (15:00-23:00)';
      case 'night': return 'Nuit (23:00-07:00)';
      case 'on_call': return 'Garde';
      default: return shift;
    }
  };
  
  // Fonction pour obtenir le libellé du jour
  const getDayLabel = (day: string) => {
    switch (day) {
      case 'monday': return 'Lundi';
      case 'tuesday': return 'Mardi';
      case 'wednesday': return 'Mercredi';
      case 'thursday': return 'Jeudi';
      case 'friday': return 'Vendredi';
      case 'saturday': return 'Samedi';
      case 'sunday': return 'Dimanche';
      default: return day;
    }
  };
  
  // Couleurs pour les badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-amber-100 text-amber-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Couleurs pour les niveaux de compétence
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-500" />
        Gestion du Personnel Soignant
      </h2>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Plannings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          {selectedStaff ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedStaff(null)}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Retour à la liste
                </Button>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedStaff.status)}>
                    {getStatusLabel(selectedStaff.status)}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setStaffForm({
                          ...selectedStaff,
                          specialties: [...selectedStaff.specialties],
                          skills: [...selectedStaff.skills],
                          education: [...selectedStaff.education],
                          availability: [...selectedStaff.availability]
                        });
                        setIsEditingStaff(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsSchedulingShift(true)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Ajouter au planning
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteStaff(selectedStaff.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedStaff.firstName} {selectedStaff.lastName}
                    </h2>
                    <p className="text-gray-500">
                      {getRoleLabel(selectedStaff.role)} • {selectedStaff.department}
                    </p>
                  </div>
                </div>
                
                <Tabs 
                  defaultValue={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="schedules">Plannings</TabsTrigger>
                    <TabsTrigger value="skills">Compétences</TabsTrigger>
                    <TabsTrigger value="education">Formation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <p>{selectedStaff.email}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <p>{selectedStaff.phone}</p>
                          </div>
                          {selectedStaff.address && (
                            <div>
                              <div className="text-sm text-muted-foreground">Adresse</div>
                              <p>{selectedStaff.address}</p>
                            </div>
                          )}
                          {selectedStaff.licenseNumber && (
                            <div>
                              <div className="text-sm text-muted-foreground">Numéro de licence</div>
                              <p>{selectedStaff.licenseNumber}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Service</div>
                            <p>{selectedStaff.department}</p>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Date d'embauche</div>
                            <p>{formatDate(selectedStaff.hireDate)}</p>
                          </div>
                          {selectedStaff.endDate && (
                            <div>
                              <div className="text-sm text-muted-foreground">Date de fin</div>
                              <p>{formatDate(selectedStaff.endDate)}</p>
                            </div>
                          )}
                          {selectedStaff.specialties.length > 0 && (
                            <div>
                              <div className="text-sm text-muted-foreground">Spécialités</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedStaff.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="outline">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Disponibilités</h3>
                        <div className="grid grid-cols-7 gap-2">
                          {selectedStaff.availability.map((avail, index) => (
                            <div 
                              key={index} 
                              className={`p-2 border rounded-md text-center ${
                                avail.isAvailable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <p className="font-medium">{getDayLabel(avail.day)}</p>
                              {avail.isAvailable ? (
                                <div className="mt-1 space-y-1">
                                  {avail.shifts.map((shift, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="bg-blue-50 text-blue-800"
                                    >
                                      {shift === 'morning' ? 'Matin' : 
                                       shift === 'afternoon' ? 'AM' : 
                                       shift === 'night' ? 'Nuit' : 'Garde'}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-1">Non disponible</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedStaff.notes && (
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-semibold mb-4">Notes</h3>
                          <div className="p-4 bg-gray-50 rounded-md">
                            <p>{selectedStaff.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="schedules" className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Plannings</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex border rounded-md overflow-hidden">
                          <Button
                            variant={scheduleView === 'list' ? 'default' : 'outline'}
                            className={`rounded-none ${scheduleView === 'list' ? 'bg-blue-600' : ''}`}
                            onClick={() => setScheduleView('list')}
                            size="sm"
                          >
                            <ClipboardList className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={scheduleView === 'calendar' ? 'default' : 'outline'}
                            className={`rounded-none ${scheduleView === 'calendar' ? 'bg-blue-600' : ''}`}
                            onClick={() => setScheduleView('calendar')}
                            size="sm"
                          >
                            <CalendarDays className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={() => setIsSchedulingShift(true)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter un service
                        </Button>
                      </div>
                    </div>
                    
                    {scheduleView === 'list' ? (
                      selectedStaff.schedules.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Horaires</TableHead>
                              <TableHead>Département</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedStaff.schedules
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map((schedule) => (
                                <TableRow key={schedule.id}>
                                  <TableCell>{formatDate(schedule.date)}</TableCell>
                                  <TableCell>{getShiftLabel(schedule.shift)}</TableCell>
                                  <TableCell>{schedule.startTime} - {schedule.endTime}</TableCell>
                                  <TableCell>{schedule.department}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(schedule.status)}>
                                      {getStatusLabel(schedule.status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteSchedule(schedule.id)}
                                    >
                                      <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center p-8 border rounded-md bg-gray-50">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-muted-foreground">Aucun planning enregistré</p>
                          <Button 
                            onClick={() => setIsSchedulingShift(true)} 
                            className="mt-4"
                          >
                            Ajouter le premier service
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="border rounded-md p-4">
                        <div className="text-center mb-4">
                          <p className="text-lg font-semibold">
                            Planning de {selectedStaff.firstName} {selectedStaff.lastName}
                          </p>
                          <p className="text-sm text-gray-500">Vue calendrier à venir</p>
                        </div>
                        
                        {selectedStaff.schedules.length > 0 ? (
                          <div className="space-y-3">
                            {selectedStaff.schedules
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map((schedule) => (
                                <div 
                                  key={schedule.id} 
                                  className={`p-3 rounded-md border ${
                                    schedule.shift === 'morning' ? 'bg-yellow-50 border-yellow-200' :
                                    schedule.shift === 'afternoon' ? 'bg-orange-50 border-orange-200' :
                                    schedule.shift === 'night' ? 'bg-indigo-50 border-indigo-200' :
                                    'bg-purple-50 border-purple-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{formatDate(schedule.date)}</div>
                                      <div className="text-sm">{getShiftLabel(schedule.shift)}</div>
                                      <div className="text-sm text-gray-600">{schedule.startTime} - {schedule.endTime}</div>
                                    </div>
                                    <Badge className={getStatusColor(schedule.status)}>
                                      {getStatusLabel(schedule.status)}
                                    </Badge>
                                  </div>
                                  {schedule.notes && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      <div className="font-medium">Notes:</div>
                                      {schedule.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <p className="text-muted-foreground">Aucun planning enregistré</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="skills" className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Compétences et certifications</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSkillForm({
                              name: '',
                              level: 'intermediate',
                              certificationDate: new Date().toISOString().split('T')[0],
                              isVerified: false
                            });
                          }}
                          className="flex items-center gap-2"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          Ajouter une compétence
                        </Button>
                      </div>
                    </div>
                    
                    {selectedStaff.skills.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedStaff.skills.map((skill) => (
                          <Card key={skill.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <Badge className={getLevelColor(skill.level)}>
                                    {getLevelLabel(skill.level)}
                                  </Badge>
                                  <div className="font-medium">{skill.name}</div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                              
                              {(skill.certificationDate || skill.expirationDate) && (
                                <div className="mt-2 text-sm">
                                  {skill.certificationDate && (
                                    <div>
                                      <span className="text-gray-500">Certification:</span> {formatDate(skill.certificationDate)}
                                    </div>
                                  )}
                                  {skill.expirationDate && (
                                    <div>
                                      <span className="text-gray-500">Expiration:</span> {formatDate(skill.expirationDate)}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="mt-2 flex items-center gap-1">
                                {skill.isVerified ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">Vérifié</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm text-amber-600">Non vérifié</span>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-gray-50">
                        <Award className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-muted-foreground">Aucune compétence enregistrée</p>
                      </div>
                    )}
                    
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Ajouter une compétence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="skillName">Compétence*</Label>
                            <Select
                              value={skillForm.name}
                              onValueChange={(value) => setSkillForm({...skillForm, name: value})}
                            >
                              <SelectTrigger id="skillName">
                                <SelectValue placeholder="Sélectionner une compétence" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSkills.map((skill, index) => (
                                  <SelectItem key={index} value={skill}>{skill}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="skillLevel">Niveau*</Label>
                            <Select
                              value={skillForm.level}
                              onValueChange={(value: Skill['level']) => setSkillForm({...skillForm, level: value})}
                            >
                              <SelectTrigger id="skillLevel">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basique</SelectItem>
                                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                                <SelectItem value="advanced">Avancé</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="certificationDate">Date de certification</Label>
                            <Input
                              id="certificationDate"
                              type="date"
                              value={skillForm.certificationDate}
                              onChange={(e) => setSkillForm({...skillForm, certificationDate: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="expirationDate">Date d'expiration</Label>
                            <Input
                              id="expirationDate"
                              type="date"
                              value={skillForm.expirationDate}
                              onChange={(e) => setSkillForm({...skillForm, expirationDate: e.target.value})}
                            />
                          </div>
                          
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <Checkbox 
                              id="isVerified" 
                              checked={skillForm.isVerified}
                              onCheckedChange={(checked) => setSkillForm({...skillForm, isVerified: !!checked})}
                            />
                            <label
                              htmlFor="isVerified"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Compétence vérifiée
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={handleAddSkill}
                            disabled={!skillForm.name || !skillForm.level}
                          >
                            Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="education" className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Formation et éducation</h3>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEducationForm({
                            degree: '',
                            institution: '',
                            year: new Date().getFullYear().toString(),
                            description: ''
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter une formation
                      </Button>
                    </div>
                    
                    {selectedStaff.education.length > 0 ? (
                      <div className="space-y-4">
                        {selectedStaff.education
                          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                          .map((edu) => (
                            <Card key={edu.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{edu.degree}</div>
                                    <div className="text-sm text-gray-500">
                                      {edu.institution}, {edu.year}
                                    </div>
                                    {edu.description && (
                                      <div className="mt-2 text-sm">{edu.description}</div>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteEducation(edu.id)}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-gray-50">
                        <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-muted-foreground">Aucune formation enregistrée</p>
                      </div>
                    )}
                    
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Ajouter une formation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="degree">Diplôme/Formation*</Label>
                            <Input
                              id="degree"
                              value={educationForm.degree}
                              onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                              placeholder="Ex: Diplôme d'État d'Infirmier"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="institution">Institution*</Label>
                            <Input
                              id="institution"
                              value={educationForm.institution}
                              onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                              placeholder="Ex: IFSI Paris"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="year">Année*</Label>
                            <Input
                              id="year"
                              value={educationForm.year}
                              onChange={(e) => setEducationForm({...educationForm, year: e.target.value})}
                              placeholder="Ex: 2018"
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={educationForm.description}
                              onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                              placeholder="Description de la formation..."
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={handleAddEducation}
                            disabled={!educationForm.degree || !educationForm.institution || !educationForm.year}
                          >
                            Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Modal pour ajouter un service au planning */}
              <Dialog open={isSchedulingShift} onOpenChange={setIsSchedulingShift}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un service</DialogTitle>
                    <DialogDescription>
                      Planifier un service pour {selectedStaff.firstName} {selectedStaff.lastName}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="scheduleDate">Date*</Label>
                        <Input
                          id="scheduleDate"
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduleShift">Service*</Label>
                        <Select
                          value={scheduleForm.shift}
                          onValueChange={(value: Schedule['shift']) => {
                            let startTime, endTime;
                            
                            switch (value) {
                              case 'morning':
                                startTime = '07:00';
                                endTime = '15:00';
                                break;
                              case 'afternoon':
                                startTime = '15:00';
                                endTime = '23:00';
                                break;
                              case 'night':
                                startTime = '23:00';
                                endTime = '07:00';
                                break;
                              case 'on_call':
                                startTime = '08:00';
                                endTime = '20:00';
                                break;
                            }
                            
                            setScheduleForm({
                              ...scheduleForm, 
                              shift: value,
                              startTime,
                              endTime
                            });
                          }}
                        >
                          <SelectTrigger id="scheduleShift">
                            <SelectValue placeholder="Sélectionner un service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Matin (07:00-15:00)</SelectItem>
                            <SelectItem value="afternoon">Après-midi (15:00-23:00)</SelectItem>
                            <SelectItem value="night">Nuit (23:00-07:00)</SelectItem>
                            <SelectItem value="on_call">Garde</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduleStart">Heure de début*</Label>
                        <Input
                          id="scheduleStart"
                          type="time"
                          value={scheduleForm.startTime}
                          onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduleEnd">Heure de fin*</Label>
                        <Input
                          id="scheduleEnd"
                          type="time"
                          value={scheduleForm.endTime}
                          onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="scheduleDepartment">Département</Label>
                        <Select
                          value={scheduleForm.department || selectedStaff.department}
                          onValueChange={(value) => setScheduleForm({...scheduleForm, department: value})}
                        >
                          <SelectTrigger id="scheduleDepartment">
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept, index) => (
                              <SelectItem key={index} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="scheduleNotes">Notes</Label>
                        <Textarea
                          id="scheduleNotes"
                          value={scheduleForm.notes}
                          onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                          placeholder="Informations supplémentaires..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSchedulingShift(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddSchedule} disabled={isSaving}>
                      {isSaving ? 'Enregistrement...' : 'Planifier le service'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Modal pour éditer un membre du personnel */}
              <Dialog open={isEditingStaff} onOpenChange={setIsEditingStaff}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Modifier le personnel</DialogTitle>
                    <DialogDescription>
                      Modifier les informations de {selectedStaff.firstName} {selectedStaff.lastName}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom*</Label>
                        <Input
                          id="firstName"
                          value={staffForm.firstName}
                          onChange={(e) => setStaffForm({...staffForm, firstName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom*</Label>
                        <Input
                          id="lastName"
                          value={staffForm.lastName}
                          onChange={(e) => setStaffForm({...staffForm, lastName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Fonction*</Label>
                        <Select
                          value={staffForm.role}
                          onValueChange={(value: NursingStaff['role']) => setStaffForm({...staffForm, role: value})}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Sélectionner une fonction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nurse">Infirmier(ère)</SelectItem>
                            <SelectItem value="nursing_assistant">Aide-soignant(e)</SelectItem>
                            <SelectItem value="midwife">Sage-femme</SelectItem>
                            <SelectItem value="physiotherapist">Kinésithérapeute</SelectItem>
                            <SelectItem value="technician">Technicien(ne)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Département*</Label>
                        <Select
                          value={staffForm.department}
                          onValueChange={(value) => setStaffForm({...staffForm, department: value})}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept, index) => (
                              <SelectItem key={index} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Numéro de licence</Label>
                        <Input
                          id="licenseNumber"
                          value={staffForm.licenseNumber}
                          onChange={(e) => setStaffForm({...staffForm, licenseNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Statut</Label>
                        <Select
                          value={staffForm.status}
                          onValueChange={(value: NursingStaff['status']) => setStaffForm({...staffForm, status: value})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="on_leave">En congé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Date d'embauche*</Label>
                        <Input
                          id="hireDate"
                          type="date"
                          value={staffForm.hireDate}
                          onChange={(e) => setStaffForm({...staffForm, hireDate: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Date de fin (si applicable)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={staffForm.endDate}
                          onChange={(e) => setStaffForm({...staffForm, endDate: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          value={staffForm.address}
                          onChange={(e) => setStaffForm({...staffForm, address: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                        <Input
                          id="specialties"
                          value={(staffForm.specialties || []).join(', ')}
                          onChange={(e) => setStaffForm({
                            ...staffForm, 
                            specialties: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={staffForm.notes}
                          onChange={(e) => setStaffForm({...staffForm, notes: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditingStaff(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleUpdateStaff} disabled={isSaving}>
                      {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un membre du personnel..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={roleFilter || ""} onValueChange={(value) => setRoleFilter(value || null)}>
                    <SelectTrigger className="w-[180px]">
                      <span className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {roleFilter ? getRoleLabel(roleFilter) : "Toutes les fonctions"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les fonctions</SelectItem>
                      <SelectItem value="nurse">Infirmier(ère)s</SelectItem>
                      <SelectItem value="nursing_assistant">Aide-soignant(e)s</SelectItem>
                      <SelectItem value="midwife">Sages-femmes</SelectItem>
                      <SelectItem value="physiotherapist">Kinésithérapeutes</SelectItem>
                      <SelectItem value="technician">Technicien(ne)s</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
                    <SelectTrigger className="w-[180px]">
                      <span className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {departmentFilter || "Tous les départements"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les départements</SelectItem>
                      {departments.map((dept, index) => (
                        <SelectItem key={index} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => {
                    resetStaffForm();
                    setIsAddingStaff(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter un membre
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Fonction</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Compétences</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Aucun membre du personnel trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-xs text-gray-500">{member.licenseNumber || '-'}</div>
                            </TableCell>
                            <TableCell>{getRoleLabel(member.role)}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-500" />
                                  <span>{member.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-500" />
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {member.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {member.skills.slice(0, 2).map((skill, index) => (
                                    <Badge key={index} className={getLevelColor(skill.level)}>
                                      {skill.name}
                                    </Badge>
                                  ))}
                                  {member.skills.length > 2 && (
                                    <Badge variant="outline">+{member.skills.length - 2}</Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(member.status)}>
                                {getStatusLabel(member.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedStaff(member)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      setStaffForm({
                                        ...member,
                                        specialties: [...member.specialties],
                                        skills: [...member.skills],
                                        education: [...member.education],
                                        availability: [...member.availability]
                                      });
                                      setIsEditingStaff(true);
                                      setSelectedStaff(member);
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedStaff(member);
                                      setScheduleForm({
                                        date: new Date().toISOString().split('T')[0],
                                        shift: 'morning',
                                        startTime: '07:00',
                                        endTime: '15:00',
                                        department: member.department,
                                        status: 'scheduled',
                                        notes: ''
                                      });
                                      setIsSchedulingShift(true);
                                    }}>
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Planifier
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleDeleteStaff(member.id)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Supprimer
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
              
              {/* Modal pour ajouter un membre du personnel */}
              <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un membre du personnel</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour ajouter un nouveau membre
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom*</Label>
                        <Input
                          id="firstName"
                          value={staffForm.firstName}
                          onChange={(e) => setStaffForm({...staffForm, firstName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom*</Label>
                        <Input
                          id="lastName"
                          value={staffForm.lastName}
                          onChange={(e) => setStaffForm({...staffForm, lastName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Fonction*</Label>
                        <Select
                          value={staffForm.role}
                          onValueChange={(value: NursingStaff['role']) => setStaffForm({...staffForm, role: value})}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Sélectionner une fonction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nurse">Infirmier(ère)</SelectItem>
                            <SelectItem value="nursing_assistant">Aide-soignant(e)</SelectItem>
                            <SelectItem value="midwife">Sage-femme</SelectItem>
                            <SelectItem value="physiotherapist">Kinésithérapeute</SelectItem>
                            <SelectItem value="technician">Technicien(ne)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Département*</Label>
                        <Select
                          value={staffForm.department}
                          onValueChange={(value) => setStaffForm({...staffForm, department: value})}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept, index) => (
                              <SelectItem key={index} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Numéro de licence</Label>
                        <Input
                          id="licenseNumber"
                          value={staffForm.licenseNumber}
                          onChange={(e) => setStaffForm({...staffForm, licenseNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Date d'embauche*</Label>
                        <Input
                          id="hireDate"
                          type="date"
                          value={staffForm.hireDate}
                          onChange={(e) => setStaffForm({...staffForm, hireDate: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                        <Input
                          id="specialties"
                          value={(staffForm.specialties || []).join(', ')}
                          onChange={(e) => setStaffForm({
                            ...staffForm, 
                            specialties: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={staffForm.notes}
                          onChange={(e) => setStaffForm({...staffForm, notes: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddStaff} disabled={isSaving}>
                      {isSaving ? 'Enregistrement...' : 'Ajouter le membre'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 items-center">
              <div className="text-lg font-semibold">
                Planning du personnel pour le {formatDate(currentDate)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-auto"
              />
              <Button 
                variant="outline" 
                onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
              >
                Aujourd'hui
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Planning quotidien</CardTitle>
              <CardDescription>
                Personnel assigné aux différents services le {formatDate(currentDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Matin (07:00-15:00)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staff
                      .filter(member => member.schedules.some(
                        schedule => schedule.date === currentDate && schedule.shift === 'morning'
                      ))
                      .map(member => (
                        <div
                          key={member.id}
                          className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedStaff(member)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-sm text-gray-500">{getRoleLabel(member.role)} • {member.department}</div>
                            </div>
                            <Badge className={getStatusColor(member.status)}>
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {staff.filter(member => member.schedules.some(
                      schedule => schedule.date === currentDate && schedule.shift === 'morning'
                    )).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucun personnel assigné
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Après-midi (15:00-23:00)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staff
                      .filter(member => member.schedules.some(
                        schedule => schedule.date === currentDate && schedule.shift === 'afternoon'
                      ))
                      .map(member => (
                        <div
                          key={member.id}
                          className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedStaff(member)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-sm text-gray-500">{getRoleLabel(member.role)} • {member.department}</div>
                            </div>
                            <Badge className={getStatusColor(member.status)}>
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {staff.filter(member => member.schedules.some(
                      schedule => schedule.date === currentDate && schedule.shift === 'afternoon'
                    )).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucun personnel assigné
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Nuit (23:00-07:00)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staff
                      .filter(member => member.schedules.some(
                        schedule => schedule.date === currentDate && schedule.shift === 'night'
                      ))
                      .map(member => (
                        <div
                          key={member.id}
                          className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedStaff(member)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-sm text-gray-500">{getRoleLabel(member.role)} • {member.department}</div>
                            </div>
                            <Badge className={getStatusColor(member.status)}>
                              {getStatusLabel(member.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {staff.filter(member => member.schedules.some(
                      schedule => schedule.date === currentDate && schedule.shift === 'night'
                    )).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucun personnel assigné
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Répartition par service</CardTitle>
              <CardDescription>
                Personnel affecté à chaque service le {formatDate(currentDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Nombre total</TableHead>
                    <TableHead>Infirmiers</TableHead>
                    <TableHead>Aides-soignants</TableHead>
                    <TableHead>Autres</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments
                    .filter(dept => staff.some(member => 
                      member.schedules.some(schedule => 
                        schedule.date === currentDate && schedule.department === dept
                      )
                    ))
                    .map(dept => {
                      const scheduledStaff = staff.filter(member => 
                        member.schedules.some(schedule => 
                          schedule.date === currentDate && schedule.department === dept
                        )
                      );
                      
                      const nurses = scheduledStaff.filter(member => member.role === 'nurse').length;
                      const assistants = scheduledStaff.filter(member => member.role === 'nursing_assistant').length;
                      const others = scheduledStaff.length - nurses - assistants;
                      
                      return (
                        <TableRow key={dept}>
                          <TableCell className="font-medium">{dept}</TableCell>
                          <TableCell>{scheduledStaff.length}</TableCell>
                          <TableCell>{nurses}</TableCell>
                          <TableCell>{assistants}</TableCell>
                          <TableCell>{others}</TableCell>
                        </TableRow>
                      );
                    })}
                  {departments.filter(dept => staff.some(member => 
                    member.schedules.some(schedule => 
                      schedule.date === currentDate && schedule.department === dept
                    )
                  )).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Aucun service programmé pour cette date
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursesPage;
