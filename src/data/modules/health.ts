
import { 
  Stethoscope, LayoutDashboard, Calendar, Users, Pill, Activity, Settings,
  UserCog, FileText, HeartPulse, Building2, CreditCard, BarChart3, Workflow, User,
  Clipboard, Syringe, Flask, Bed, BedDouble, BadgePercent, ShieldCheck
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const healthModule: AppModule = {
  id: 8,
  name: "Health",
  description: "Gestion des patients, rendez-vous et suivi médical",
  href: "/modules/health",
  icon: createIcon(Stethoscope),
  submodules: [
    { id: "health-dashboard", name: "Dashboard", href: "/modules/health/dashboard", icon: createIcon(LayoutDashboard), description: "Tableau de bord et KPIs" },
    { id: "health-patients", name: "Patients", href: "/modules/health/patients", icon: createIcon(User), description: "Enregistrement et gestion des dossiers patients" },
    { id: "health-appointments", name: "Rendez-vous", href: "/modules/health/appointments", icon: createIcon(Calendar), description: "Planification et suivi des consultations" },
    { id: "health-doctors", name: "Médecins", href: "/modules/health/doctors", icon: createIcon(UserCog), description: "Gestion des médecins et spécialistes" },
    { id: "health-nurses", name: "Personnel", href: "/modules/health/nurses", icon: createIcon(Users), description: "Infirmiers et personnel soignant" },
    { id: "health-consultations", name: "Consultations", href: "/modules/health/consultations", icon: createIcon(Clipboard), description: "Enregistrement des diagnostics et examens" },
    { id: "health-medical-records", name: "Dossiers Médicaux", href: "/modules/health/medical-records", icon: createIcon(FileText), description: "Gestion des DME et historique" },
    { id: "health-laboratory", name: "Laboratoire", href: "/modules/health/laboratory", icon: createIcon(Flask), description: "Analyses médicales et résultats" },
    { id: "health-prescriptions", name: "Ordonnances", href: "/modules/health/prescriptions", icon: createIcon(Syringe), description: "Gestion des prescriptions médicales" },
    { id: "health-pharmacy", name: "Pharmacie", href: "/modules/health/pharmacy", icon: createIcon(Pill), description: "Gestion des stocks de médicaments" },
    { id: "health-admissions", name: "Hospitalisations", href: "/modules/health/admissions", icon: createIcon(Building2), description: "Admissions et séjours hospitaliers" },
    { id: "health-rooms", name: "Chambres", href: "/modules/health/rooms", icon: createIcon(BedDouble), description: "Gestion des chambres et lits" },
    { id: "health-billing", name: "Facturation", href: "/modules/health/billing", icon: createIcon(CreditCard), description: "Gestion des paiements et factures" },
    { id: "health-insurance", name: "Assurances", href: "/modules/health/insurance", icon: createIcon(ShieldCheck), description: "Gestion des mutuelles et remboursements" },
    { id: "health-stats", name: "Statistiques", href: "/modules/health/stats", icon: createIcon(BarChart3), description: "Rapports et analyses de données" },
    { id: "health-integrations", name: "Intégrations", href: "/modules/health/integrations", icon: createIcon(Workflow), description: "Connexion avec d'autres modules" },
    { id: "health-settings", name: "Paramètres", href: "/modules/health/settings", icon: createIcon(Settings), description: "Configuration du module" }
  ]
};
