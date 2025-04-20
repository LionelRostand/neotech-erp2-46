
import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import CreateInvoiceDialog from './billing/CreateInvoiceDialog';
import BillingInvoicesList from './billing/BillingInvoicesList';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const BillingManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  
  const { data: invoices = [] } = useQuery({
    queryKey: ['rentals', 'invoices'],
    queryFn: () => fetchCollectionData(COLLECTIONS.TRANSPORT.INVOICES)
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion de la Facturation</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <Card className="p-6">
        <BillingInvoicesList invoices={invoices} />
      </Card>

      <CreateInvoiceDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default BillingManagement;
