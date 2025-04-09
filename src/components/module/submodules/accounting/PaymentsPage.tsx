
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  CreditCard, 
  PlusCircle, 
  Eye, 
  Pencil, 
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { usePayments } from './hooks/usePayments';
import { formatCurrency } from './utils/formatting';
import { Payment } from './types/accounting-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import PaymentFormDialog from './components/PaymentFormDialog';
import PaymentViewDialog from './components/PaymentViewDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import * as XLSX from 'xlsx';

const PaymentsPage = () => {
  const { payments, isLoading, reload } = usePayments();
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleCreateClick = () => {
    setSelectedPayment(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsFormOpen(true);
  };

  const handleViewClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPayment) return;
    
    try {
      await paymentsCollection.remove(selectedPayment.id);
      toast.success('Paiement supprimé avec succès');
      reload();
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      toast.error('Impossible de supprimer le paiement');
    }
    
    setIsDeleteOpen(false);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      payments.map(payment => ({
        'Facture': payment.invoiceId,
        'Montant': payment.amount,
        'Devise': payment.currency,
        'Date': payment.date,
        'Méthode': payment.method === 'bank_transfer' ? 'Virement bancaire' :
                  payment.method === 'cash' ? 'Espèces' :
                  payment.method === 'check' ? 'Chèque' :
                  payment.method === 'stripe' ? 'Carte de crédit' :
                  payment.method === 'paypal' ? 'PayPal' : payment.method,
        'Statut': payment.status === 'completed' ? 'Validé' :
                 payment.status === 'pending' ? 'En attente' :
                 payment.status === 'failed' ? 'Échoué' :
                 payment.status === 'refunded' ? 'Remboursé' : payment.status,
        'ID de transaction': payment.transactionId,
        'Date de création': payment.createdAt,
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements");
    XLSX.writeFile(workbook, "Paiements.xlsx");
    
    toast.success('Export des paiements réussi');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'destructive';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Validé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      case 'check': return 'Chèque';
      case 'stripe': return 'Carte de crédit';
      case 'paypal': return 'PayPal';
      default: return method;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paiements</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportToExcel}
            disabled={payments.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/40">
          <CreditCard className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">Aucun paiement</h3>
          <p className="text-muted-foreground">Commencez par enregistrer un nouveau paiement.</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.invoiceId}</TableCell>
                  <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{getMethodText(payment.method)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewClick(payment)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(payment)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(payment)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogs */}
      <PaymentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        payment={selectedPayment}
        onSuccess={reload}
      />

      <PaymentViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        payment={selectedPayment}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le paiement"
        description="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PaymentsPage;
