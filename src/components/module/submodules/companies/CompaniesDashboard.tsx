
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where } from 'firebase/firestore';
import { Activity, FileText, Building2, TrendingUp, Users, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import CompanyActivityChart from './CompanyActivityChart';
import RecentCompaniesWidget from './RecentCompaniesWidget';
import RecentDocumentsWidget from './RecentDocumentsWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    growthRate: 12.8,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
          growthRate: 12.8, // Exemple de taux de croissance
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  const navigateToCompanyCreate = () => {
    navigate('/modules/companies/create');
  };
  
  const navigateToCompaniesList = () => {
    navigate('/modules/companies/list');
  };
  
  if (loading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord des entreprises</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Vue d'ensemble et statistiques des entreprises partenaires
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={navigateToCompaniesList}>
            <Users className="mr-2 h-4 w-4" />
            Voir toutes les entreprises
          </Button>
          <Button onClick={navigateToCompanyCreate}>
            <Building2 className="mr-2 h-4 w-4" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">{metrics.totalCompanies}</div>
                <p className="text-xs text-gray-500 mt-1">Total des entreprises</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">{metrics.totalDocuments}</div>
                <p className="text-xs text-gray-500 mt-1">Documents stockés</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Entreprises actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">{metrics.activeCompanies}</div>
                <p className="text-xs text-gray-500 mt-1">Actives ces 30 derniers jours</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux de croissance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold flex items-center">
                  {metrics.growthRate}%
                  <ArrowUpRight className="h-5 w-5 ml-1 text-green-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Par rapport au mois dernier</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Activité des entreprises</CardTitle>
              <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
            </div>
            <div className="bg-gray-100 p-2 rounded-md">
              <BarChart3 className="h-5 w-5 text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <CompanyActivityChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="companies">Récentes</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-2">
            <TabsContent value="companies" className="mt-0 p-0">
              <RecentCompaniesWidget />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0 p-0">
              <RecentDocumentsWidget />
            </TabsContent>
          </CardContent>
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
