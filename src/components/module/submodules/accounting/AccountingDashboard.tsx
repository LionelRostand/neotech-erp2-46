
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Euro, 
  Receipt, 
  AlertTriangle, 
  Calendar, 
  Wallet, 
  CreditCard
} from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DashboardStats, Transaction } from './types/accounting-types';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import RecentInvoicesTable from './components/RecentInvoicesTable';

const mockChartData = [
  { name: 'Jan', revenue: 12000, expenses: 8000 },
  { name: 'Fév', revenue: 15000, expenses: 9000 },
  { name: 'Mar', revenue: 18000, expenses: 10000 },
  { name: 'Avr', revenue: 16000, expenses: 11000 },
  { name: 'Mai', revenue: 14000, expenses: 8500 },
  { name: 'Juin', revenue: 20000, expenses: 12000 },
];

const mockForecastData = [
  { name: 'Juil', revenue: 19000, expenses: 12500 },
  { name: 'Août', revenue: 22000, expenses: 13000 },
  { name: 'Sept', revenue: 25000, expenses: 14000 },
];

const AccountingDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'thisMonth' | 'thisQuarter' | 'thisYear'>('thisMonth');
  const transactionsCollection = useFirestore(COLLECTIONS.ACCOUNTING.TRANSACTIONS);
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Dans un environnement réel, nous ferions un appel à l'API ou à Firestore
        // pour récupérer les données du tableau de bord basées sur la période.
        // Pour ce prototype, nous utilisons des données fictives.
        
        setTimeout(() => {
          setDashboardData({
            totalRevenue: 45000,
            totalExpenses: 28000,
            bankBalance: 32500,
            openInvoices: 12,
            overdueInvoices: 3,
            recentTransactions: [],
            monthlyRevenue: mockChartData.map(item => ({ month: item.name, amount: item.revenue })),
            monthlyExpenses: mockChartData.map(item => ({ month: item.name, amount: item.expenses })),
            topClients: [
              { id: '1', name: 'Entreprise ABC', revenue: 12000 },
              { id: '2', name: 'Société XYZ', revenue: 8500 },
              { id: '3', name: 'Client Premium', revenue: 6200 },
            ]
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
        toast.error('Impossible de charger les données du tableau de bord');
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord comptable</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPeriod('thisMonth')}
            className={period === 'thisMonth' ? 'bg-primary text-primary-foreground' : ''}
          >
            Ce mois
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPeriod('thisQuarter')}
            className={period === 'thisQuarter' ? 'bg-primary text-primary-foreground' : ''}
          >
            Ce trimestre
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPeriod('thisYear')}
            className={period === 'thisYear' ? 'bg-primary text-primary-foreground' : ''}
          >
            Cette année
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Revenus totaux" 
              value={`${dashboardData?.totalRevenue.toLocaleString()} €`} 
              icon={<ArrowUpRight className="text-green-500" size={24} />} 
              description={`Pour ${period === 'thisMonth' ? 'ce mois' : period === 'thisQuarter' ? 'ce trimestre' : 'cette année'}`}
            />
            <StatCard 
              title="Dépenses" 
              value={`${dashboardData?.totalExpenses.toLocaleString()} €`}
              icon={<ArrowDownRight className="text-red-500" size={24} />} 
              description={`Pour ${period === 'thisMonth' ? 'ce mois' : period === 'thisQuarter' ? 'ce trimestre' : 'cette année'}`}
            />
            <StatCard 
              title="Solde bancaire" 
              value={`${dashboardData?.bankBalance.toLocaleString()} €`}
              icon={<Euro className="text-blue-500" size={24} />} 
              description="Total des comptes" 
            />
            <StatCard 
              title="Factures impayées" 
              value={dashboardData?.openInvoices.toString() || "0"} 
              icon={
                <div className="relative">
                  <Receipt className="text-orange-500" size={24} />
                  {dashboardData && dashboardData.overdueInvoices > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {dashboardData.overdueInvoices}
                    </span>
                  )}
                </div>
              }
              description={dashboardData && dashboardData.overdueInvoices > 0 ? `Dont ${dashboardData.overdueInvoices} en retard` : 'Toutes à jour'}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenus et dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80" config={{}}>
                  <BarChart data={[...mockChartData, ...mockForecastData]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `${Math.round(value / 1000)}k€`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
                              <p className="font-semibold">{payload[0].payload.name}</p>
                              <p className="text-green-600">
                                Revenus: {payload[0].value?.toLocaleString()} €
                              </p>
                              <p className="text-red-600">
                                Dépenses: {payload[1].value?.toLocaleString()} €
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenus" 
                      fill="#16a34a" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="expenses" 
                      name="Dépenses" 
                      fill="#dc2626" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
                <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-200 mr-1"></div>
                    <span>Zone de prévisions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Prochaines échéances</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 text-orange-600 rounded">
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Facture #230045</p>
                          <p className="text-xs text-muted-foreground">Entr. ABC</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">3 200 €</p>
                        <p className="text-xs text-orange-600">Dans 2 jours</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Facture #230098</p>
                          <p className="text-xs text-muted-foreground">Client XY</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">1 800 €</p>
                        <p className="text-xs text-muted-foreground">Dans 8 jours</p>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-100 text-red-600 rounded">
                          <Wallet size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Loyer Bureau</p>
                          <p className="text-xs text-muted-foreground">Dépense</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">2 500 €</p>
                        <p className="text-xs text-muted-foreground">Dans 12 jours</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {dashboardData?.topClients.map(client => (
                      <li key={client.id} className="flex justify-between items-center">
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-sm font-semibold">{client.revenue.toLocaleString()} €</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList>
              <TabsTrigger value="transactions">Transactions récentes</TabsTrigger>
              <TabsTrigger value="invoices">Factures récentes</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTransactionsTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Factures récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentInvoicesTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AccountingDashboard;
