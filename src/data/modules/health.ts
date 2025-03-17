
import { Stethoscope, LayoutDashboard, Calendar, Users, Pill, Activity, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const healthModule: AppModule = {
  id: 8,
  name: "Health",
  description: "Gestion des patients, rendez-vous et suivi médical",
  href: "/modules/health",
  icon: createIcon(Stethoscope),
  submodules: [
    { id: "health-dashboard", name: "Dashboard", href: "/modules/health/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "health-appointments", name: "Rendez-vous", href: "/modules/health/appointments", icon: createIcon(Calendar) },
    { id: "health-patients", name: "Patients", href: "/modules/health/patients", icon: createIcon(Users) },
    { id: "health-pharmacy", name: "Pharmacie", href: "/modules/health/pharmacy", icon: createIcon(Pill) },
    { id: "health-stats", name: "Statistiques", href: "/modules/health/stats", icon: createIcon(Activity) },
    { id: "health-settings", name: "Paramètres", href: "/modules/health/settings", icon: createIcon(Settings) }
  ]
};
