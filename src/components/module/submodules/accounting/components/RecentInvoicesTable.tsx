
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

// Données mockées pour le prototype
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FACT-2023-0001',
    clientId: 'client1',
    clientName: 'Entreprise ABC',
    issueDate: '2023-07-01',
    dueDate: '2023-07-31',
    status: 'sent',
    items: [],
    subtotal: 3500,
    taxAmount: 700,
    total: 4200,
    currency: 'EUR',
    createdAt: '2023-07-01T10:00:00',
    updatedAt: '2023-07-01T10:00:00',
    createdBy: 'user1'
  },
  {
    id: '2',
    number: 'FACT-2023-0002',
    clientId: 'client2',
    clientName: 'Société XYZ',
    issueDate: '2023-06-15',
    dueDate: '2023-07-15',
    status: 'paid',
    items: [],
    subtotal: 5500,
    taxAmount: 1100,
    total: 6600,
    currency: 'EUR',
    createdAt: '2023-06-15T14:30:00',
    updatedAt: '2023-06-20T09:15:00',
    createdBy: 'user1'
  },
  {
    id: '3',
    number: 'FACT-2023-0003',
    clientId: 'client3',
    clientName: 'Boutique 123',
    issueDate: '2023-06-30',
    dueDate: '2023-07-30',
    status: 'overdue',
    items: [],
    subtotal: 1800,
    taxAmount: 360,
    total: 2160,
    currency: 'EUR',
    createdAt: '2023-06-30T16:45:00',
    updatedAt: '2023-06-30T16:45:00',
    createdBy: 'user1'
  },
  {
    id: '4',
    number: 'FACT-2023-0004',
    clientId: 'client4',
    clientName: 'Client Premium',
    issueDate: '2023-07-05',
    dueDate: '2023-08-04',
    status: 'draft',
    items: [],
    subtotal: 4200,
    taxAmount: 840,
    total: 5040,
    currency: 'EUR',
    createdAt: '2023-07-05T11:20:00',
    updatedAt: '2023-07-05T11:20:00',
    createdBy: 'user1'
  },
  {
    id: '5',
    number: 'FACT-2023-0005',
    clientId: 'client5',
    clientName: 'Start-up Innovante',
    issueDate: '2023-07-10',
    dueDate: '2023-08-09',
    status: 'sent',
    items: [],
    subtotal: 3200,
    taxAmount: 640,
    total: 3840,
    currency: 'EUR',
    createdAt: '2023-07-10T09:05:00',
    updatedAt: '2023-07-10T09:05:00',
    createdBy: 'user1'
  }
];

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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const RecentInvoicesTable: React.FC = () => {
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
        {mockInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentInvoicesTable;
