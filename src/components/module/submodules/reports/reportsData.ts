
import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Award, 
  GraduationCap, 
  BadgePercent,
  LineChart,
  PieChart
} from 'lucide-react';
import { ReportCardProps } from './ReportCard';

export const getMockReports = (): ReportCardProps[] => {
  return [
    {
      title: "Effectifs par département",
      description: "Nombre d'employés actifs par département",
      lastUpdated: "2025-03-20",
      icon: React.createElement(Users, { className: "h-5 w-5 text-blue-500" }),
      status: 'ready',
      category: 'rh'
    },
    {
      title: "Absentéisme mensuel",
      description: "Taux d'absentéisme par département",
      lastUpdated: "2025-03-19",
      icon: React.createElement(UserCheck, { className: "h-5 w-5 text-red-500" }),
      status: 'ready',
      category: 'absence'
    },
    {
      title: "Ancienneté moyenne",
      description: "Ancienneté moyenne des employés par service",
      lastUpdated: "2025-03-15",
      icon: React.createElement(Calendar, { className: "h-5 w-5 text-green-500" }),
      status: 'ready',
      category: 'rh'
    },
    {
      title: "Performance trimestrielle",
      description: "Évaluation de performance par département",
      lastUpdated: "2025-03-10",
      icon: React.createElement(Award, { className: "h-5 w-5 text-purple-500" }),
      status: 'updating',
      category: 'performance'
    },
    {
      title: "Budget formation",
      description: "Budget formation utilisé vs. alloué",
      lastUpdated: "2025-03-05",
      icon: React.createElement(GraduationCap, { className: "h-5 w-5 text-amber-500" }),
      status: 'ready',
      category: 'formation'
    },
    {
      title: "Évolution de la masse salariale",
      description: "Évolution sur les 12 derniers mois",
      lastUpdated: "2025-02-29",
      icon: React.createElement(BadgePercent, { className: "h-5 w-5 text-emerald-500" }),
      status: 'scheduled',
      category: 'paie'
    },
    {
      title: "Prévisions de congés",
      description: "Prévisions de congés pour les 3 prochains mois",
      lastUpdated: "2025-02-28",
      icon: React.createElement(LineChart, { className: "h-5 w-5 text-cyan-500" }),
      status: 'ready',
      category: 'absence'
    },
    {
      title: "Répartition par type de contrat",
      description: "Analyse des types de contrats dans l'entreprise",
      lastUpdated: "2025-02-25",
      icon: React.createElement(PieChart, { className: "h-5 w-5 text-indigo-500" }),
      status: 'ready',
      category: 'contrat'
    },
  ];
};
