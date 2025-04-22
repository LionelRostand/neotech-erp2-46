
import { 
  Truck, 
  LayoutDashboard, 
  Ship, 
  MapPin, 
  FileText, 
  Users, 
  Settings,
  Container as LucideContainerIcon,
  Route as LucideRouteIcon,
  Receipt,
  Package as PackageIcon
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const freightModule: AppModule = {
  id: 2,
  name: "Gestion des Colis",
  description: "Gestion logistique, expéditions, suivi des conteneurs et transport de marchandises",
  href: "/modules/freight",
  icon: createIcon(Truck),
  category: 'services',
  submodules: [
    { id: "freight-dashboard", name: "Tableau de bord", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "freight-shipments", name: "Colis", href: "/modules/freight/shipments", icon: createIcon(PackageIcon) },
    { id: "freight-containers", name: "Conteneurs", href: "/modules/freight/containers", icon: createIcon(LucideContainerIcon) },
    { id: "freight-tracking", name: "Suivi", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
    { id: "freight-invoices", name: "Factures", href: "/modules/freight/invoices", icon: createIcon(Receipt) },
    { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
    { id: "freight-clients", name: "Clients", href: "/modules/freight/clients", icon: createIcon(Users) },
    { id: "freight-routes", name: "Routes", href: "/modules/freight/routes", icon: createIcon(LucideRouteIcon) },
    { id: "freight-settings", name: "Paramètres", href: "/modules/freight/settings", icon: createIcon(Settings) }
  ]
};
