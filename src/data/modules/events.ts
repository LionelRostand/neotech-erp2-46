
import { Calendar, LayoutDashboard, Users, Map, Clock, Ticket, List, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const eventsModule: AppModule = {
  id: 14,
  name: "Evènements",
  description: "Organisation et gestion d'événements et de réservations",
  href: "/modules/events",
  icon: createIcon(Calendar),
  category: 'digital', // Added the category property
  submodules: [
    { id: "events-dashboard", name: "Tableau de bord", href: "/modules/events/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "events-calendar", name: "Calendrier", href: "/modules/events/calendar", icon: createIcon(Calendar) },
    { id: "events-attendees", name: "Participants", href: "/modules/events/attendees", icon: createIcon(Users) },
    { id: "events-venues", name: "Lieux", href: "/modules/events/venues", icon: createIcon(Map) },
    { id: "events-schedule", name: "Horaires", href: "/modules/events/schedule", icon: createIcon(Clock) },
    { id: "events-tickets", name: "Billets", href: "/modules/events/tickets", icon: createIcon(Ticket) },
    { id: "events-tasks", name: "Tâches", href: "/modules/events/tasks", icon: createIcon(List) },
    { id: "events-settings", name: "Paramètres", href: "/modules/events/settings", icon: createIcon(Settings) }
  ]
};
