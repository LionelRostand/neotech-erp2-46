
import { 
  Truck, 
  LayoutDashboard, 
  Ship, 
  MapPin, 
  DollarSign, 
  FileText, 
  Users, 
  Settings,
  Navigation,
  Package,
  Route as LucideRouteIcon,
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const freightModule: AppModule = {
  id: 2,
  name: "Freight Management",
  description: "Gestion logistique, expéditions, suivi des conteneurs et transport de marchandises",
  href: "/modules/freight",
  icon: createIcon(Truck),
  category: 'services',
  submodules: [
    { id: "freight-dashboard", name: "Tableau de bord", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "freight-shipments", name: "Expéditions", href: "/modules/freight/shipments", icon: createIcon(Ship) },
    { id: "freight-clients", name: "Clients", href: "/modules/freight/clients", icon: createIcon(Users) },
    { id: "freight-containers-management", name: "Gestion des Conteneurs", href: "/modules/freight/containers-management", icon: createIcon(Package) },
    { id: "freight-carriers", name: "Transporteurs", href: "/modules/freight/carriers", icon: createIcon(Truck) },
    { id: "freight-tracking", name: "Suivi", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
    { id: "freight-accounting", name: "Comptabilité", href: "/modules/freight/accounting", icon: createIcon(DollarSign) },
    { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
    { id: "freight-client-portal", name: "Portail client", href: "/modules/freight/client-portal", icon: createIcon(Users) },
    { id: "freight-routes-main", name: "Routes", href: "/modules/freight/routes", icon: createIcon(LucideRouteIcon) },
    { id: "freight-settings", name: "Paramètres", href: "/modules/freight/settings", icon: createIcon(Settings) }
  ]
};
