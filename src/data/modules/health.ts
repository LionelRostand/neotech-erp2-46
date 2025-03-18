
import { 
  Stethoscope, LayoutDashboard, Calendar, Users, Pill, Activity, Settings,
  UserCog, FileText, HeartPulse, Building2, CreditCard, BarChart3, Workflow, User
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const healthModule: AppModule = {
  id: 8,
  name: "Health",
  description: "Gestion des patients, rendez-vous et suivi médical",
  href: "/modules/health",
  icon: createIcon(Stethoscope),
  submodules: [
    { id: "health-dashboard", name: "Dashboard", href: "/modules/health/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "health-patients", name: "Patients", href: "/modules/health/patients", icon: createIcon(User), description: "Gestion des dossiers patients" },
    { id: "health-doctors", name: "Médecins", href: "/modules/health/doctors", icon: createIcon(UserCog), description: "Gestion du personnel médical" },
    { id: "health-appointments", name: "Rendez-vous", href: "/modules/health/appointments", icon: createIcon(Calendar), description: "Planification des consultations" },
    { id: "health-consultations", name: "Consultations", href: "/modules/health/consultations", icon: createIcon(HeartPulse), description: "Enregistrement des diagnostics" },
    { id: "health-medical-records", name: "Dossiers Médicaux", href: "/modules/health/medical-records", icon: createIcon(FileText), description: "Gestion des DME" },
    { id: "health-pharmacy", name: "Pharmacie", href: "/modules/health/pharmacy", icon: createIcon(Pill), description: "Gestion des médicaments" },
    { id: "health-admissions", name: "Hospitalisations", href: "/modules/health/admissions", icon: createIcon(Building2), description: "Gestion des séjours" },
    { id: "health-billing", name: "Facturation", href: "/modules/health/billing", icon: createIcon(CreditCard), description: "Gestion des paiements" },
    { id: "health-stats", name: "Statistiques", href: "/modules/health/stats", icon: createIcon(BarChart3), description: "Rapports et analyses" },
    { id: "health-integrations", name: "Intégrations", href: "/modules/health/integrations", icon: createIcon(Workflow), description: "Connexion avec d'autres modules" },
    { id: "health-settings", name: "Paramètres", href: "/modules/health/settings", icon: createIcon(Settings), description: "Configuration du module" }
  ]
};
