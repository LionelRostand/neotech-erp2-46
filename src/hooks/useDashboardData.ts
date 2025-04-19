
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface DashboardStats {
  revenue: number;
  orders: number;
  clients: number;
  products: number;
}

export interface Transaction {
  id: string;
  date: string;
  client: string;
  amount: string;
  status: 'success' | 'warning' | 'danger';
  statusText: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    orders: 0,
    clients: 0,
    products: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsDoc = await getDocs(collection(db, 'dashboardStats'));
        if (!statsDoc.empty) {
          const data = statsDoc.docs[0].data();
          setStats({
            revenue: data.revenue || 0,
            orders: data.orders || 0,
            clients: data.clients || 0,
            products: data.products || 0
          });
        }

        // Fetch recent transactions
        const transactionsQuery = query(
          collection(db, 'transactions'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        setTransactions(transactionsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, transactions, loading };
};
