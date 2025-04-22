
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
  name: "Freight Management", // Updated name
  description: "Logistics management, shipments, container tracking, and goods transportation",
  href: "/modules/freight",
  icon: createIcon(Truck),
  category: 'services',
  submodules: [
    { id: "freight-dashboard", name: "Dashboard", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "freight-shipments", name: "Shipments", href: "/modules/freight/shipments", icon: createIcon(PackageIcon) },
    { id: "freight-containers", name: "Containers", href: "/modules/freight/containers", icon: createIcon(LucideContainerIcon) },
    { id: "freight-tracking", name: "Tracking", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
    { id: "freight-invoices", name: "Invoices", href: "/modules/freight/invoices", icon: createIcon(Receipt) },
    { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
    { id: "freight-clients", name: "Clients", href: "/modules/freight/clients", icon: createIcon(Users) },
    { id: "freight-routes", name: "Routes", href: "/modules/freight/routes", icon: createIcon(LucideRouteIcon) },
    { id: "freight-settings", name: "Settings", href: "/modules/freight/settings", icon: createIcon(Settings) }
  ]
};
