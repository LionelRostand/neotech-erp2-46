
import { createIcon, AppModule } from '../types/modules';
import {
  Users,
  BadgeCheck,
  Building2,
  UserCircle2,
  Network,
  ClipboardCheck,
  FileText,
  FileCog,
  Clock,
  CalendarRange,
  GraduationCap,
  DollarSign,
  UserPlus,
  Building,
  BarChart2,
  Bell,
  Settings
} from 'lucide-react';

export const employeesModule: AppModule = {
  id: 1,
  name: "Personnel",
  description: "Gérez les employés, les départements, les contrats et plus encore",
  href: "/modules/employees",
  icon: createIcon(Users),
  category: "business",
  submodules: [
    {
      id: "employees-dashboard",
      name: "Tableau de bord",
      href: "/modules/employees/dashboard",
      icon: createIcon(BarChart2),
      description: "Vue d'ensemble des statistiques RH"
    },
    {
      id: "employees-profiles",
      name: "Fiches Employés",
      href: "/modules/employees/profiles",
      icon: createIcon(UserCircle2),
      description: "Gérer les fiches des employés"
    },
    {
      id: "employees-badges",
      name: "Badges",
      href: "/modules/employees/badges",
      icon: createIcon(BadgeCheck),
      description: "Gérer les badges des employés"
    },
    {
      id: "employees-departments",
      name: "Départements",
      href: "/modules/employees/departments",
      icon: createIcon(Building2),
      description: "Organisation des départements"
    },
    {
      id: "employees-hierarchy",
      name: "Hiérarchie",
      href: "/modules/employees/hierarchy",
      icon: createIcon(Network),
      description: "Visualisation de la structure organisationnelle"
    },
    {
      id: "employees-attendance",
      name: "Présences",
      href: "/modules/employees/attendance",
      icon: createIcon(ClipboardCheck),
      description: "Suivi des présences des employés"
    },
    {
      id: "employees-timesheet",
      name: "Feuilles de temps",
      href: "/modules/employees/timesheet",
      icon: createIcon(Clock),
      description: "Gestion des feuilles de temps"
    },
    {
      id: "employees-leaves",
      name: "Congés",
      href: "/modules/employees/leaves",
      icon: createIcon(CalendarRange),
      description: "Gestion des demandes de congés"
    },
    {
      id: "employees-contracts",
      name: "Contrats",
      href: "/modules/employees/contracts",
      icon: createIcon(FileText),
      description: "Gestion des contrats employés"
    },
    {
      id: "employees-documents",
      name: "Documents",
      href: "/modules/employees/documents",
      icon: createIcon(FileCog),
      description: "Stockage et gestion des documents RH"
    },
    {
      id: "employees-evaluations",
      name: "Évaluations",
      href: "/modules/employees/evaluations",
      icon: createIcon(ClipboardCheck),
      description: "Évaluations des performances"
    },
    {
      id: "employees-trainings",
      name: "Formations",
      href: "/modules/employees/trainings",
      icon: createIcon(GraduationCap),
      description: "Suivi des formations des employés"
    },
    {
      id: "employees-salaries",
      name: "Salaires",
      href: "/modules/employees/salaries",
      icon: createIcon(DollarSign),
      description: "Gestion des salaires et bulletins"
    },
    {
      id: "employees-recruitment",
      name: "Recrutement",
      href: "/modules/employees/recruitment",
      icon: createIcon(UserPlus),
      description: "Gestion du processus de recrutement"
    },
    {
      id: "employees-companies",
      name: "Entreprises",
      href: "/modules/employees/companies",
      icon: createIcon(Building),
      description: "Gestion des entreprises"
    },
    {
      id: "employees-reports",
      name: "Rapports",
      href: "/modules/employees/reports",
      icon: createIcon(BarChart2),
      description: "Rapports et statistiques RH"
    },
    {
      id: "employees-alerts",
      name: "Alertes",
      href: "/modules/employees/alerts",
      icon: createIcon(Bell),
      description: "Gestion des alertes RH"
    },
    {
      id: "employees-settings",
      name: "Paramètres",
      href: "/modules/employees/settings",
      icon: createIcon(Settings),
      description: "Configuration du module RH"
    }
  ]
};
