
import { 
  BookOpen, 
  ClipboardCheck, 
  LibraryBig, 
  ScrollText, 
  Award, 
  FileText, 
  GraduationCap, 
  Settings,
  Users,
  UserPlus,
  User,
  Calendar,
  BadgeCheck
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const academyModule: AppModule = {
  id: 4,
  name: "Académie",
  description: "Gestion des inscriptions, élèves, enseignants, et suivi pédagogique",
  href: "/modules/academy",
  icon: createIcon(BookOpen),
  category: 'digital',
  submodules: [
    { 
      id: "academy-registrations", 
      name: "Inscriptions", 
      href: "/modules/academy/registrations", 
      icon: createIcon(ClipboardCheck),
      description: "Gestion des inscriptions administratives des élèves"
    },
    { 
      id: "academy-students", 
      name: "Élèves", 
      href: "/modules/academy/students", 
      icon: createIcon(Users),
      description: "Gestion des dossiers et informations des élèves"
    },
    { 
      id: "academy-staff", 
      name: "Personnel", 
      href: "/modules/academy/staff", 
      icon: createIcon(User),
      description: "Gestion du personnel enseignant et administratif"
    },
    { 
      id: "academy-courses", 
      name: "Cours", 
      href: "/modules/academy/courses", 
      icon: createIcon(LibraryBig),
      description: "Organisation et planification des cours"
    },
    { 
      id: "academy-exams", 
      name: "Examens", 
      href: "/modules/academy/exams", 
      icon: createIcon(ScrollText),
      description: "Gestion des évaluations et examens"
    },
    { 
      id: "academy-grades", 
      name: "Notes", 
      href: "/modules/academy/grades", 
      icon: createIcon(Award),
      description: "Calcul et gestion des notes des élèves"
    },
    { 
      id: "academy-reports", 
      name: "Bulletins", 
      href: "/modules/academy/reports", 
      icon: createIcon(FileText),
      description: "Génération et gestion des bulletins scolaires"
    },
    { 
      id: "academy-teachers", 
      name: "Enseignants", 
      href: "/modules/academy/teachers", 
      icon: createIcon(GraduationCap),
      description: "Gestion spécifique des enseignants et leurs attributions"
    },
    { 
      id: "academy-attendance", 
      name: "Présence", 
      href: "/modules/academy/attendance", 
      icon: createIcon(Calendar),
      description: "Suivi des présences des élèves et du personnel"
    },
    { 
      id: "academy-governance", 
      name: "Gouvernance", 
      href: "/modules/academy/governance", 
      icon: createIcon(BadgeCheck),
      description: "Organisation de la direction et des conseils"
    },
    { 
      id: "academy-settings", 
      name: "Paramètres", 
      href: "/modules/academy/settings", 
      icon: createIcon(Settings),
      description: "Configuration du module académique"
    }
  ]
};
