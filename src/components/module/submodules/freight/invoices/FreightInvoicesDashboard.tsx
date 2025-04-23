
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FileText, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface DashboardProps {
  invoices: FreightInvoice[];
  isLoading: boolean;
}

const FreightInvoicesDashboard: React.FC<DashboardProps> = ({ invoices, isLoading }) => {
  const total = invoices.length;
  const totalPaid = invoices.filter(inv => inv.status === 'paid').length;
  const totalPending = invoices.filter(inv => inv.status === 'pending').length;
  const totalCancelled = invoices.filter(inv => inv.status === 'cancelled').length;

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <FileText className="text-blue-700" size={28} />
          <CardTitle className="text-lg">Total Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : total}</div>
          <CardDescription className="text-muted-foreground">Nombre total de factures</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CreditCard className="text-green-700" size={28} />
          <CardTitle className="text-lg">Montant Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : totalAmount.toLocaleString()} €</div>
          <CardDescription className="text-muted-foreground">Valeur totale des factures</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CheckCircle className="text-emerald-700" size={28} />
          <CardTitle className="text-lg">Payées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : totalPaid}</div>
          <CardDescription className="text-muted-foreground">{paidAmount.toLocaleString()} € payés</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <XCircle className="text-red-700" size={28} />
          <CardTitle className="text-lg">En attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : totalPending}</div>
          <CardDescription className="text-muted-foreground">Factures en attente</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightInvoicesDashboard;
