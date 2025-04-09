
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Calendar, Download, Trash, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from './utils/formatting';
import { usePaymentsData } from './hooks/usePaymentsData';
import { Payment } from './types/accounting-types';
import { Skeleton } from "@/components/ui/skeleton";
import PaymentViewDialog from './components/PaymentViewDialog';
import PaymentFormDialog from './components/PaymentFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { exportToExcel } from '@/utils/exportUtils';

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Firestore operations
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);
  
  // Récupération des données depuis Firestore
  const { payments, isLoading, error } = usePaymentsData(
    activeTab !== "all" ? activeTab : undefined
  );
  
  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsEditing(false);
    setFormDialogOpen(true);
  };
  
  const handleEditPayment = (payment: Payment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPayment(payment);
    setIsEditing(true);
    setFormDialogOpen(true);
  };
  
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };
  
  const handleDeletePayment = (payment: Payment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedPayment) return;
    
    try {
      await paymentsCollection.remove(selectedPayment.id);
      toast.success("Paiement supprimé avec succès");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du paiement");
    }
  };
  
  const handleExportPayments = () => {
    const dataToExport = payments.map(payment => ({
      'Référence': payment.invoiceId,
      'Date': formatDate(payment.date),
      'Montant': payment.amount,
      'Devise': payment.currency,
      'Méthode': getMethodName(payment.method),
      'Statut': getStatusText(payment.status),
      'Référence Transaction': payment.transactionId || '',
      'Notes': payment.notes || ''
    }));
    
    exportToExcel(dataToExport, 'Paiements', 'paiements_export');
    toast.success("Export réussi");
  };
  
  const handlePaymentFormSuccess = () => {
    setFormDialogOpen(false);
    // La liste se rafraîchira automatiquement grâce au hook usePaymentsData
  };
  
  // Fonctions utilitaires pour l'affichage
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Validé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return 'En attente';
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

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">Erreur lors du chargement des paiements: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Planifier
          </Button>
          <Button onClick={handleAddPayment}>
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
                <PaymentsTable 
                  payments={payments} 
                  onViewPayment={handleViewPayment}
                  onEditPayment={handleEditPayment}
                  onDeletePayment={handleDeletePayment}
                />
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
                  payments={payments} 
                  onViewPayment={handleViewPayment}
                  onEditPayment={handleEditPayment}
                  onDeletePayment={handleDeletePayment}
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
                  payments={payments} 
                  onViewPayment={handleViewPayment}
                  onEditPayment={handleEditPayment}
                  onDeletePayment={handleDeletePayment}
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
                  payments={payments} 
                  onViewPayment={handleViewPayment}
                  onEditPayment={handleEditPayment}
                  onDeletePayment={handleDeletePayment}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <PaymentViewDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
        payment={selectedPayment} 
      />
      
      <PaymentFormDialog 
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen} 
        payment={isEditing ? selectedPayment : null} 
        onSuccess={handlePaymentFormSuccess}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Supprimer le paiement"
        description="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée."
      />
    </div>
  );
};

interface PaymentsTableProps {
  payments: Payment[];
  onViewPayment: (payment: Payment) => void;
  onEditPayment: (payment: Payment, e?: React.MouseEvent) => void;
  onDeletePayment: (payment: Payment, e?: React.MouseEvent) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ 
  payments, 
  onViewPayment, 
  onEditPayment, 
  onDeletePayment 
}) => {
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
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onViewPayment(payment);
                  }}>
                    Voir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => onEditPayment(payment, e)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => onDeletePayment(payment, e)}>
                    <Trash className="h-4 w-4" />
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

export default PaymentsPage;
