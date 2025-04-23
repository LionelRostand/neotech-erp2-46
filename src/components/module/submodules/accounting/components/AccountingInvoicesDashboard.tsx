
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeEuro, BadgeDollarSign, FileText } from "lucide-react";
import { Invoice } from "../types/accounting-types";
import { formatCurrency } from "../utils/formatting";

interface DashboardProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const statusLabels: Record<string, string> = {
  paid: "Payée",
  pending: "En attente",
  overdue: "En retard",
  draft: "Brouillon",
  sent: "Envoyée",
  cancelled: "Annulée"
};

const AccountingInvoicesDashboard: React.FC<DashboardProps> = ({ invoices, isLoading }) => {
  const total = invoices.length;
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.total || 0), 0);
  const overdue = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <FileText className="text-blue-700" size={28} />
          <CardTitle className="text-lg">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : total}</div>
          <CardDescription className="text-muted-foreground">Factures créées</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <BadgeEuro className="text-green-700" size={28} />
          <CardTitle className="text-lg">Payées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{isLoading ? "…" : formatCurrency(totalPaid, "EUR")}</div>
          <CardDescription className="text-muted-foreground">Montant payé</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <BadgeDollarSign className="text-yellow-700" size={28} />
          <CardTitle className="text-lg">En attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{isLoading ? "…" : formatCurrency(totalPending, "EUR")}</div>
          <CardDescription className="text-muted-foreground">Montant en attente</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <FileText className="text-red-700" size={28} />
          <CardTitle className="text-lg">En retard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : overdue}</div>
          <CardDescription className="text-muted-foreground">Factures en retard</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountingInvoicesDashboard;
