import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where } from 'firebase/firestore';
import { Activity, FileText, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import CompanyActivityChart from './CompanyActivityChart';
import RecentCompaniesWidget from './RecentCompaniesWidget';
import RecentDocumentsWidget from './RecentDocumentsWidget';
import { Skeleton } from '@/components/ui/skeleton';

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

const CompaniesDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalCompanies: 0,
    totalDocuments: 0,
    activeCompanies: 0,
    recentActivity: 0,
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
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Entreprises"
          value={metrics.totalCompanies.toString()}
          icon={<Building2 className="h-5 w-5 text-blue-500" />}
          description="Nombre total d'entreprises"
        />
        
        <StatCard 
          title="Documents"
          value={metrics.totalDocuments.toString()}
          icon={<FileText className="h-5 w-5 text-amber-500" />}
          description="Documents stockés"
        />
        
        <StatCard 
          title="Entreprises actives"
          value={metrics.activeCompanies.toString()}
          icon={<Building2 className="h-5 w-5 text-green-500" />}
          description="Actives ces 30 derniers jours"
        />
        
        <StatCard 
          title="Activité récente"
          value={metrics.recentActivity.toString()}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          description="Actions ces 7 derniers jours"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-4">
          <CompanyActivityChart />
        </Card>
        
        <Card className="col-span-1 p-4">
          <Tabs defaultValue="companies">
            <TabsList className="w-full">
              <TabsTrigger value="companies" className="flex-1">Entreprises récentes</TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">Documents récents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies" className="mt-4">
              <RecentCompaniesWidget />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <RecentDocumentsWidget />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

// Loading skeleton
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2 p-4">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </Card>
      
      <Card className="col-span-1 p-4">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export default CompaniesDashboard;
