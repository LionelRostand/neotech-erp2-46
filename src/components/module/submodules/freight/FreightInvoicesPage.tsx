
import React, { useState } from 'react';
import useFreightInvoices from '@/hooks/modules/useFreightInvoices';
import { InvoicesTable } from './components/InvoicesTable';
import { toast } from 'sonner';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { ViewInvoiceDialog } from './components/ViewInvoiceDialog';
import { EditInvoiceDialog } from './components/EditInvoiceDialog';
import { DeleteInvoiceDialog } from './components/DeleteInvoiceDialog';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

export const FreightInvoicesPage = () => {
  const { invoices, isLoading, updateInvoice, refetchInvoices } = useFreightInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<FreightInvoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateInvoice(id, data);
      await refetchInvoices();
      toast.success('Facture mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, COLLECTIONS.FREIGHT.BILLING, id);
      await deleteDoc(docRef);
      await refetchInvoices();
      toast.success('Facture supprimée avec succès');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression de la facture');
    }
  };

  const handleView = (invoice: FreightInvoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleEdit = (invoice: FreightInvoice) => {
    setSelectedInvoice(invoice);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (invoice: FreightInvoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedInvoice) {
      await handleDelete(selectedInvoice.id);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Factures</h1>
      
      <InvoicesTable
        invoices={invoices}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {selectedInvoice && (
        <>
          <ViewInvoiceDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            invoice={selectedInvoice}
          />
          
          <EditInvoiceDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            invoice={selectedInvoice}
            onUpdate={handleUpdate}
          />
          
          <DeleteInvoiceDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            invoiceNumber={selectedInvoice.invoiceNumber || selectedInvoice.id}
          />
        </>
      )}
    </div>
  );
};

export default FreightInvoicesPage;
