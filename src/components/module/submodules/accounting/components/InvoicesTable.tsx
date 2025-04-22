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
import { Edit, Trash2, Eye } from 'lucide-react';
import { Invoice } from '../types/accounting-types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '../utils/formatting';

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  isLoading,
  onView,
  onEdit,
  onDelete
}) => {
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
        return <Badge>Annulée</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Liste des factures</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Conteneur</TableHead>
          <TableHead>Expédition</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.number || invoice.invoiceNumber}</TableCell>
            <TableCell>
              {invoice.containerReference && (
                <Badge variant="outline">{invoice.containerReference}</Badge>
              )}
            </TableCell>
            <TableCell>
              {invoice.shipmentReference && (
                <Badge variant="outline">{invoice.shipmentReference}</Badge>
              )}
            </TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>{invoice.issueDate}</TableCell>
            <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
            <TableCell>
              <Badge>{invoice.status}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {onView && (
                  <Button variant="ghost" size="sm" onClick={() => onView(invoice.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(invoice.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(invoice.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
