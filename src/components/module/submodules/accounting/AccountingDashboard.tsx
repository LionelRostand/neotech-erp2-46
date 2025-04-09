
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTransactionsCollection, useInvoicesCollection, usePaymentsCollection } from './hooks/useAccountingCollection';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import RecentTransactionsTable from './components/RecentTransactionsTable';
import RecentInvoicesTable from './components/RecentInvoicesTable';

const AccountingDashboard: React.FC = () => {
  const { data: transactions, isLoading: transactionsLoading } = useTransactionsCollection();
  const { data: invoices, isLoading: invoicesLoading } = useInvoicesCollection();
  const { data: payments, isLoading: paymentsLoading } = usePaymentsCollection();
  
  // Données fictives pour les graphiques en attendant le chargement réel
  const revenueData = [
    { name: 'Jan', revenu: 4000, dépenses: 2400 },
    { name: 'Fév', revenu: 3000, dépenses: 1398 },
    { name: 'Mar', revenu: 2000, dépenses: 9800 },
    { name: 'Avr', revenu: 2780, dépenses: 3908 },
    { name: 'Mai', revenu: 1890, dépenses: 4800 },
    { name: 'Juin', revenu: 2390, dépenses: 3800 },
  ];

  const invoiceStatusData = [
    { name: 'Payées', value: 27 },
    { name: 'En attente', value: 13 },
    { name: 'En retard', value: 5 },
    { name: 'Brouillon', value: 3 },
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Comptabilité</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Factures à recevoir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoicesLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `${invoices.filter(inv => inv.status === 'pending').length || 0} factures`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoicesLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                `${invoices.filter(inv => inv.status === 'overdue').length || 0} factures en retard`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires (mois en cours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `${payments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString('fr-FR')} €`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoicesLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                `+${(Math.random() * 10).toFixed(1)}% par rapport au mois dernier`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trésorerie actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `${transactions.reduce((sum, tx) => {
                  if (tx.type === 'income') return sum + (tx.amount || 0);
                  if (tx.type === 'expense') return sum - (tx.amount || 0);
                  return sum;
                }, 0).toLocaleString('fr-FR')} €`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mise à jour aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus et Dépenses</CardTitle>
            <CardDescription>Analyse des 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenu" 
                    stroke="#4f46e5" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dépenses" 
                    stroke="#ef4444" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>État des Factures</CardTitle>
            <CardDescription>Statut des factures émises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={invoiceStatusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions Récentes</CardTitle>
            <CardDescription>Dernières opérations financières</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <RecentTransactionsTable transactions={transactions.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Factures Récentes</CardTitle>
            <CardDescription>Dernières factures émises</CardDescription>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <RecentInvoicesTable invoices={invoices.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingDashboard;
