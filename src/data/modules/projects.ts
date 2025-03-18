
import { Briefcase, CheckSquare, UsersRound, BarChart, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const projectsModule: AppModule = {
  id: 3,
  name: "Projets",
  description: "Gestion de projets, tâches, équipes et coordination des activités",
  href: "/modules/projects",
  icon: createIcon(Briefcase),
  category: 'business', // Added the category property
  submodules: [
    { id: "projects-list", name: "Projets", href: "/modules/projects/list", icon: createIcon(Briefcase) },
    { id: "projects-tasks", name: "Tâches", href: "/modules/projects/tasks", icon: createIcon(CheckSquare) },
    { id: "projects-teams", name: "Équipes", href: "/modules/projects/teams", icon: createIcon(UsersRound) },
    { id: "projects-reports", name: "Rapports", href: "/modules/projects/reports", icon: createIcon(BarChart) },
    { id: "projects-settings", name: "Paramètres", href: "/modules/projects/settings", icon: createIcon(Settings) }
  ]
};
