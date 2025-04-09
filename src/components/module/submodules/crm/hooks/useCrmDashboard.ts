
import { useMemo, useState, useEffect } from 'react';
import { useCrmData } from '@/hooks/modules/useCrmData';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy } from 'firebase/firestore';

export const useCrmDashboard = () => {
  const { clients, prospects, opportunities, isLoading: isCrmDataLoading } = useCrmData();
  const [salesData, setSalesData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Fetch sales performance data from Firebase
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Get deals from the last 6 months
        const now = new Date();
        const sixMonthsAgo = subMonths(now, 6);
        
        // Fetch deals closed in the last 6 months
        const deals = await fetchCollectionData(
          COLLECTIONS.CRM.DEALS,
          [
            where('closedAt', '>=', sixMonthsAgo),
            orderBy('closedAt', 'asc')
          ]
        );
        
        // Group deals by month
        const monthlyData = {};
        const last6Months = [];
        
        // Initialize with the last 6 months
        for (let i = 5; i >= 0; i--) {
          const month = subMonths(now, i);
          const monthKey = format(month, 'MMM', { locale: fr });
          last6Months.push(monthKey);
          monthlyData[monthKey] = 0;
        }
        
        // Sum deal values by month
        deals.forEach(deal => {
          if (deal.closedAt && deal.value) {
            const dealDate = new Date(deal.closedAt.seconds * 1000);
            const monthKey = format(dealDate, 'MMM', { locale: fr });
            if (monthlyData[monthKey] !== undefined) {
              monthlyData[monthKey] += Number(deal.value) || 0;
            }
          }
        });
        
        // Format data for the chart
        const formattedData = last6Months.map(month => ({
          name: month,
          value: monthlyData[month] || 0
        }));
        
        setSalesData(formattedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Fallback to example data if fetch fails
        setSalesData([
          { name: 'Jan', value: 4000 },
          { name: 'Fév', value: 3000 },
          { name: 'Mar', value: 2000 },
          { name: 'Avr', value: 2780 },
          { name: 'Mai', value: 1890 },
          { name: 'Jun', value: 2390 },
        ]);
      }
    };
    
    const fetchPipelineData = async () => {
      try {
        // Fetch all active opportunities
        const activeOpportunities = await fetchCollectionData(
          COLLECTIONS.CRM.OPPORTUNITIES,
          [where('stage', '!=', 'closed_won'), where('stage', '!=', 'closed_lost')]
        );
        
        // Group opportunities by stage
        const stageGroups = {};
        let totalCount = 0;
        
        activeOpportunities.forEach(opp => {
          const stage = opp.stage || 'Nouveau';
          if (!stageGroups[stage]) {
            stageGroups[stage] = { count: 0, value: 0 };
          }
          stageGroups[stage].count += 1;
          stageGroups[stage].value += Number(opp.value) || 0;
          totalCount += 1;
        });
        
        // Format pipeline data
        const pipelineStages = [
          { id: 'new', name: 'Nouveau' },
          { id: 'negotiation', name: 'En négociation' },
          { id: 'quote', name: 'Devis envoyé' },
          { id: 'pending', name: 'En attente' },
          { id: 'won', name: 'Gagné' }
        ];
        
        const formattedPipeline = pipelineStages.map(stage => {
          const stageData = stageGroups[stage.id] || { count: 0, value: 0 };
          const percentage = totalCount > 0 ? Math.round((stageData.count / totalCount) * 100) : 0;
          
          return {
            id: stage.id,
            name: stage.name,
            count: stageData.count,
            percentage,
            value: stageData.value
          };
        });
        
        setPipelineData(formattedPipeline);
      } catch (error) {
        console.error('Error fetching pipeline data:', error);
        // Fallback data
        setPipelineData([
          { id: 'new', name: 'Nouveau', count: 12, percentage: 25, value: 25000 },
          { id: 'negotiation', name: 'En négociation', count: 8, percentage: 17, value: 42000 },
          { id: 'quote', name: 'Devis envoyé', count: 15, percentage: 31, value: 85000 },
          { id: 'pending', name: 'En attente', count: 9, percentage: 19, value: 37000 },
          { id: 'won', name: 'Gagné', count: 4, percentage: 8, value: 22000 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
    fetchPipelineData();
  }, []);

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
    pipelineData,
    opportunitiesData,
    recentActivities,
    isLoading: isLoading || isCrmDataLoading,
    COLORS
  };
};
