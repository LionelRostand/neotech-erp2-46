
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Clock, 
  ClipboardCheck, 
  BarChart, 
  DollarSign, 
  PieChart, 
  Settings,
  Building,
  Briefcase,
  GraduationCap,
  Bell,
  SunMedium,
  FileSignature,
  ListTree
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const employeesModule: AppModule = {
  id: 1,
  name: "RESSOURCES HUMAINES",
  description: "Gestion des ressources humaines, contrats, congés et administration du personnel",
  href: "/modules/employees",
  icon: createIcon(Users),
  category: 'business', 
  submodules: [
    { id: "employees-dashboard", name: "Tableau de bord", href: "/modules/employees/dashboard", icon: createIcon(LayoutDashboard) },
    
    // Badges et accès
    { id: "employees-badges", name: "Badges et accès", href: "/modules/employees/badges", icon: createIcon(Users) },
    
    // Hiérarchie
    { id: "employees-hierarchy", name: "Hiérarchie", href: "/modules/employees/hierarchy", icon: createIcon(ListTree) },
    
    // Suivi du temps et présences
    { id: "employees-attendance", name: "Présences", href: "/modules/employees/attendance", icon: createIcon(Clock) },
    { id: "employees-timesheet", name: "Feuilles de temps", href: "/modules/employees/timesheet", icon: createIcon(ClipboardCheck) },
    
    // Gestion des congés 
    { id: "employees-leaves", name: "Congés", href: "/modules/employees/leaves", icon: createIcon(SunMedium) },
    
    // Documents et contrats
    { id: "employees-contracts", name: "Contrats", href: "/modules/employees/contracts", icon: createIcon(FileSignature) },
    { id: "employees-documents", name: "Documents RH", href: "/modules/employees/documents", icon: createIcon(FileText) },
    { id: "employees-departments", name: "Départements", href: "/modules/employees/departments", icon: createIcon(Building) },
    
    // Évaluations et formations
    { id: "employees-evaluations", name: "Évaluations", href: "/modules/employees/evaluations", icon: createIcon(BarChart) },
    { id: "employees-trainings", name: "Formations", href: "/modules/employees/trainings", icon: createIcon(GraduationCap) },
    
    // Intégration avec la paie
    { id: "employees-salaries", name: "Salaires", href: "/modules/employees/salaries", icon: createIcon(DollarSign) },
    
    // Recrutement (conservé du module original)
    { id: "employees-recruitment", name: "Recrutement", href: "/modules/employees/recruitment", icon: createIcon(Briefcase) },
    
    // Entreprises
    { id: "employees-companies", name: "Entreprises", href: "/modules/employees/companies", icon: createIcon(Building) },
    
    // Rapports et analytiques
    { id: "employees-reports", name: "Rapports", href: "/modules/employees/reports", icon: createIcon(PieChart) },
    
    // Alertes et notifications
    { id: "employees-alerts", name: "Alertes", href: "/modules/employees/alerts", icon: createIcon(Bell) },
    
    // Paramètres
    { id: "employees-settings", name: "Paramètres", href: "/modules/employees/settings", icon: createIcon(Settings) }
  ]
};
