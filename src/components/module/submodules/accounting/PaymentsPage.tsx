
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { usePayments } from './hooks/usePayments';
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
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';
import PaymentFormDialog from './components/PaymentFormDialog';
import PaymentViewDialog from './components/PaymentViewDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { payments, isLoading, reload } = usePayments();
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const filteredPayments = searchTerm 
    ? payments.filter(payment => 
        payment.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : payments;

  const handleOpenCreateForm = () => {
    setSelectedPayment(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenViewDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;
    
    try {
      await paymentsCollection.deleteDoc(selectedPayment.id);
      toast.success('Paiement supprimé avec succès');
      reload();
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      toast.error('Erreur lors de la suppression du paiement');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExportToExcel = () => {
    if (filteredPayments.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    // Format data for export
    const dataToExport = filteredPayments.map(payment => ({
      'Date': payment.date || 'N/A',
      'Numéro de facture': payment.invoiceId || 'N/A',
      'ID Transaction': payment.transactionId || 'N/A',
      'Méthode': getMethodName(payment.method || ''),
      'Montant': formatCurrency(payment.amount || 0, payment.currency || 'EUR'),
      'Statut': getStatusText(payment.status || ''),
      'Notes': payment.notes || '',
      'Créé le': payment.createdAt || '',
      'Modifié le': payment.updatedAt || '',
    }));
    
    const success = exportToExcel(dataToExport, 'Paiements', 'paiements');
    if (success) {
      toast.success('Les paiements ont été exportés avec succès');
    } else {
      toast.error('Erreur lors de l\'exportation des paiements');
    }
  };

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

  const getMethodName = (method: string) => {
    switch (method) {
      case 'stripe': return 'Carte de crédit';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      case 'check': return 'Chèque';
      case 'paypal': return 'PayPal';
      default: return 'Virement bancaire';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Validé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return 'En attente';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex space-x-2">
          <Button onClick={handleExportToExcel}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleOpenCreateForm}>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
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
                          {getMethodName(payment.method || '')}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount || 0, payment.currency || 'EUR')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          payment.status === 'completed' ? 'success' : 
                          payment.status === 'pending' ? 'outline' : 
                          payment.status === 'refunded' ? 'warning' :
                          'destructive'
                        }>
                          {getStatusText(payment.status || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenViewDialog(payment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditForm(payment)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(payment)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Form Dialog */}
      <PaymentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        payment={selectedPayment}
        mode={formMode}
        onSuccess={reload}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeletePayment}
        title="Supprimer le paiement"
        description="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
      />

      {/* View Payment Dialog */}
      <PaymentViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsPage;
