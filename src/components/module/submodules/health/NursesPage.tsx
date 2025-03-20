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

// Données de démonstration
const mockNurses: Nurse[] = [
  {
    id: 'N001',
    firstName: 'Sophie',
    lastName: 'Dupont',
    email: 'sophie.dupont@example.com',
    phone: '06 12 34 56 78',
    role: 'nurse',
    specialties: ['Soins intensifs', 'Cardiologie'],
    licenseNumber: 'INF-12345',
    dateOfBirth: '1985-03-12',
    startDate: '2015-06-01',
    department: 'Cardiologie',
    status: 'active',
    availableShifts: ['morning', 'afternoon'],
    skills: [
      { name: 'Soins intensifs', level: 'expert', verified: true, verifiedBy: 'Dr. Martin', verifiedDate: '2022-05-10' },
      { name: 'ECG', level: 'advanced', verified: true, verifiedBy: 'Dr. Blanc', verifiedDate: '2021-11-22' },
      { name: 'Réanimation', level: 'advanced', verified: true, verifiedBy: 'Dr. Noir', verifiedDate: '2022-03-15' }
    ],
    certifications: [
      { name: 'Soins intensifs avancés', issuedBy: 'Association Française des Infirmiers', issueDate: '2019-04-20', expiryDate: '2024-04-20' },
      { name: 'Gestion des voies respiratoires', issuedBy: 'Centre Hospitalier Universitaire', issueDate: '2020-09-15' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Paris', graduationYear: '2010', field: 'Soins infirmiers' },
      { degree: 'Master en pratiques avancées', institution: 'Université Paris Santé', graduationYear: '2015', field: 'Soins critiques' }
    ],
    languages: ['Français', 'Anglais', 'Espagnol'],
    emergencyContact: {
      name: 'Thomas Dupont',
      relationship: 'Époux',
      phone: '06 98 76 54 32'
    },
    notes: 'Excellente infirmière, très appréciée par les patients. Envisage une formation en anesthésie.',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
  },
  {
    id: 'N002',
    firstName: 'Marc',
    lastName: 'Lefebvre',
    email: 'marc.lefebvre@example.com',
    phone: '06 23 45 67 89',
    role: 'specialist_nurse',
    specialties: ['Pédiatrie', 'Oncologie pédiatrique'],
    licenseNumber: 'INF-23456',
    dateOfBirth: '1982-07-25',
    startDate: '2012-09-15',
    department: 'Pédiatrie',
    status: 'active',
    availableShifts: ['morning', 'afternoon', 'night'],
    skills: [
      { name: 'Soins pédiatriques', level: 'expert', verified: true, verifiedBy: 'Dr. Petit', verifiedDate: '2021-08-12' },
      { name: 'Chimiothérapie', level: 'advanced', verified: true, verifiedBy: 'Dr. Leroy', verifiedDate: '2022-01-30' }
    ],
    certifications: [
      { name: 'Spécialisation en oncologie pédiatrique', issuedBy: 'Institut National du Cancer', issueDate: '2018-05-10' },
      { name: 'Gestion de la douleur chez l\'enfant', issuedBy: 'Association Pédiatrique Française', issueDate: '2017-11-22', expiryDate: '2027-11-22' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Lyon', graduationYear: '2008', field: 'Soins infirmiers' },
      { degree: 'Spécialisation en pédiatrie', institution: 'Université de Lyon', graduationYear: '2012', field: 'Soins pédiatriques' }
    ],
    languages: ['Français', 'Anglais'],
    emergencyContact: {
      name: 'Claire Lefebvre',
      relationship: 'Épouse',
      phone: '06 87 65 43 21'
    },
    notes: 'Très bon avec les enfants, particulièrement efficace dans des situations difficiles.'
  },
  {
    id: 'N003',
    firstName: 'Lucie',
    lastName: 'Moreau',
    email: 'lucie.moreau@example.com',
    phone: '06 34 56 78 90',
    role: 'auxiliary_nurse',
    specialties: ['Gériatrie'],
    licenseNumber: 'AUX-34567',
    dateOfBirth: '1990-11-03',
    startDate: '2018-02-01',
    department: 'Gériatrie',
    status: 'leave',
    availableShifts: ['morning', 'afternoon'],
    skills: [
      { name: 'Soins aux personnes âgées', level: 'advanced', verified: true, verifiedBy: 'Dr. Martin', verifiedDate: '2021-04-18' },
      { name: 'Gestion de la mobilité', level: 'intermediate', verified: true, verifiedBy: 'Dr. Martin', verifiedDate: '2020-10-05' }
    ],
    certifications: [
      { name: 'Certificat d\'auxiliaire de soins en gériatrie', issuedBy: 'Centre de Formation Professionnelle', issueDate: '2018-07-12' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Aide-Soignant', institution: 'Institut de Formation d\'Aides-Soignants Paris', graduationYear: '2016', field: 'Aide aux soins' }
    ],
    languages: ['Français'],
    emergencyContact: {
      name: 'Paul Moreau',
      relationship: 'Père',
      phone: '06 76 54 32 10'
    },
    notes: 'En congé maternité depuis le 15 mai 2023. Retour prévu en novembre 2023.'
  },
  {
    id: 'N004',
    firstName: 'Antoine',
    lastName: 'Bernard',
    email: 'antoine.bernard@example.com',
    phone: '06 45 67 89 01',
    role: 'nurse',
    specialties: ['Urgences', 'Traumatologie'],
    licenseNumber: 'INF-45678',
    dateOfBirth: '1988-02-15',
    startDate: '2014-11-10',
    department: 'Urgences',
    status: 'active',
    availableShifts: ['afternoon', 'night'],
    skills: [
      { name: 'Triage', level: 'expert', verified: true, verifiedBy: 'Dr. Dubois', verifiedDate: '2022-06-30' },
      { name: 'Réanimation', level: 'expert', verified: true, verifiedBy: 'Dr. Dubois', verifiedDate: '2022-06-30' },
      { name: 'Gestion des traumatismes', level: 'advanced', verified: true, verifiedBy: 'Dr. Roux', verifiedDate: '2021-09-15' }
    ],
    certifications: [
      { name: 'Advanced Trauma Care for Nurses', issuedBy: 'Society of Trauma Nurses', issueDate: '2019-11-05', expiryDate: '2024-11-05' },
      { name: 'Advanced Cardiac Life Support', issuedBy: 'American Heart Association', issueDate: '2021-03-20', expiryDate: '2023-03-20' }
    ],
    education: [
      { degree: 'Diplôme d\'État d\'Infirmier', institution: 'IFSI Bordeaux', graduationYear: '2013', field: 'Soins infirmiers' },
      { degree: 'Formation en médecine d\'urgence', institution: 'Centre Hospitalier Universitaire de Bordeaux', graduationYear: '2016', field: 'Médecine d\'urgence' }
    ],
    languages: ['Français', 'Anglais'],
    emergencyContact: {
      name: 'Julie Bernard',
      relationship: 'Sœur',
      phone: '06 65 43 21 09'
    }
  },
  {
    id: 'N005',
    firstName: 'Marie',
    lastName: 'Durand',
    email: 'marie.durand@example.com',
    phone: '06 56 78 90 12',
    role: 'midwife',
    specialties: ['Obstétrique', 'Échographie obstétricale'],
    licenseNumber: 'SF-56789',
    dateOfBirth: '1987-09-28',
    startDate: '2013-04-01',
    department: 'Maternité',
    status: 'active',
    availableShifts: ['morning', 'night'],
    skills: [
      { name: 'Accouchement naturel', level: 'expert', verified: true, verifiedBy: 'Dr. Blanc', verifiedDate: '2021-05-12' },
      { name: 'Échographie obstétricale', level: 'advanced', verified: true, verifiedBy: 'Dr. Blanc', verifiedDate: '2020-11-08' },
      { name: 'Suivi prénatal', level: 'expert', verified: true, verifiedBy: 'Dr. Blanc', verifiedDate: '2021-05-12' }
    ],
    certifications: [
      { name: 'Échographie obstétricale avancée', issuedBy: 'Société Française d\'Échographie', issueDate: '2019-10-15' },
      { name: 'Réanimation néonatale', issuedBy: 'Institut de Périnatalité', issueDate: '2018-03-22', expiryDate: '2023-03-22' }
    ],
    education: [
      { degree: 'Diplôme d\'État de Sage-Femme', institution: 'École de Sages-Femmes Paris', graduationYear: '2012', field: 'Maïeutique' },
      { degree: 'DU Échographie Obstétricale', institution: 'Université Paris Descartes', graduationYear: '2016', field: 'Échographie' }
    ],
    languages: ['Français', 'Anglais', 'Arabe'],
    emergencyContact: {
      name: 'Pierre Durand',
      relationship: 'Époux',
      phone: '06 54 32 10 98'
    },
    notes: 'Sage-femme très compétente, particulièrement appréciée pour son approche bienveillante de l\'accouchement naturel.'
  }
];

// Fonction de filtrage des infirmiers/ères
const filterNurses = (nurses: Nurse[], searchQuery: string, statusFilter: string | null, departmentFilter: string | null, roleFilter: string | null) => {
  return nurses.filter((nurse) => {
    // Filtre de recherche (nom, prénom, email)
    const matchesSearch = 
      nurse.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre de statut
    const matchesStatus = statusFilter ? nurse.status === statusFilter : true;
    
    // Filtre de département
    const matchesDepartment = departmentFilter ? nurse.department === departmentFilter : true;
    
    // Filtre de rôle
    const matchesRole = roleFilter ? nurse.role === roleFilter : true;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
  });
};

// Fonction pour obtenir les départements uniques
const getUniqueDepartments = (nurses: Nurse[]) => {
  const departments = new Set<string>();
  nurses.forEach(nurse => departments.add(nurse.department));
  return Array.from(departments);
};

// Composant principal
const NursesPage: React.FC = () => {
  // États
  const [nurses, setNurses] = useState<Nurse[]>(mockNurses);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [isCreatingNurse, setIsCreatingNurse] = useState(false);
  const [isEditingNurse, setIsEditingNurse] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  
  // Hooks
  const { toast } = useToast();
  const nursesCollection = useFirestore(COLLECTIONS.HEALTH_NURSES);
  
  // Départements uniques pour le filtre
  const departments = getUniqueDepartments(nurses);
  
  // Nurses filtrés
  const filteredNurses = filterNurses(nurses, searchQuery, statusFilter, departmentFilter, roleFilter);
  
  // Fonction de mise à jour du statut d'un infirmier/ère
  const handleUpdateNurseStatus = (nurseId: string, newStatus: 'active' | 'leave' | 'inactive') => {
    setNurses(nurses.map(nurse => 
      nurse.id === nurseId 
        ? { ...nurse, status: newStatus } 
        : nurse
    ));
    
    // Mettre à jour le nurse sélectionné si nécessaire
    if (selectedNurse && selectedNurse.id === nurseId) {
      setSelectedNurse({ ...selectedNurse, status: newStatus });
    }
    
    toast({
      title: "Statut mis à jour",
      description: `Le statut a été modifié avec succès.`
    });
  };

  // Fonction pour formater le rôle
  const formatRole = (role: string) => {
    switch (role) {
      case 'nurse': return 'Infirmier(ère)';
      case 'auxiliary_nurse': return 'Aide-soignant(e)';
      case 'nursing_assistant': return 'Assistant(e) infirmier(ère)';
      case 'midwife': return 'Sage-femme';
      case 'specialist_nurse': return 'Infirmier(ère) spécialisé(e)';
      default: return role;
    }
  };
  
  // Fonction pour formater le statut
  const formatStatus = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'leave': return 'En congé';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };
  
  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour obtenir la couleur du badge de rôle
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
  
  // Fonction pour formater le niveau de compétence
  const formatSkillLevel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      case 'expert': return 'Expert';
      default: return level;
    }
  };
  
  // Fonction pour obtenir la couleur du badge de niveau de compétence
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gray-100 text-gray-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestion du personnel soignant</h2>
        <Button onClick={() => setIsCreatingNurse(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un soignant
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Liste du personnel
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Détails du profil
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un soignant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 md:flex-nowrap">
                  <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || null)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <span className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4" />
                        {statusFilter ? formatStatus(statusFilter) : "Tous les statuts"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="leave">En congé</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={departmentFilter || undefined} onValueChange={(value) => setDepartmentFilter(value || null)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {departmentFilter || "Tous les services"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les services</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={roleFilter || undefined} onValueChange={(value) => setRoleFilter(value || null)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <span className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        {roleFilter ? formatRole(roleFilter) : "Tous les rôles"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="nurse">Infirmier(ère)</SelectItem>
                      <SelectItem value="auxiliary_nurse">Aide-soignant(e)</SelectItem>
                      <SelectItem value="nursing_assistant">Assistant(e) infirmier(ère)</SelectItem>
                      <SelectItem value="midwife">Sage-femme</SelectItem>
                      <SelectItem value="specialist_nurse">Infirmier(ère) spécialisé(e)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Spécialités</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNurses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            Aucun personnel soignant trouvé avec ces critères
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNurses.map((nurse) => (
                          <TableRow key={nurse.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {nurse.avatar ? (
                                  <div className="h-9 w-9 rounded-full overflow-hidden">
                                    <img src={nurse.avatar} alt={`${nurse.firstName} ${nurse.lastName}`} className="h-full w-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-5 w-5" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold">{nurse.lastName} {nurse.firstName}</div>
                                  <div className="text-sm text-muted-foreground">{nurse.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(nurse.role)}>
                                {formatRole(nurse.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>{nurse.department}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {nurse.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="whitespace-nowrap">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(nurse.status)}>
                                {formatStatus(nurse.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedNurse(nurse);
                                    setActiveTab('details');
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  Voir
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedNurse(nurse);
                                      setIsEditingNurse(true);
                                    }}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateNurseStatus(nurse.id, 'active')}
                                      disabled={nurse.status === 'active'}
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                      Marquer comme actif
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateNurseStatus(nurse.id, 'leave')}
                                      disabled={nurse.status === 'leave'}
                                    >
                                      <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                                      Mettre en congé
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateNurseStatus(nurse.id, 'inactive')}
                                      disabled={nurse.status === 'inactive'}
                                    >
                                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                      Désactiver
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          {selectedNurse ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    {selectedNurse.avatar ? (
                      <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                        <img src={selectedNurse.avatar} alt={`${selectedNurse.firstName} ${selectedNurse.lastName}`} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                    <CardTitle className="text-xl">{selectedNurse.lastName} {selectedNurse.firstName}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2 mt-1">
                      <Badge className={getRoleColor(selectedNurse.role)}>
                        {formatRole(selectedNurse.role)}
                      </Badge>
                      <Badge className={getStatusColor(selectedNurse.status)}>
                        {formatStatus(selectedNurse.status)}
                      </Badge>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedNurse.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedNurse.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>Service : {selectedNurse.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>N° Licence : {selectedNurse.licenseNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Date de naissance : {formatDate(selectedNurse.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Début d'activité : {formatDate(selectedNurse.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-2">Disponibilité des gardes</h4>
                    <div className="flex gap-2">
                      {['morning', 'afternoon', 'night'].map((shift) => (
                        <Badge 
                          key={shift} 
                          variant={selectedNurse.availableShifts.includes(shift as any) ? "default" : "outline"}
                          className={selectedNurse.availableShifts.includes(shift as any) ? "" : "text-muted-foreground"}
                        >
                          {shift === 'morning' ? 'Matin' : shift === 'afternoon' ? 'Après-midi' : 'Nuit'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-2">Langues parlées</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNurse.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-2">Contact d'urgence</h4>
                    <div className="text-sm space-y-1">
                      <div>{selectedNurse.emergencyContact.name}</div>
                      <div className="text-muted-foreground">{selectedNurse.emergencyContact.relationship}</div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedNurse.emergencyContact.phone}
                      </div>
                    </div>
                  </div>
                  
                  {selectedNurse.notes && (
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold mb-2">Notes</h4>
                      <div className="text-sm text-muted-foreground">
                        {selectedNurse.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    Retour à la liste
                  </Button>
                  <Button onClick={() => {
                    setIsEditingNurse(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Spécialités
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedNurse.specialties.map((specialty, index) => (
                        <Badge key={index} className="py-1.5">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Compétences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Compétence</TableHead>
                          <TableHead>Niveau</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Vérifié par</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedNurse.skills.map((skill, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{skill.name}</TableCell>
                            <TableCell>
                              <Badge className={getSkillLevelColor(skill.level)}>
                                {formatSkillLevel(skill.level)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {skill.verified ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Vérifié
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="mr-1 h-3 w-3" />
                                  En attente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{skill.verifiedBy || '-'}</TableCell>
                            <TableCell>{skill.verifiedDate ? formatDate(skill.verifiedDate) : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certification</TableHead>
                          <TableHead>Organisme</TableHead>
                          <TableHead>Date d'obtention</TableHead>
                          <TableHead>Date d'expiration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedNurse.certifications.map((cert, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell>{cert.issuedBy}</TableCell>
                            <TableCell>{formatDate(cert.issueDate)}</TableCell>
                            <TableCell>
                              {cert.expiryDate ? formatDate(cert.expiryDate) : 'Non applicable'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Diplôme</TableHead>
                          <TableHead>Établissement</TableHead>
                          <TableHead>Année</TableHead>
                          <TableHead>Domaine</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedNurse.education.map((edu, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{edu.degree}</TableCell>
                            <TableCell>{edu.institution}</TableCell>
                            <TableCell>{edu.graduationYear}</TableCell>
                            <TableCell>{edu.field}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center items-center h-40 flex-col gap-4">
                  <User className="h-16 w-16 text-muted-foreground/30" />
                  <div className="text-xl font-medium text-muted-foreground">
                    Sélectionnez un membre du personnel pour voir ses détails
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    Voir la liste du personnel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isCreatingNurse} onOpenChange={setIsCreatingNurse}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau soignant</DialogTitle>
            <DialogDescription>
              Remplissez les informations requises pour ajouter un nouveau membre du personnel soignant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="text-center text-muted-foreground">
              Fonctionnalité à implémenter
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingNurse(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsCreatingNurse(false)}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingNurse} onOpenChange={setIsEditingNurse}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
            <DialogDescription>
              Modifiez les informations du profil de {selectedNurse ? `${selectedNurse.firstName} ${selectedNurse.lastName}` : 'ce soignant'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="text-center text-muted-foreground">
              Fonctionnalité à implémenter
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingNurse(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsEditingNurse(false)}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NursesPage;

