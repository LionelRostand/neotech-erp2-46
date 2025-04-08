
import { useMemo } from 'react';
import { useCrmData } from '@/hooks/modules/useCrmData';

export const useCrmDashboard = () => {
  const { clients, prospects, opportunities, isLoading } = useCrmData();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate statistics
  const stats = useMemo(() => {
    // Number of clients and prospects
    const clientsCount = clients?.length || 0;
    const prospectsCount = prospects?.length || 0;
    const opportunitiesCount = opportunities?.length || 0;

    // Calculate conversion rate: clients / (clients + prospects) * 100
    const totalContacts = clientsCount + prospectsCount;
    const conversionRate = totalContacts > 0 
      ? Math.round((clientsCount / totalContacts) * 100) 
      : 0;

    // Calculate revenue generated from opportunities
    const revenueGenerated = opportunities
      ? opportunities.reduce((sum, opp) => sum + (Number(opp.value) || 0), 0)
      : 0;

    // Average deal size
    const averageDealSize = opportunitiesCount > 0
      ? Math.round(revenueGenerated / opportunitiesCount)
      : 0;

    return {
      clients: clientsCount,
      prospects: prospectsCount,
      opportunities: opportunitiesCount,
      conversionRate,
      revenueGenerated,
      averageDealSize
    };
  }, [clients, prospects, opportunities]);

  // Create sales data for charts
  const salesData = useMemo(() => [
    { name: 'Jan', value: 4000 },
    { name: 'Fév', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Avr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ], []);

  // Create opportunities data by stage
  const opportunitiesData = useMemo(() => {
    if (!opportunities) return [];

    const stages: Record<string, number> = {};
    
    opportunities.forEach(opp => {
      const stage = opp.stage || 'unknown';
      stages[stage] = (stages[stage] || 0) + 1;
    });

    return Object.entries(stages).map(([name, value]) => ({ name, value }));
  }, [opportunities]);

  // Recent activities data - In a real app, this would come from Firebase
  const recentActivities = useMemo(() => [
    {
      id: 1,
      type: 'call',
      title: 'Appel avec Tech Solutions',
      description: 'Discussion sur le renouvellement du contrat',
      date: '2023-10-15T10:30:00',
      timeAgo: 'il y a 2 jours',
    },
    {
      id: 2,
      type: 'email',
      title: 'Email à Global Industries',
      description: 'Envoi de la proposition commerciale',
      date: '2023-10-14T15:45:00',
      timeAgo: 'il y a 3 jours',
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Rendez-vous avec Acme Corp',
      description: 'Présentation des nouveaux services',
      date: '2023-10-13T09:00:00',
      timeAgo: 'il y a 4 jours',
    },
    {
      id: 4,
      type: 'email',
      title: 'Email à SmartRetail',
      description: 'Suivi de la démonstration',
      date: '2023-10-12T11:20:00',
      timeAgo: 'il y a 5 jours',
    },
  ], []);

  return {
    stats,
    salesData,
    opportunitiesData,
    recentActivities,
    isLoading,
    COLORS
  };
};
