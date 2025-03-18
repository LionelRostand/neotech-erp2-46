
import { MessageSquare, LayoutDashboard, Users, Send, Mail, Archive, Clock, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const messagesModule: AppModule = {
  id: 13,
  name: "Messages",
  description: "Communication interne et externe avec les clients et l'équipe",
  href: "/modules/messages",
  icon: createIcon(MessageSquare),
  category: 'communication', // Added the category property
  submodules: [
    { id: "messages-dashboard", name: "Tableau de bord", href: "/modules/messages/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "messages-contacts", name: "Contacts", href: "/modules/messages/contacts", icon: createIcon(Users) },
    { id: "messages-compose", name: "Nouveau message", href: "/modules/messages/compose", icon: createIcon(Send) },
    { id: "messages-inbox", name: "Boîte de réception", href: "/modules/messages/inbox", icon: createIcon(Mail) },
    { id: "messages-archive", name: "Archives", href: "/modules/messages/archive", icon: createIcon(Archive) },
    { id: "messages-scheduled", name: "Programmés", href: "/modules/messages/scheduled", icon: createIcon(Clock) },
    { id: "messages-settings", name: "Paramètres", href: "/modules/messages/settings", icon: createIcon(Settings) }
  ]
};
