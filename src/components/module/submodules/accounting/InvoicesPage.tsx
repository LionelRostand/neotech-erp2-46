
import React, { useState } from 'react';
import { useInvoicesData } from './hooks/useInvoicesData';
import { InvoicesTable } from './components/InvoicesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateInvoiceDialog from './components/CreateInvoiceDialog';

export const InvoicesPage = () => {
  const { invoices, isLoading, error } = useInvoicesData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleViewInvoice = (id: string) => {
    console.log('View invoice:', id);
  };

  const handleEditInvoice = (id: string) => {
    console.log('Edit invoice:', id);
  };

  const handleDeleteInvoice = (id: string) => {
    console.log('Delete invoice:', id);
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

      <InvoicesTable 
        invoices={invoices} 
        isLoading={isLoading} 
        onView={handleViewInvoice}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
      />

      <CreateInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default InvoicesPage;
