
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAccountingData } from '@/hooks/modules/useAccountingData';
import { formatCurrency, formatDate } from './utils/formatting';
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AreaChart, BarChart, Calendar } from "lucide-react";

const AccountingDashboard: React.FC = () => {
  const { invoices, payments, transactions, isLoading, error } = useAccountingData();

  // Calculer les statistiques
  const totalUnpaidInvoices = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);
    
  const totalPaidInvoices = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);
    
  const totalReceivedPayments = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord comptable</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Factures à payer</CardDescription>
            <CardTitle className="text-2xl text-amber-500">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalUnpaidInvoices, 'EUR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length} factures en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus du mois</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalReceivedPayments, 'EUR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {payments.filter(p => p.status === 'completed').length} paiements reçus
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Factures payées</CardDescription>
            <CardTitle className="text-2xl text-blue-500">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalPaidInvoices, 'EUR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {invoices.filter(inv => inv.status === 'paid').length} factures réglées
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AreaChart className="h-5 w-5" />
              <span>Flux de trésorerie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                "Graphique de flux de trésorerie (À implémenter)"
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Revenus vs Dépenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                "Graphique revenus/dépenses (À implémenter)"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dernières transactions */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Dernières activités</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...invoices.map(inv => ({
                    id: inv.id,
                    date: inv.issueDate || '',
                    type: 'Facture',
                    description: `Facture ${inv.invoiceNumber} - ${inv.clientName}`,
                    amount: inv.total || 0,
                    status: inv.status
                  })), ...payments.map(payment => ({
                    id: payment.id,
                    date: payment.date,
                    type: 'Paiement',
                    description: `Paiement pour facture ${payment.invoiceId}`,
                    amount: payment.amount,
                    status: payment.status
                  }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell className="font-medium">{activity.description}</TableCell>
                      <TableCell>{formatCurrency(activity.amount, 'EUR')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          activity.status === 'paid' || activity.status === 'completed' ? 'success' :
                          activity.status === 'pending' ? 'outline' :
                          activity.status === 'overdue' || activity.status === 'failed' ? 'destructive' :
                          'secondary'
                        }>
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingDashboard;
