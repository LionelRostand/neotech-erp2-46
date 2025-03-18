
import { Car, LayoutDashboard, Users, Calendar, Map, Wallet, FileText, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const vehicleRentalsModule: AppModule = {
  id: 12,
  name: "Locations de véhicules",
  description: "Gestion de flotte de véhicules et de réservations",
  href: "/modules/vehicle-rentals",
  icon: createIcon(Car),
  category: 'services', // Added the category property
  submodules: [
    { id: "rentals-dashboard", name: "Tableau de bord", href: "/modules/vehicle-rentals/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "rentals-vehicles", name: "Véhicules", href: "/modules/vehicle-rentals/vehicles", icon: createIcon(Car) },
    { id: "rentals-clients", name: "Clients", href: "/modules/vehicle-rentals/clients", icon: createIcon(Users) },
    { id: "rentals-reservations", name: "Réservations", href: "/modules/vehicle-rentals/reservations", icon: createIcon(Calendar) },
    { id: "rentals-locations", name: "Emplacements", href: "/modules/vehicle-rentals/locations", icon: createIcon(Map) },
    { id: "rentals-billing", name: "Facturation", href: "/modules/vehicle-rentals/billing", icon: createIcon(Wallet) },
    { id: "rentals-reports", name: "Rapports", href: "/modules/vehicle-rentals/reports", icon: createIcon(FileText) },
    { id: "rentals-settings", name: "Paramètres", href: "/modules/vehicle-rentals/settings", icon: createIcon(Settings) }
  ]
};
