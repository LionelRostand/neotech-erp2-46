
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
import { 
  Eye, 
  Download, 
  Send, 
  CreditCard, 
  MoreHorizontal,
  Printer
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSalonBilling } from '../hooks/useSalonBilling';
import { InvoiceStatus } from '../../types/salon-types';

interface InvoicesListProps {
  searchTerm: string;
  onViewInvoice: (id: string) => void;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ searchTerm, onViewInvoice }) => {
  const { invoices, isLoadingInvoices, generatePdfInvoice } = useSalonBilling();
  
  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge for invoice
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Envoyée</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Payée</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">En retard</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate remaining amount to pay
  const getRemainingAmount = (invoice: any) => {
    const totalPaid = invoice.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
    return Math.max(0, invoice.total - totalPaid);
  };

  return (
    <div className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Reste à payer</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingInvoices ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Chargement des factures...
              </TableCell>
            </TableRow>
          ) : filteredInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucune facture trouvée
              </TableCell>
            </TableRow>
          ) : (
            filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-medium">
                  {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell>
                  {getRemainingAmount(invoice).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewInvoice(invoice.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => generatePdfInvoice(invoice.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewInvoice(invoice.id)}>
                          <Eye className="h-4 w-4 mr-2" /> Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generatePdfInvoice(invoice.id)}>
                          <Download className="h-4 w-4 mr-2" /> Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" /> Imprimer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {invoice.status !== 'paid' && (
                          <DropdownMenuItem onClick={() => onViewInvoice(invoice.id)}>
                            <CreditCard className="h-4 w-4 mr-2" /> Enregistrer un paiement
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" /> Envoyer au client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesList;
