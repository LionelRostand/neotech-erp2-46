
import { AppModule, createIcon } from '../types/modules';
import { Scissors, Users, Calendar, User, List, Package, Receipt, Heart, Box, BarChart2, Smartphone, Settings } from 'lucide-react';

export const salonModule: AppModule = {
  id: 19, // Make sure this ID is unique and doesn't conflict with existing modules
  name: "Salon de Coiffure",
  description: "Solution complète de gestion pour salons de coiffure et instituts de beauté",
  href: "/modules/salon",
  icon: createIcon(Scissors),
  category: 'services',
  submodules: [
    {
      id: "salon-dashboard",
      name: "Tableau de Bord",
      href: "/modules/salon/dashboard",
      icon: createIcon(BarChart2),
      description: "Vue d'ensemble de l'activité du salon, rendez-vous du jour et indicateurs clés"
    },
    {
      id: "salon-clients",
      name: "Clients",
      href: "/modules/salon/clients",
      icon: createIcon(Users),
      description: "Gestion complète des fiches clients et de leurs préférences"
    },
    {
      id: "salon-appointments",
      name: "Rendez-vous",
      href: "/modules/salon/appointments",
      icon: createIcon(Calendar),
      description: "Prise et gestion des rendez-vous, planning des coiffeurs"
    },
    {
      id: "salon-stylists",
      name: "Coiffeurs",
      href: "/modules/salon/stylists",
      icon: createIcon(User),
      description: "Gestion des coiffeurs, spécialités et performances"
    },
    {
      id: "salon-services",
      name: "Services",
      href: "/modules/salon/services",
      icon: createIcon(List),
      description: "Catalogue des prestations, tarifs et durées"
    },
    {
      id: "salon-products",
      name: "Produits",
      href: "/modules/salon/products",
      icon: createIcon(Package),
      description: "Vente et gestion des produits capillaires"
    },
    {
      id: "salon-billing",
      name: "Facturation",
      href: "/modules/salon/billing",
      icon: createIcon(Receipt),
      description: "Génération et suivi des factures, paiements"
    },
    {
      id: "salon-loyalty",
      name: "Fidélité",
      href: "/modules/salon/loyalty",
      icon: createIcon(Heart),
      description: "Programmes de fidélité et récompenses clients"
    },
    {
      id: "salon-inventory",
      name: "Stocks",
      href: "/modules/salon/inventory",
      icon: createIcon(Box),
      description: "Gestion des stocks et commandes fournisseurs"
    },
    {
      id: "salon-reports",
      name: "Statistiques",
      href: "/modules/salon/reports",
      icon: createIcon(BarChart2),
      description: "Rapports d'activité, analyses des ventes et performances"
    },
    {
      id: "salon-booking",
      name: "Réservation Web & Mobile",
      href: "/modules/salon/booking",
      icon: createIcon(Smartphone),
      description: "Plateforme de réservation en ligne pour les clients"
    },
    {
      id: "salon-settings",
      name: "Paramètres",
      href: "/modules/salon/settings",
      icon: createIcon(Settings),
      description: "Configuration du salon, rôles et intégrations"
    }
  ]
};
