
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, XCircle, CreditCard } from 'lucide-react';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface InvoicesTableProps {
  invoices: FreightInvoice[];
  onViewInvoice: (invoice: FreightInvoice) => void;
  onPayInvoice: (invoice: FreightInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

const getStatusBadge = (status: string | undefined) => {
  // Ensure we have a valid status to prevent issues
  const safeStatus = status || 'pending';
  
  switch (safeStatus.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
    case 'paid':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Payée</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Annulée</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ 
  invoices, 
  onViewInvoice, 
  onPayInvoice, 
  onDeleteInvoice 
}) => {
  return (
    <Table>
      <TableCaption>Liste des factures</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Colis (Expédition)</TableHead>
          <TableHead>Conteneur</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">Aucune facture trouvée</TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.invoiceNumber || "-"}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{invoice.shipmentReference || "-"}</TableCell>
              <TableCell>{invoice.containerNumber || "-"}</TableCell>
              <TableCell className="text-right">
                {invoice.amount ? invoice.amount.toLocaleString('fr-FR') : "0"} {invoice.currency || "EUR"}
              </TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('fr-FR') : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onViewInvoice(invoice)}
                    title="Voir la facture"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>                
                  {invoice.status !== 'paid' && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onPayInvoice(invoice)}
                      title="Enregistrer un paiement"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}                
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDeleteInvoice(invoice.id)}
                    title="Supprimer la facture"
                  >
                    <XCircle className="h-4 w-4" />
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
