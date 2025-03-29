
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where } from 'firebase/firestore';

interface Company {
  id: string;
  name?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Document {
  id: string;
  type?: string;
  createdAt?: any;
}

export interface DashboardMetrics {
  totalCompanies: number;
  totalDocuments: number;
  activeCompanies: number;
  recentActivity: number;
  growthRate: number;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCompanies: 0,
    totalDocuments: 0,
    activeCompanies: 0,
    recentActivity: 0,
    growthRate: 12.8,
  });
  const [loading, setLoading] = useState(true);
  
  const companiesDb = useFirestore(COLLECTIONS.COMPANIES);
  const documentsDb = useFirestore(COLLECTIONS.DOCUMENTS);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch companies data
        const companies = await companiesDb.getAll() as Company[];
        
        // Fetch documents data
        const documents = await documentsDb.getAll([
          where('type', '==', 'company_document')
        ]) as Document[];
        
        // Calculate active companies (created or updated in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeCompanies = companies.filter(company => {
          const updatedAt = company.updatedAt?.toDate() || new Date();
          return updatedAt >= thirtyDaysAgo;
        });
        
        // Calculate recent activity (any company action in the last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentActivity = companies.filter(company => {
          const updatedAt = company.updatedAt?.toDate() || new Date();
          return updatedAt >= sevenDaysAgo;
        }).length;
        
        setMetrics({
          totalCompanies: companies.length,
          totalDocuments: documents.length,
          activeCompanies: activeCompanies.length,
          recentActivity,
          growthRate: 12.8, // Example growth rate
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);

  return { metrics, loading };
};
