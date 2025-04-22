
import React from 'react';
import useFreightInvoices from '@/hooks/modules/useFreightInvoices';
import { InvoicesTable } from './components/InvoicesTable';
import { toast } from 'sonner';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const FreightInvoicesPage = () => {
  const { invoices, isLoading, updateInvoice, refetchInvoices } = useFreightInvoices();

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateInvoice(id, data);
      await refetchInvoices();
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, COLLECTIONS.FREIGHT.BILLING, id);
      await deleteDoc(docRef);
      await refetchInvoices();
      toast.success('Facture supprimée avec succès');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression de la facture');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Factures</h1>
      
      <InvoicesTable
        invoices={invoices}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FreightInvoicesPage;
