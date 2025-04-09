
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown } from 'lucide-react';
import { usePaymentsCollection } from './hooks/useAccountingCollection';
import { Skeleton } from "@/components/ui/skeleton";
import { Payment } from './types/accounting-types';
import { formatCurrency } from './utils/formatting';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: payments, isLoading } = usePaymentsCollection();

  const filteredPayments = searchTerm 
    ? payments.filter(payment => 
        payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : payments;

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe': return '💳';
      case 'bank_transfer': return '🏦';
      case 'cash': return '💵';
      case 'check': return '📝';
      case 'paypal': return 'PayPal';
      default: return '💰';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex space-x-2">
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Paiement
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de facture ou transaction..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucun paiement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment: Payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date || 'N/A'}</TableCell>
                      <TableCell className="font-medium">{payment.invoiceId || 'N/A'}</TableCell>
                      <TableCell>{payment.transactionId || 'N/A'}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <span className="mr-2">{getMethodIcon(payment.method || '')}</span>
                          {payment.method === 'stripe' && 'Carte de crédit'}
                          {payment.method === 'bank_transfer' && 'Virement bancaire'}
                          {payment.method === 'cash' && 'Espèces'}
                          {payment.method === 'check' && 'Chèque'}
                          {payment.method === 'paypal' && 'PayPal'}
                          {!payment.method && 'Virement bancaire'}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount || 0, payment.currency || 'EUR')}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === 'completed' ? 'success' : (payment.status === 'pending' ? 'outline' : 'destructive')}>
                          {payment.status === 'completed' && 'Validé'}
                          {payment.status === 'pending' && 'En attente'}
                          {payment.status === 'failed' && 'Échoué'}
                          {!payment.status && 'En attente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
