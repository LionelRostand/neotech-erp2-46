
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateFreightInvoiceDialog from './CreateFreightInvoiceDialog';
import { InvoicesTable } from '@/components/module/submodules/accounting/components/InvoicesTable';
import { useInvoicesData } from '@/components/module/submodules/accounting/hooks/useInvoicesData';

const FreightInvoicesPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { invoices, isLoading } = useInvoicesData();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <InvoicesTable 
        invoices={invoices} 
        isLoading={isLoading}
      />

      <CreateFreightInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default FreightInvoicesPage;
