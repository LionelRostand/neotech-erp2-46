
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
import { Eye, CreditCard, Landmark, Receipt } from "lucide-react";

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'check' | 'other';

interface Payment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
}

interface PaymentsListProps {
  searchTerm: string;
}

// Sample data
const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceNumber: 'FACT-2023-0001',
    clientName: 'Martin Dupont',
    date: '2023-07-15',
    amount: 780,
    method: 'stripe',
    status: 'completed',
    transactionId: 'ch_123456789'
  },
  {
    id: '2',
    invoiceNumber: 'FACT-2023-0002',
    clientName: 'Sophie Durand',
    date: '2023-07-20',
    amount: 1250,
    method: 'bank_transfer',
    status: 'pending'
  },
  {
    id: '3',
    invoiceNumber: 'FACT-2023-0006',
    clientName: 'Pierre Martin',
    date: '2023-07-18',
    amount: 920,
    method: 'stripe',
    status: 'failed',
    transactionId: 'ch_failed123'
  },
  {
    id: '4',
    invoiceNumber: 'FACT-2023-0007',
    clientName: 'Louise Petit',
    date: '2023-07-22',
    amount: 1450,
    method: 'paypal',
    status: 'completed',
    transactionId: 'PP-12345678'
  },
  {
    id: '5',
    invoiceNumber: 'FACT-2023-0008',
    clientName: 'Thomas Bernard',
    date: '2023-07-25',
    amount: 650,
    method: 'cash',
    status: 'completed'
  }
];

// Format currency in EUR
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Get a badge for payment status
const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Effectué</Badge>;
    case 'pending':
      return <Badge variant="outline">En attente</Badge>;
    case 'failed':
      return <Badge variant="destructive">Échoué</Badge>;
    case 'refunded':
      return <Badge variant="warning">Remboursé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Get an icon for payment method
const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case 'stripe':
    case 'paypal':
      return <CreditCard className="h-4 w-4 mr-2" />;
    case 'bank_transfer':
      return <Landmark className="h-4 w-4 mr-2" />;
    case 'cash':
    case 'check':
    case 'other':
      return <Receipt className="h-4 w-4 mr-2" />;
    default:
      return <CreditCard className="h-4 w-4 mr-2" />;
  }
};

// Get a display name for payment method
const getPaymentMethodName = (method: PaymentMethod) => {
  switch (method) {
    case 'stripe':
      return 'Carte bancaire (Stripe)';
    case 'paypal':
      return 'PayPal';
    case 'bank_transfer':
      return 'Virement bancaire';
    case 'cash':
      return 'Espèces';
    case 'check':
      return 'Chèque';
    case 'other':
      return 'Autre';
    default:
      return method;
  }
};

const PaymentsList: React.FC<PaymentsListProps> = ({ searchTerm }) => {
  // Filter payments based on search term
  const filteredPayments = mockPayments.filter(payment => 
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Facture</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>ID transaction</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucun paiement trouvé
              </TableCell>
            </TableRow>
          ) : (
            filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                <TableCell>{payment.clientName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(payment.method)}
                    {getPaymentMethodName(payment.method)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.transactionId || '-'}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsList;
