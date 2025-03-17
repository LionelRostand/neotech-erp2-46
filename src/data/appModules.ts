
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Briefcase,
  BookOpen,
  Settings,
  FileText,
  Calendar,
  Clock,
  BarChart,
  Mail,
  Search,
  AlertTriangle,
  Container,
  Ship,
  MapPin,
  DollarSign,
  ClipboardCheck,
  User,
  CheckSquare,
  List,
  UsersRound,
  PieChart,
  Graduation,
  LibraryBig,
  GraduationCap,
  ScrollText,
  Award
} from 'lucide-react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  submodules?: SubModule[];
}

export interface SubModule {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Create icon elements as functions to avoid JSX syntax in .ts file
const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });

// Modules array with the requested modules
export const modules: AppModule[] = [
  {
    id: 1,
    name: "Employés",
    description: "Gestion des ressources humaines, contrats, congés et administration du personnel",
    href: "/modules/employees",
    icon: createIcon(Users),
    submodules: [
      { id: "employees-dashboard", name: "Tableau de bord", href: "/modules/employees/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "employees-management", name: "Gestion", href: "/modules/employees/management", icon: createIcon(Users) },
      { id: "employees-contracts", name: "Contrats", href: "/modules/employees/contracts", icon: createIcon(FileText) },
      { id: "employees-leaves", name: "Congés", href: "/modules/employees/leaves", icon: createIcon(Calendar) },
      { id: "employees-attendance", name: "Présences", href: "/modules/employees/attendance", icon: createIcon(Clock) },
      { id: "employees-timesheet", name: "CRA", href: "/modules/employees/timesheet", icon: createIcon(ClipboardCheck) },
      { id: "employees-recruitment", name: "Recrutement", href: "/modules/employees/recruitment", icon: createIcon(User) },
      { id: "employees-performance", name: "Performance", href: "/modules/employees/performance", icon: createIcon(BarChart) },
      { id: "employees-salaries", name: "Salaires", href: "/modules/employees/salaries", icon: createIcon(DollarSign) },
      { id: "employees-reports", name: "Rapports", href: "/modules/employees/reports", icon: createIcon(PieChart) },
      { id: "employees-settings", name: "Paramètres", href: "/modules/employees/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 2,
    name: "Freight Management",
    description: "Gestion logistique, expéditions, suivi des conteneurs et transport de marchandises",
    href: "/modules/freight",
    icon: createIcon(Truck),
    submodules: [
      { id: "freight-dashboard", name: "Tableau de bord", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "freight-shipments", name: "Expéditions", href: "/modules/freight/shipments", icon: createIcon(Ship) },
      { id: "freight-containers", name: "Conteneurs", href: "/modules/freight/containers", icon: createIcon(Container) },
      { id: "freight-carriers", name: "Transporteurs", href: "/modules/freight/carriers", icon: createIcon(Truck) },
      { id: "freight-tracking", name: "Suivi", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
      { id: "freight-pricing", name: "Tarification", href: "/modules/freight/pricing", icon: createIcon(DollarSign) },
      { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
      { id: "freight-client-portal", name: "Portail client", href: "/modules/freight/client-portal", icon: createIcon(Users) },
      { id: "freight-settings", name: "Paramètres", href: "/modules/freight/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 3,
    name: "Projets",
    description: "Gestion de projets, tâches, équipes et coordination des activités",
    href: "/modules/projects",
    icon: createIcon(Briefcase),
    submodules: [
      { id: "projects-list", name: "Projets", href: "/modules/projects/list", icon: createIcon(Briefcase) },
      { id: "projects-tasks", name: "Tâches", href: "/modules/projects/tasks", icon: createIcon(CheckSquare) },
      { id: "projects-teams", name: "Équipes", href: "/modules/projects/teams", icon: createIcon(UsersRound) },
      { id: "projects-reports", name: "Rapports", href: "/modules/projects/reports", icon: createIcon(BarChart) },
      { id: "projects-settings", name: "Paramètres", href: "/modules/projects/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 4,
    name: "Académie",
    description: "Gestion des inscriptions, cours, examens et suivi pédagogique",
    href: "/modules/academy",
    icon: createIcon(BookOpen),
    submodules: [
      { id: "academy-registrations", name: "Inscriptions", href: "/modules/academy/registrations", icon: createIcon(ClipboardCheck) },
      { id: "academy-courses", name: "Cours", href: "/modules/academy/courses", icon: createIcon(LibraryBig) },
      { id: "academy-exams", name: "Examens", href: "/modules/academy/exams", icon: createIcon(ScrollText) },
      { id: "academy-grades", name: "Notes", href: "/modules/academy/grades", icon: createIcon(Award) },
      { id: "academy-reports", name: "Bulletins", href: "/modules/academy/reports", icon: createIcon(FileText) },
      { id: "academy-teachers", name: "Enseignants", href: "/modules/academy/teachers", icon: createIcon(GraduationCap) },
      { id: "academy-settings", name: "Paramètres", href: "/modules/academy/settings", icon: createIcon(Settings) }
    ]
  }
];
