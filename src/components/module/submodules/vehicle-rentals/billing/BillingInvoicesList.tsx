
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

interface BillingInvoicesListProps {
  invoices: Invoice[];
}

const BillingInvoicesList: React.FC<BillingInvoicesListProps> = ({ invoices }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Payée</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Date début</TableHead>
          <TableHead>Date fin</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date création</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Aucune facture trouvée
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{new Date(invoice.startDate).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{new Date(invoice.endDate).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{invoice.amount.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>{new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BillingInvoicesList;
