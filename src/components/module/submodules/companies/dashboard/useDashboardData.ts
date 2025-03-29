
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

export interface DashboardMetrics {
  totalCompanies: number;
  activeCompanies: number;
  newCompanies: number;
  pendingReview: number;
  totalDocuments: number; // Added missing property
  growthRate: number;     // Added missing property
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCompanies: 0,
    activeCompanies: 0,
    newCompanies: 0,
    pendingReview: 0,
    totalDocuments: 0, // Initialize the new property
    growthRate: 0      // Initialize the new property
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Check if we're online first
        if (!navigator.onLine) {
          console.log('Offline mode detected, using cached or default data');
          const cachedData = localStorage.getItem('companies_dashboard_metrics');
          
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            setMetrics(parsedData);
            console.log('Using cached dashboard data');
          } else {
            // Use demo data if no cache
            setMetrics({
              totalCompanies: 42,
              activeCompanies: 36,
              newCompanies: 3,
              pendingReview: 5,
              totalDocuments: 128,  // Added default value
              growthRate: 5.2       // Added default value
            });
            console.log('Using default dashboard data (offline mode, no cache)');
          }
          setLoading(false);
          return;
        }
        
        // We're online, try to fetch actual data with network retry
        const data = await executeWithNetworkRetry(async () => {
          // This is a simulation for demo purposes
          // In a real app, this would be a Firestore query
          console.log('Fetching dashboard data from Firestore...');
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Return mock data - replace with actual Firestore call
          return {
            totalCompanies: 87,
            activeCompanies: 72,
            newCompanies: 8,
            pendingReview: 7,
            totalDocuments: 245,  // Added mock data
            growthRate: 8.7       // Added mock data
          };
        });
        
        setMetrics(data);
        
        // Cache the data for offline use
        localStorage.setItem('companies_dashboard_metrics', JSON.stringify(data));
        
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err);
        
        // Try to use cached data if available
        const cachedData = localStorage.getItem('companies_dashboard_metrics');
        if (cachedData) {
          setMetrics(JSON.parse(cachedData));
          console.log('Falling back to cached dashboard data due to error');
        }
        
        if (!navigator.onLine) {
          toast.warning('Mode hors-ligne activé. Données limitées disponibles.');
        } else {
          toast.error('Erreur de chargement des données du tableau de bord');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return {
    metrics,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Force localStorage cache to be cleared for fresh data
      localStorage.removeItem('companies_dashboard_metrics');
    }
  };
};
