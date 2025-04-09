
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
  FileText, 
  PlusCircle, 
  Eye, 
  Pencil, 
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useInvoices } from './hooks/useInvoices';
import { formatCurrency } from './utils/formatting';
import { Invoice } from './types/accounting-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import InvoiceFormDialog from './components/InvoiceFormDialog';
import InvoiceViewDialog from './components/InvoiceViewDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import * as XLSX from 'xlsx';

const InvoicesPage = () => {
  const { invoices, isLoading, reload } = useInvoices();
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCreateClick = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleViewClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInvoice) return;
    
    try {
      await invoicesCollection.remove(selectedInvoice.id);
      toast.success('Facture supprimée avec succès');
      reload();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error);
      toast.error('Impossible de supprimer la facture');
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      invoices.map(invoice => ({
        'Numéro': invoice.invoiceNumber,
        'Client': invoice.clientName,
        'Date d\'émission': invoice.issueDate,
        'Date d\'échéance': invoice.dueDate,
        'Montant HT': invoice.subtotal,
        'TVA': invoice.taxAmount,
        'Montant total': invoice.total,
        'Devise': invoice.currency,
        'Statut': invoice.status === 'paid' ? 'Payée' : 
                 invoice.status === 'draft' ? 'Brouillon' :
                 invoice.status === 'sent' ? 'Envoyée' :
                 invoice.status === 'overdue' ? 'En retard' : 'Annulée',
        'Date de création': invoice.createdAt,
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Factures");
    XLSX.writeFile(workbook, "Factures.xlsx");
    
    toast.success('Export des factures réussi');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'draft': return 'secondary';
      case 'sent': return 'warning';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  // Dialog close handlers
  const handleCloseViewDialog = () => {
    setIsViewOpen(false);
    setSelectedInvoice(null);
  };

  const handleCloseFormDialog = (success?: boolean) => {
    setIsFormOpen(false);
    setSelectedInvoice(null);
    if (success) {
      reload();
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Factures</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportToExcel}
            disabled={invoices.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/40">
          <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">Aucune facture</h3>
          <p className="text-muted-foreground">Commencez par créer une nouvelle facture.</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>{formatCurrency(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewClick(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(invoice)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(invoice)}
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
      <InvoiceFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseFormDialog}
        invoice={selectedInvoice}
        onSuccess={reload}
      />

      <InvoiceViewDialog
        open={isViewOpen}
        onOpenChange={handleCloseViewDialog}
        invoice={selectedInvoice}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={handleCloseDeleteDialog}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default InvoicesPage;
