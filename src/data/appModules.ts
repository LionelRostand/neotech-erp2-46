
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Warehouse, 
  PackageOpen, 
  LineChart, 
  Users, 
  Truck, 
  Settings,
  AppWindow,
  Database,
  FileText
} from 'lucide-react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

// Create icon elements as functions to avoid JSX syntax in .ts file
const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });

export const modules: AppModule[] = [
  { 
    id: 1, 
    name: 'Tableau de bord', 
    description: 'Affiche les statistiques et les données importantes de votre entreprise.',
    href: '/',
    icon: createIcon(LayoutDashboard)
  },
  { 
    id: 2, 
    name: 'Ventes', 
    description: 'Gérez les ventes, les factures et les commandes clients.',
    href: '/sales',
    icon: createIcon(ShoppingCart)
  },
  { 
    id: 3, 
    name: 'Achats', 
    description: 'Gérez les fournisseurs et les commandes d\'achat.',
    href: '/purchases',
    icon: createIcon(Warehouse)
  },
  { 
    id: 4, 
    name: 'Inventaire', 
    description: 'Suivez les stocks et gérez les produits.',
    href: '/inventory',
    icon: createIcon(PackageOpen)
  },
  { 
    id: 5, 
    name: 'Rapports', 
    description: 'Analysez les performances avec des rapports détaillés.',
    href: '/reports',
    icon: createIcon(LineChart)
  },
  { 
    id: 6, 
    name: 'Clients', 
    description: 'Gérez votre base de clients et leurs informations.',
    href: '/clients',
    icon: createIcon(Users)
  },
  { 
    id: 7, 
    name: 'Fournisseurs', 
    description: 'Gérez vos fournisseurs et leurs coordonnées.',
    href: '/suppliers',
    icon: createIcon(Truck)
  },
  { 
    id: 8, 
    name: 'Paramètres', 
    description: 'Configurez les paramètres de votre système.',
    href: '/settings', 
    icon: createIcon(Settings)
  },
  { 
    id: 9, 
    name: 'Applications', 
    description: 'Gérez les applications disponibles pour votre système.',
    href: '/applications', 
    icon: createIcon(AppWindow)
  },
  { 
    id: 10, 
    name: 'Base de données', 
    description: 'Accédez et gérez vos données d\'entreprise.',
    href: '/database', 
    icon: createIcon(Database)
  },
  { 
    id: 11, 
    name: 'Documentation', 
    description: 'Consultez la documentation technique et les guides utilisateur.',
    href: '/documentation', 
    icon: createIcon(FileText)
  }
];
