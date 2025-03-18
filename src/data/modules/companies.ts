
import { AppModule, SubModule, createIcon } from '../types/modules';
import { Building, ListFilter, LayoutDashboard, Building2, UserPlus, FileSpreadsheet, FileBarChart2, Settings } from 'lucide-react';

// Sous-modules pour le module Entreprises
const submodules: SubModule[] = [
  {
    id: 'companies-dashboard',
    name: 'Tableau de bord',
    href: '/modules/companies/dashboard',
    icon: createIcon(LayoutDashboard),
  },
  {
    id: 'companies-list',
    name: 'Liste des entreprises',
    href: '/modules/companies/list',
    icon: createIcon(ListFilter),
  },
  {
    id: 'companies-create',
    name: 'Créer une entreprise',
    href: '/modules/companies/create',
    icon: createIcon(Building2),
  },
  {
    id: 'companies-contacts',
    name: 'Contacts',
    href: '/modules/companies/contacts',
    icon: createIcon(UserPlus),
  },
  {
    id: 'companies-documents',
    name: 'Documents',
    href: '/modules/companies/documents',
    icon: createIcon(FileSpreadsheet),
  },
  {
    id: 'companies-reports',
    name: 'Rapports',
    href: '/modules/companies/reports',
    icon: createIcon(FileBarChart2),
  },
  {
    id: 'companies-settings',
    name: 'Paramètres',
    href: '/modules/companies/settings',
    icon: createIcon(Settings),
  },
];

// Définition du module Entreprises
export const companiesModule: AppModule = {
  id: 18,
  name: 'Entreprises',
  description: 'Gérez vos entreprises, créez de nouvelles structures, suivez vos contacts professionnels et centralisez toutes vos informations commerciales.',
  href: '/modules/companies',
  icon: createIcon(Building),
  category: 'business', // Added the category property
  submodules,
};
