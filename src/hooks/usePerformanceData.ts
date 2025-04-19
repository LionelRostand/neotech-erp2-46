
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface PerformanceStats {
  revenue: number;
  growth: number;
  newCustomers: number;
  satisfaction: number;
}

export interface PerformanceData {
  month: string;
  revenue: number;
  customers: number;
}

export const usePerformanceData = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    revenue: 0,
    growth: 0,
    newCustomers: 0,
    satisfaction: 0
  });
  const [monthlyData, setMonthlyData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques globales
        const statsDoc = await getDocs(collection(db, 'performanceStats'));
        if (!statsDoc.empty) {
          const data = statsDoc.docs[0].data();
          setStats({
            revenue: data.revenue || 0,
            growth: data.growth || 0,
            newCustomers: data.newCustomers || 0,
            satisfaction: data.satisfaction || 0
          });
        }

        // Récupérer les données mensuelles
        const monthlyQuery = query(
          collection(db, 'monthlyPerformance'),
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
        console.error('Erreur lors de la récupération des données de performance:', error);
        toast.error('Erreur lors du chargement des données de performance');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  return { stats, monthlyData, loading };
};
