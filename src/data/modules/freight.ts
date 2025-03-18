
import { 
  Truck, 
  LayoutDashboard, 
  Ship, 
  Container, 
  MapPin, 
  DollarSign, 
  FileText, 
  Users, 
  Settings, 
  Package, 
  Map, 
  BarChart, 
  CreditCard,
  Warehouse,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const freightModule: AppModule = {
  id: 2,
  name: "Freight Management",
  description: "Gestion logistique, expéditions, suivi des conteneurs et transport de marchandises",
  href: "/modules/freight",
  icon: createIcon(Truck),
  category: 'services', // Added the category property
  submodules: [
    { id: "freight-dashboard", name: "Tableau de bord", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
    
    // 1. Gestion des expéditions
    { id: "freight-shipments", name: "Expéditions", href: "/modules/freight/shipments", icon: createIcon(Ship) },
    { id: "freight-packages", name: "Colis", href: "/modules/freight/packages", icon: createIcon(Package) },
    { id: "freight-tracking", name: "Suivi", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
    { id: "freight-carriers", name: "Transporteurs", href: "/modules/freight/carriers", icon: createIcon(Truck) },
    
    // 2. Tarification et devis
    { id: "freight-pricing", name: "Tarification", href: "/modules/freight/pricing", icon: createIcon(DollarSign) },
    { id: "freight-quotes", name: "Devis", href: "/modules/freight/quotes", icon: createIcon(FileText) },
    
    // 3. Suivi des commandes et conteneurs
    { id: "freight-containers", name: "Conteneurs", href: "/modules/freight/containers", icon: createIcon(Container) },
    { id: "freight-orders", name: "Commandes", href: "/modules/freight/orders", icon: createIcon(ShoppingBag) },
    
    // 4. Documents de transport
    { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
    
    // 5. Optimisation des routes
    { id: "freight-routes", name: "Routes", href: "/modules/freight/routes", icon: createIcon(Map) },
    
    // 6. Entrepôts et stocks
    { id: "freight-warehouses", name: "Entrepôts", href: "/modules/freight/warehouses", icon: createIcon(Warehouse) },
    { id: "freight-inventory", name: "Stocks", href: "/modules/freight/inventory", icon: createIcon(BarChart) },
    
    // 7. Facturation et paiements
    { id: "freight-invoicing", name: "Facturation", href: "/modules/freight/invoicing", icon: createIcon(CreditCard) },
    { id: "freight-reports", name: "Rapports", href: "/modules/freight/reports", icon: createIcon(TrendingUp) },
    
    // Portail client et paramètres
    { id: "freight-client-portal", name: "Portail client", href: "/modules/freight/client-portal", icon: createIcon(Users) },
    { id: "freight-settings", name: "Paramètres", href: "/modules/freight/settings", icon: createIcon(Settings) }
  ]
};
