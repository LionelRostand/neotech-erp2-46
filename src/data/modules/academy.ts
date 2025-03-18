
import { BookOpen, ClipboardCheck, LibraryBig, ScrollText, Award, FileText, GraduationCap, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const academyModule: AppModule = {
  id: 4,
  name: "Académie",
  description: "Gestion des inscriptions, cours, examens et suivi pédagogique",
  href: "/modules/academy",
  icon: createIcon(BookOpen),
  category: 'digital', // Added the category property
  submodules: [
    { id: "academy-registrations", name: "Inscriptions", href: "/modules/academy/registrations", icon: createIcon(ClipboardCheck) },
    { id: "academy-courses", name: "Cours", href: "/modules/academy/courses", icon: createIcon(LibraryBig) },
    { id: "academy-exams", name: "Examens", href: "/modules/academy/exams", icon: createIcon(ScrollText) },
    { id: "academy-grades", name: "Notes", href: "/modules/academy/grades", icon: createIcon(Award) },
    { id: "academy-reports", name: "Bulletins", href: "/modules/academy/reports", icon: createIcon(FileText) },
    { id: "academy-teachers", name: "Enseignants", href: "/modules/academy/teachers", icon: createIcon(GraduationCap) },
    { id: "academy-settings", name: "Paramètres", href: "/modules/academy/settings", icon: createIcon(Settings) }
  ]
};
