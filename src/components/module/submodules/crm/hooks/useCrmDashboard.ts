
import { useState, useEffect } from 'react';

export interface DashboardStats {
  clients: number;
  prospects: number;
  opportunities: number;
  conversionRate: number;
  revenueGenerated: number;
  averageDealSize: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting';
  title: string;
  description: string;
  date: string;
  timeAgo: string;
}

export const useCrmDashboard = () => {
  // Sample colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Sample data - in a real application, these would come from API calls or real-time database
  const [stats, setStats] = useState<DashboardStats>({
    clients: 42,
    prospects: 78,
    opportunities: 23,
    conversionRate: 28,
    revenueGenerated: 520000,
    averageDealSize: 45000
  });
  
  const [salesData, setSalesData] = useState<ChartDataItem[]>([
    { name: 'Jan', value: 24000 },
    { name: 'Fév', value: 32000 },
    { name: 'Mar', value: 28000 },
    { name: 'Avr', value: 39000 },
    { name: 'Mai', value: 42000 },
    { name: 'Juin', value: 55000 },
  ]);
  
  const [opportunitiesData, setOpportunitiesData] = useState<ChartDataItem[]>([
    { name: 'Nouveau', value: 12 },
    { name: 'En négociation', value: 8 },
    { name: 'Devis envoyé', value: 15 },
    { name: 'En attente', value: 9 },
    { name: 'Gagné', value: 4 },
  ]);
  
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'call',
      title: 'Appel avec Tech Innovations',
      description: 'Discussion pour finaliser l\'offre de logiciel CRM',
      date: '2023-06-02T14:30:00',
      timeAgo: 'Il y a 2 heures'
    },
    {
      id: '2',
      type: 'email',
      title: 'Email à Global Industries',
      description: 'Envoi du devis révisé avec les nouvelles conditions',
      date: '2023-06-02T10:15:00',
      timeAgo: 'Il y a 6 heures'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Rendez-vous avec Acme Corp',
      description: 'Présentation des nouveaux services cloud',
      date: '2023-06-01T16:00:00',
      timeAgo: 'Il y a 1 jour'
    },
    {
      id: '4',
      type: 'email',
      title: 'Relance Nexus Systems',
      description: 'Suivi après 7 jours sans réponse',
      date: '2023-05-31T09:45:00',
      timeAgo: 'Il y a 3 jours'
    }
  ]);

  // In a real app, you would fetch this data from your backend
  useEffect(() => {
    // Here you would fetch real data
    // Example: const fetchData = async () => {...}
    // fetchData();
  }, []);

  return {
    stats,
    salesData,
    opportunitiesData,
    recentActivities,
    COLORS
  };
};
