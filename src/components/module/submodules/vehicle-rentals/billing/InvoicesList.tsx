
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
import { Eye, Download, Send, MoreHorizontal } from "lucide-react";

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  reservationId: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: InvoiceStatus;
}

interface InvoicesListProps {
  searchTerm: string;
}

// Sample data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FACT-2023-0001',
    clientName: 'Martin Dupont',
    reservationId: 'RES-001',
    issueDate: '2023-07-01',
    dueDate: '2023-07-31',
    total: 780,
    status: 'paid'
  },
  {
    id: '2',
    number: 'FACT-2023-0002',
    clientName: 'Sophie Durand',
    reservationId: 'RES-002',
    issueDate: '2023-07-05',
    dueDate: '2023-08-05',
    total: 1250,
    status: 'sent'
  },
  {
    id: '3',
    number: 'FACT-2023-0003',
    clientName: 'Entreprise ABC',
    reservationId: 'RES-003',
    issueDate: '2023-07-10',
    dueDate: '2023-08-09',
    total: 2150,
    status: 'overdue'
  },
  {
    id: '4',
    number: 'FACT-2023-0004',
    clientName: 'Jean Lefebvre',
    reservationId: 'RES-004',
    issueDate: '2023-07-15',
    dueDate: '2023-08-14',
    total: 950,
    status: 'sent'
  },
  {
    id: '5',
    number: 'FACT-2023-0005',
    clientName: 'Marie Robert',
    reservationId: 'RES-005',
    issueDate: '2023-07-20',
    dueDate: '2023-08-19',
    total: 1680,
    status: 'draft'
  }
];

// Format currency in EUR
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Get a badge for invoice status
const getStatusBadge = (status: InvoiceStatus) => {
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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const InvoicesList: React.FC<InvoicesListProps> = ({ searchTerm }) => {
  // Filter invoices based on search term
  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.reservationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Réservation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length === 0 ? (
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
                <TableCell>{invoice.reservationId}</TableCell>
                <TableCell>{new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
