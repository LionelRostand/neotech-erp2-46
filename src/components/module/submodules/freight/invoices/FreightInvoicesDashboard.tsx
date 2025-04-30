
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { Skeleton } from "@/components/ui/skeleton";

interface FreightInvoicesDashboardProps {
  invoices: FreightInvoice[];
  isLoading: boolean;
}

const FreightInvoicesDashboard: React.FC<FreightInvoicesDashboardProps> = ({
  invoices,
  isLoading
}) => {
  // Calculate statistics
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  
  const paidPercentage = totalInvoices ? (paidInvoices / totalInvoices) * 100 : 0;
  const pendingPercentage = totalInvoices ? (pendingInvoices / totalInvoices) * 100 : 0;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-[150px] rounded-xl" />
        <Skeleton className="h-[150px] rounded-xl" />
        <Skeleton className="h-[150px] rounded-xl" />
        <Skeleton className="h-[150px] rounded-xl" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvoices}</div>
          <div className="text-xs text-muted-foreground">
            Montant total: {totalAmount.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
          <div className="text-xs text-muted-foreground">
            Montant payé: {paidAmount.toLocaleString('fr-FR', {
              style: 'currency', 
              currency: 'EUR'
            })}
          </div>
          <Progress className="mt-2" value={paidPercentage} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{pendingInvoices}</div>
          <div className="text-xs text-muted-foreground">
            Montant en attente: {pendingAmount.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </div>
          <Progress className="mt-2" value={pendingPercentage} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Moyenne par facture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalInvoices 
              ? (totalAmount / totalInvoices).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2
                })
              : '0,00 €'}
          </div>
          <div className="text-xs text-muted-foreground">
            Basé sur les {totalInvoices} factures
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightInvoicesDashboard;
