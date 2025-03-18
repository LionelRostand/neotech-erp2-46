
import { Store, CreditCard, Coffee, LayoutPanelLeft, ShoppingCart, Utensils, UserCircle, Calendar, Ticket, Globe, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const restaurantModule: AppModule = {
  id: 5,
  name: "Restaurant POS",
  description: "Système de point de vente et gestion complète pour restaurants",
  href: "/modules/restaurant",
  icon: createIcon(Store),
  category: 'services', // Added the category property
  submodules: [
    { id: "restaurant-pos", name: "Point de Vente", href: "/modules/restaurant/pos", icon: createIcon(CreditCard) },
    { id: "restaurant-list", name: "Restaurants", href: "/modules/restaurant/list", icon: createIcon(Coffee) },
    { id: "restaurant-layout", name: "Plan de Salle", href: "/modules/restaurant/layout", icon: createIcon(LayoutPanelLeft) },
    { id: "restaurant-orders", name: "Commandes", href: "/modules/restaurant/orders", icon: createIcon(ShoppingCart) },
    { id: "restaurant-payments", name: "Paiements", href: "/modules/restaurant/payments", icon: createIcon(CreditCard) },
    { id: "restaurant-kitchen", name: "Écran Cuisine", href: "/modules/restaurant/kitchen", icon: createIcon(Utensils) },
    { id: "restaurant-clients", name: "Clients", href: "/modules/restaurant/clients", icon: createIcon(UserCircle) },
    { id: "restaurant-reservations", name: "Réservations", href: "/modules/restaurant/reservations", icon: createIcon(Calendar) },
    { id: "restaurant-tickets", name: "Tickets", href: "/modules/restaurant/tickets", icon: createIcon(Ticket) },
    { id: "restaurant-web-reservations", name: "Réservations Web", href: "/modules/restaurant/web-reservations", icon: createIcon(Globe) },
    { id: "restaurant-settings", name: "Paramètres", href: "/modules/restaurant/settings", icon: createIcon(Settings) }
  ]
};
