
import { useState, useEffect } from 'react';

// Define types for dashboard data
interface DashboardStats {
  revenue: number;
  orders: number;
  clients: number;
  products: number;
}

interface Transaction {
  id: string;
  date: string;
  client: string;
  amount: string;
  status: 'pending' | 'completed' | 'cancelled';
  statusText: string;
}

// Default stats values
const defaultStats: DashboardStats = {
  revenue: 124350,
  orders: 342,
  clients: 721,
  products: 158
};

// Sample transactions for demo
const sampleTransactions: Transaction[] = [
  {
    id: 'TX-2023-001',
    date: '21 Avr 2025',
    client: 'Entreprise ABC',
    amount: '€1,250.00',
    status: 'completed',
    statusText: 'Terminé'
  },
  {
    id: 'TX-2023-002',
    date: '20 Avr 2025',
    client: 'Société XYZ',
    amount: '€2,840.50',
    status: 'pending',
    statusText: 'En attente'
  },
  {
    id: 'TX-2023-003',
    date: '19 Avr 2025',
    client: 'Jean Dupont SARL',
    amount: '€580.25',
    status: 'completed',
    statusText: 'Terminé'
  },
  {
    id: 'TX-2023-004',
    date: '18 Avr 2025',
    client: 'Agence Design',
    amount: '€3,200.00',
    status: 'cancelled',
    statusText: 'Annulé'
  },
  {
    id: 'TX-2023-005',
    date: '17 Avr 2025',
    client: 'Martin & Co',
    amount: '€1,795.60',
    status: 'completed',
    statusText: 'Terminé'
  }
];

/**
 * Hook to fetch dashboard data with optional loading parameter
 * @param shouldLoad If false, returns default data without any loading simulation
 */
export const useDashboardData = (shouldLoad: boolean = true) => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [loading, setLoading] = useState(shouldLoad);

  useEffect(() => {
    // Skip loading simulation if shouldLoad is false
    if (!shouldLoad) {
      setLoading(false);
      return;
    }
    
    // Simulate data loading
    const timer = setTimeout(() => {
      setStats(defaultStats);
      setTransactions(sampleTransactions);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [shouldLoad]);

  return {
    stats,
    transactions,
    loading
  };
};

export default useDashboardData;
