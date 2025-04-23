
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, CreditCard, FileText } from 'lucide-react';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface InvoicesTableProps {
  invoices: FreightInvoice[];
  onViewInvoice: (invoice: FreightInvoice) => void;
  onPayInvoice: (invoice: FreightInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  onViewInvoice,
  onPayInvoice,
  onDeleteInvoice
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderReference = (invoice: FreightInvoice) => {
    if (invoice.shipmentReference) {
      return (
        <div className="flex flex-col">
          <span className="font-medium">Colis:</span>
          <Badge variant="outline">{invoice.shipmentReference}</Badge>
        </div>
      );
    }
    if (invoice.containerNumber) {
      return (
        <div className="flex flex-col">
          <span className="font-medium">Conteneur:</span>
          <Badge variant="outline">{invoice.containerNumber}</Badge>
        </div>
      );
    }
    return <span className="text-muted-foreground">-</span>;
  };

  return (
    <Table>
      <TableCaption>Liste des factures</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Référence</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              Aucune facture trouvée
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber || invoice.id.substring(0, 8)}</TableCell>
              <TableCell>{renderReference(invoice)}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{invoice.amount.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>{new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewInvoice(invoice)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {invoice.status !== 'paid' && (
                    <Button variant="ghost" size="icon" onClick={() => onPayInvoice(invoice)}>
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="icon" onClick={() => onDeleteInvoice(invoice.id)}>
                    <Trash2 className="h-4 w-4" />
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
