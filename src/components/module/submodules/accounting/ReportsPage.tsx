
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useReportsData } from './hooks/useReportsData';
import { formatCurrency } from './utils/formatting';

// Custom tooltip component for financial data
const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
        <p className="text-sm font-medium">{`${prefix}${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip component for comparison charts
const ComparisonTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm" style={{ color: '#4f46e5' }}>
          {`Cette année: ${formatCurrency(payload[0]?.value || 0)}`}
        </p>
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          {`Année précédente: ${formatCurrency(payload[1]?.value || 0)}`}
        </p>
      </div>
    );
  }
  return null;
};

// Colors for pie charts
const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#8b5cf6', '#d946ef', '#ec4899'];

const ReportsPage: React.FC = () => {
  const { 
    monthlyRevenueData, 
    paymentMethodsData, 
    invoiceStatusData, 
    quarterlyComparisonData, 
    financialStats,
    isLoading 
  } = useReportsData();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Rapports Financiers</h1>
      
      {/* Financial stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenu Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatCurrency(financialStats.totalRevenue)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant payé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatCurrency(financialStats.totalPaid)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant dû
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatCurrency(financialStats.totalDue)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Facture moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatCurrency(financialStats.averageInvoice)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content with tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
        </TabsList>
        
        {/* Revenue tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenus Mensuels</CardTitle>
              <CardDescription>Revenus générés par mois pour l'année en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenus"
                        stroke="#4f46e5"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut des Factures</CardTitle>
              <CardDescription>Répartition des factures par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => Number(value).toLocaleString('fr-FR')} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de Paiement</CardTitle>
              <CardDescription>Répartition des paiements par méthode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => Number(value).toLocaleString('fr-FR')} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comparison tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison Trimestrielle</CardTitle>
              <CardDescription>Revenus par trimestre (année courante vs année précédente)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quarterlyComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<ComparisonTooltip />} />
                      <Legend />
                      <Bar dataKey="current" name="Cette année" fill="#4f46e5" />
                      <Bar dataKey="previous" name="Année précédente" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
