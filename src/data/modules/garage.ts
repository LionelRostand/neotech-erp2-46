
import { Car, LayoutDashboard, Users, Receipt, Truck, Package, BadgePercent, Settings, Calendar, Cog, UserCog, Wrench } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const garageModule: AppModule = {
  id: 6,
  name: "Garage Auto",
  description: "Gestion complète pour ateliers de réparation et services automobiles",
  href: "/modules/garage",
  icon: createIcon(Car),
  category: 'services',
  submodules: [
    { id: "garage-dashboard", name: "Tableau de bord", href: "/modules/garage/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "garage-clients", name: "Clients", href: "/modules/garage/clients", icon: createIcon(Users) },
    { id: "garage-vehicles", name: "Véhicules", href: "/modules/garage/vehicles", icon: createIcon(Car) },
    { id: "garage-appointments", name: "Rendez-vous", href: "/modules/garage/appointments", icon: createIcon(Calendar) },
    { id: "garage-services", name: "Services", href: "/modules/garage/services", icon: createIcon(Cog) },
    { id: "garage-mechanics", name: "Mécaniciens", href: "/modules/garage/mechanics", icon: createIcon(UserCog) },
    { id: "garage-maintenance", name: "Maintenances", href: "/modules/garage/maintenance", icon: createIcon(Wrench) },
    { id: "garage-invoices", name: "Factures", href: "/modules/garage/invoices", icon: createIcon(Receipt) },
    { id: "garage-suppliers", name: "Fournisseurs", href: "/modules/garage/suppliers", icon: createIcon(Truck) },
    { id: "garage-inventory", name: "Inventaire", href: "/modules/garage/inventory", icon: createIcon(Package) },
    { id: "garage-loyalty", name: "Programme de fidélité", href: "/modules/garage/loyalty", icon: createIcon(BadgePercent) },
    { id: "garage-settings", name: "Paramètres", href: "/modules/garage/settings", icon: createIcon(Settings) }
  ]
};
