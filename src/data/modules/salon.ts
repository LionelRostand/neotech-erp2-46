
import { AppModule, createIcon } from '../types/modules';
import { Scissors, Users, Calendar, User, List, Package, Receipt, Heart, Box, BarChart2, Smartphone, Settings } from 'lucide-react';

export const salonModule: AppModule = {
  id: 19, // Make sure this ID is unique and doesn't conflict with existing modules
  name: "Salon de Coiffure",
  description: "Solution complète de gestion pour salons de coiffure et instituts de beauté",
  href: "/module/salon",
  icon: createIcon(Scissors),
  category: 'services',
  submodules: [
    {
      id: "salon-dashboard",
      name: "Tableau de Bord",
      href: "/module/salon/dashboard",
      icon: createIcon(BarChart2),
      description: "Vue d'ensemble de l'activité du salon, rendez-vous du jour et indicateurs clés"
    },
    {
      id: "salon-clients",
      name: "Clients",
      href: "/module/salon/clients",
      icon: createIcon(Users),
      description: "Gestion complète des fiches clients et de leurs préférences"
    },
    {
      id: "salon-appointments",
      name: "Rendez-vous",
      href: "/module/salon/appointments",
      icon: createIcon(Calendar),
      description: "Prise et gestion des rendez-vous, planning des coiffeurs"
    },
    {
      id: "salon-stylists",
      name: "Coiffeurs",
      href: "/module/salon/stylists",
      icon: createIcon(User),
      description: "Gestion des coiffeurs, spécialités et performances"
    },
    {
      id: "salon-services",
      name: "Services",
      href: "/module/salon/services",
      icon: createIcon(List),
      description: "Catalogue des prestations, tarifs et durées"
    },
    {
      id: "salon-products",
      name: "Produits",
      href: "/module/salon/products",
      icon: createIcon(Package),
      description: "Vente et gestion des produits capillaires"
    },
    {
      id: "salon-billing",
      name: "Facturation",
      href: "/module/salon/billing",
      icon: createIcon(Receipt),
      description: "Génération et suivi des factures, paiements"
    },
    {
      id: "salon-loyalty",
      name: "Fidélité",
      href: "/module/salon/loyalty",
      icon: createIcon(Heart),
      description: "Programmes de fidélité et récompenses clients"
    },
    {
      id: "salon-inventory",
      name: "Stocks",
      href: "/module/salon/inventory",
      icon: createIcon(Box),
      description: "Gestion des stocks et commandes fournisseurs"
    },
    {
      id: "salon-reports",
      name: "Statistiques",
      href: "/module/salon/reports",
      icon: createIcon(BarChart2),
      description: "Rapports d'activité, analyses des ventes et performances"
    },
    {
      id: "salon-booking",
      name: "Réservation Web & Mobile",
      href: "/module/salon/booking",
      icon: createIcon(Smartphone),
      description: "Plateforme de réservation en ligne pour les clients"
    },
    {
      id: "salon-settings",
      name: "Paramètres",
      href: "/module/salon/settings",
      icon: createIcon(Settings),
      description: "Configuration du salon, rôles et intégrations"
    }
  ]
};
