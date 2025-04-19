
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface AnalyticsStats {
  revenue: number;
  growth: number;
  newCustomers: number;
  satisfaction: number;
}

export interface AnalyticsData {
  month: string;
  revenue: number;
  customers: number;
}

export const useAnalyticsData = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    revenue: 0,
    growth: 0,
    newCustomers: 0,
    satisfaction: 0
  });
  const [monthlyData, setMonthlyData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques globales
        const statsDoc = await getDocs(collection(db, 'analyticsStats'));
        if (!statsDoc.empty) {
          const data = statsDoc.docs[0].data() as AnalyticsStats;
          setStats({
            revenue: data.revenue || 0,
            growth: data.growth || 0,
            newCustomers: data.newCustomers || 0,
            satisfaction: data.satisfaction || 0
          });
        }

        // Récupérer les données mensuelles pour le tableau
        const monthlyQuery = query(
          collection(db, 'monthlyAnalytics'),
          orderBy('month', 'desc'),
          limit(12)
        );
        const monthlySnapshot = await getDocs(monthlyQuery);
        const monthlyDataArray = monthlySnapshot.docs.map(doc => ({
          month: doc.data().month,
          revenue: doc.data().revenue,
          customers: doc.data().customers
        }));
        
        setMonthlyData(monthlyDataArray);

      } catch (error) {
        console.error('Erreur lors de la récupération des données analytics:', error);
        toast.error('Erreur lors du chargement des données analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return { stats, monthlyData, loading };
};
