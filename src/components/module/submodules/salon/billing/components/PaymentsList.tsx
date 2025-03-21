
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
  CreditCard, 
  Receipt, 
  Smartphone,
  Gift,
  ArrowRightLeft
} from "lucide-react";
import { useSalonBilling } from '../hooks/useSalonBilling';
import { PaymentMethod } from '../../types/salon-types';

interface PaymentsListProps {
  searchTerm: string;
}

const PaymentsList: React.FC<PaymentsListProps> = ({ searchTerm }) => {
  const { invoices, isLoadingInvoices } = useSalonBilling();
  
  // Extract all payments from invoices
  const allPayments = invoices.flatMap(invoice => 
    invoice.payments.map(payment => ({
      ...payment,
      invoiceNumber: invoice.number,
      clientName: invoice.clientName
    }))
  );
  
  // Filter payments based on search term
  const filteredPayments = allPayments.filter(payment => 
    payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon for payment method
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'cash':
        return <Receipt className="h-4 w-4 mr-2" />;
      case 'mobile_payment':
        return <Smartphone className="h-4 w-4 mr-2" />;
      case 'gift_card':
        return <Gift className="h-4 w-4 mr-2" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 mr-2" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };

  // Get display name for payment method
  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      case 'mobile_payment':
        return 'Paiement mobile';
      case 'gift_card':
        return 'Carte cadeau';
      case 'transfer':
        return 'Virement';
      default:
        return method;
    }
  };

  // Get badge for payment status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complété</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Échoué</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
            <TableHead>Référence</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingInvoices ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Chargement des paiements...
              </TableCell>
            </TableRow>
          ) : filteredPayments.length === 0 ? (
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
                <TableCell className="font-medium">
                  {payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.reference || '-'}
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
