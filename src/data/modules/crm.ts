
import { Users, UserPlus, Briefcase, Settings, LineChart, Handshake } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const crmModule: AppModule = {
  id: 17,
  name: "CRM",
  description: "Gestion de la relation client, prospects et opportunités",
  href: "/modules/crm",
  icon: createIcon(Users),
  category: 'business', // Added the category property
  submodules: [
    { id: "crm-clients", name: "Clients", href: "/modules/crm/clients", icon: createIcon(Users) },
    { id: "crm-prospects", name: "Prospects", href: "/modules/crm/prospects", icon: createIcon(UserPlus) },
    { id: "crm-opportunities", name: "Opportunités", href: "/modules/crm/opportunities", icon: createIcon(Briefcase) },
    { id: "crm-analytics", name: "Analytiques", href: "/modules/crm/analytics", icon: createIcon(LineChart) },
    { id: "crm-settings", name: "Paramètres", href: "/modules/crm/settings", icon: createIcon(Settings) }
  ]
};
