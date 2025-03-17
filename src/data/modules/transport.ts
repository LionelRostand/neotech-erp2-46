
import { Car, CalendarCheck, Calendar, Users, MapPin, CreditCard, Mail, Heart, Globe, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const transportModule: AppModule = {
  id: 7,
  name: "Transport",
  description: "Gestion des chauffeurs, réservations et planification des transports",
  href: "/modules/transport",
  icon: createIcon(Car),
  submodules: [
    { id: "transport-reservations", name: "Réservations", href: "/modules/transport/reservations", icon: createIcon(CalendarCheck) },
    { id: "transport-planning", name: "Planning", href: "/modules/transport/planning", icon: createIcon(Calendar) },
    { id: "transport-fleet", name: "Flotte", href: "/modules/transport/fleet", icon: createIcon(Car) },
    { id: "transport-drivers", name: "Chauffeurs", href: "/modules/transport/drivers", icon: createIcon(Users) },
    { id: "transport-geolocation", name: "Géolocalisation", href: "/modules/transport/geolocation", icon: createIcon(MapPin) },
    { id: "transport-payments", name: "Paiements", href: "/modules/transport/payments", icon: createIcon(CreditCard) },
    { id: "transport-customer-service", name: "Service Client", href: "/modules/transport/customer-service", icon: createIcon(Mail) },
    { id: "transport-loyalty", name: "Fidélité", href: "/modules/transport/loyalty", icon: createIcon(Heart) },
    { id: "transport-web-booking", name: "Réservation Web", href: "/modules/transport/web-booking", icon: createIcon(Globe) },
    { id: "transport-settings", name: "Paramètres", href: "/modules/transport/settings", icon: createIcon(Settings) }
  ]
};
