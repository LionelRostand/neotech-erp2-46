
import { useState, useEffect } from 'react';
import { useCrmData } from '@/hooks/modules/useCrmData';
import { toast } from 'sonner';

export const useCrmDashboard = () => {
  const { clients, prospects, opportunities, isLoading, error, refreshData } = useCrmData();
  const [stats, setStats] = useState({
    clients: 0,
    prospects: 0,
    opportunities: 0,
    conversionRate: 0,
    revenueGenerated: 0,
    averageDealSize: 0
  });
  
  // Couleurs pour les graphiques
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];
  
  // Données pour les graphiques
  const [salesData, setSalesData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Calculer les statistiques à partir des données
  useEffect(() => {
    if (isLoading) return;

    try {
      // Calculer les statistiques de base
      const totalClients = clients.length;
      const totalProspects = prospects.length;
      const totalOpportunities = opportunities.length;
      
      // Calculer le taux de conversion (avec gestion de division par zéro)
      const conversionRate = totalProspects > 0 
        ? Math.round((totalClients / (totalClients + totalProspects)) * 100) 
        : 0;
      
      // Calculer le revenu généré et la taille moyenne des affaires
      let totalRevenue = 0;
      opportunities.forEach(opp => {
        if (opp.value && !isNaN(Number(opp.value))) {
          totalRevenue += Number(opp.value);
        }
      });
      
      const avgDealSize = totalOpportunities > 0 
        ? Math.round(totalRevenue / totalOpportunities) 
        : 0;
      
      setStats({
        clients: totalClients,
        prospects: totalProspects,
        opportunities: totalOpportunities,
        conversionRate,
        revenueGenerated: totalRevenue,
        averageDealSize: avgDealSize
      });
      
      // Préparer les données pour les graphiques
      prepareSalesData();
      preparePipelineData();
      prepareOpportunitiesData();
      prepareRecentActivities();
      
    } catch (err) {
      console.error('Error processing dashboard data:', err);
      toast.error('Erreur lors du traitement des données du tableau de bord');
    }
  }, [clients, prospects, opportunities, isLoading]);

  // Préparer les données de ventes
  const prepareSalesData = () => {
    // Données fictives pour démonstration
    const data = [
      { name: 'Jan', value: 12000 },
      { name: 'Fév', value: 15000 },
      { name: 'Mar', value: 18000 },
      { name: 'Avr', value: 14000 },
      { name: 'Mai', value: 21000 },
      { name: 'Juin', value: 19000 }
    ];
    setSalesData(data);
  };

  // Préparer les données du pipeline
  const preparePipelineData = () => {
    const stageData = [
      { id: 'qualification', name: 'Qualification', count: 23, percentage: 80 },
      { id: 'proposal', name: 'Proposition', count: 18, percentage: 65 },
      { id: 'negotiation', name: 'Négociation', count: 12, percentage: 45 },
      { id: 'closure', name: 'Clôture', count: 8, percentage: 30 },
      { id: 'won', name: 'Gagné', count: 5, percentage: 20 }
    ];
    setPipelineData(stageData);
  };

  // Préparer les données sur les opportunités
  const prepareOpportunitiesData = () => {
    const data = [
      { name: 'Services', value: 35 },
      { name: 'Produits', value: 25 },
      { name: 'Formations', value: 20 },
      { name: 'Conseil', value: 15 },
      { name: 'Support', value: 5 }
    ];
    setOpportunitiesData(data);
  };

  // Préparer les données des activités récentes
  const prepareRecentActivities = () => {
    const now = new Date();
    const activities = [
      {
        id: 1,
        type: 'call',
        title: 'Appel de suivi',
        description: 'Appel avec Dupont SA concernant le renouvellement de contrat',
        date: new Date(now.getTime() - 3600000).toISOString(), // 1 heure avant
        timeAgo: 'Il y a 1 heure'
      },
      {
        id: 2,
        type: 'email',
        title: 'Proposition envoyée',
        description: 'Proposition commerciale envoyée à Martin SARL',
        date: new Date(now.getTime() - 7200000).toISOString(), // 2 heures avant
        timeAgo: 'Il y a 2 heures'
      },
      {
        id: 3,
        type: 'meeting',
        title: 'Réunion client',
        description: 'Présentation des nouveaux services à Entreprise XYZ',
        date: new Date(now.getTime() - 28800000).toISOString(), // 8 heures avant
        timeAgo: 'Il y a 8 heures'
      },
      {
        id: 4,
        type: 'email',
        title: 'Demande d\'information',
        description: 'Réponse à la demande d\'information de Société ABC',
        date: new Date(now.getTime() - 86400000).toISOString(), // 1 jour avant
        timeAgo: 'Il y a 1 jour'
      }
    ];
    setRecentActivities(activities);
  };

  // Gérer l'actualisation des données
  const handleRefresh = () => {
    refreshData();
  };

  return {
    stats,
    salesData,
    pipelineData,
    opportunitiesData,
    recentActivities,
    isLoading,
    error,
    refreshData: handleRefresh,
    COLORS
  };
};
