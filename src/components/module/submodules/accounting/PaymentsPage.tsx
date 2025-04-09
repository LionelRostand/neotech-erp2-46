
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from './utils/formatting';
import { usePaymentsData } from './hooks/usePaymentsData';
import { Payment } from './types/accounting-types';
import { Skeleton } from "@/components/ui/skeleton";
import PaymentViewDialog from './components/PaymentViewDialog';

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Récupération des données depuis Firestore
  const { payments, isLoading } = usePaymentsData();
  
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Planifier
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Paiement
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="completed">Complétés</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="failed">Échoués</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tous les paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <PaymentsTable payments={payments} onViewPayment={handleViewPayment} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Paiements complétés</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <PaymentsTable 
                  payments={payments.filter(p => p.status === 'completed')} 
                  onViewPayment={handleViewPayment}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Paiements en attente</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <PaymentsTable 
                  payments={payments.filter(p => p.status === 'pending')} 
                  onViewPayment={handleViewPayment}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Paiements échoués</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <PaymentsTable 
                  payments={payments.filter(p => p.status === 'failed')} 
                  onViewPayment={handleViewPayment}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PaymentViewDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        payment={selectedPayment} 
      />
    </div>
  );
};

interface PaymentsTableProps {
  payments: Payment[];
  onViewPayment: (payment: Payment) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onViewPayment }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Complété</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      case 'refunded':
        return <Badge variant="warning">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'stripe': return 'Carte de crédit';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      case 'check': return 'Chèque';
      case 'paypal': return 'PayPal';
      default: return method || 'Virement bancaire';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Facture</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Aucun paiement trouvé
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewPayment(payment)}>
              <TableCell className="font-medium">{payment.invoiceId}</TableCell>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
              <TableCell>{getMethodName(payment.method)}</TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onViewPayment(payment);
                }}>
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsPage;
