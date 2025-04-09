
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '../utils/formatting';
import { Eye, Download } from 'lucide-react';
import { Invoice } from '../types/accounting-types';

interface RecentInvoicesTableProps {
  invoices: Invoice[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Brouillon</Badge>;
    case 'sent':
      return <Badge variant="secondary">Envoyée</Badge>;
    case 'paid':
      return <Badge variant="success">Payée</Badge>;
    case 'overdue':
      return <Badge variant="destructive">En retard</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Annulée</Badge>;
    case 'pending':
      return <Badge variant="secondary">En attente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const RecentInvoicesTable: React.FC<RecentInvoicesTableProps> = ({ invoices }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Échéance</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Aucune facture récente
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber || invoice.number}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{formatCurrency(invoice.total, invoice.currency)}</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RecentInvoicesTable;
