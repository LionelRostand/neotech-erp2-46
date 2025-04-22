
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInvoicesData } from './hooks/useInvoicesData';
import { InvoicesTable } from './components/InvoicesTable';
import CreateInvoiceDialog from './components/CreateInvoiceDialog';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Invoice } from './types/accounting-types';

export const InvoicesPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { invoices, isLoading, error } = useInvoicesData();

  const handleCreateInvoice = async (data: Partial<Invoice>) => {
    try {
      await addDoc(collection(db, COLLECTIONS.ACCOUNTING.INVOICES), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      toast.success('Facture créée avec succès');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <InvoicesTable invoices={invoices} isLoading={isLoading} />

      <CreateInvoiceDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
};

export default InvoicesPage;
