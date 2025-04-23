
import React, { useState } from 'react';
import useFreightInvoices from '@/hooks/modules/useFreightInvoices';
import { InvoicesTable } from './components/InvoicesTable';
import { toast } from 'sonner';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateFreightInvoiceDialog } from './invoices/CreateFreightInvoiceDialog';
import { InvoicePaymentDialog } from './invoices/InvoicePaymentDialog';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

export const FreightInvoicesPage = () => {
  const { invoices, isLoading, updateInvoice, refetchInvoices } = useFreightInvoices();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FreightInvoice | null>(null);

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

  const handleViewInvoice = (invoice: FreightInvoice) => {
    // Here you would handle viewing an invoice
    console.log('View invoice:', invoice);
  };

  const handlePayInvoice = (invoice: FreightInvoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentDialog(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>
      
      <InvoicesTable
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        onPayInvoice={handlePayInvoice}
        onDeleteInvoice={handleDelete}
      />

      <CreateFreightInvoiceDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <InvoicePaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default FreightInvoicesPage;
