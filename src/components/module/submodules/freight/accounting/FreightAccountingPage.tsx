
import React, { useState } from 'react';
import { useFreightData } from '@/hooks/modules/useFreightData';
import { InvoicesTable } from '@/components/module/submodules/accounting/components/InvoicesTable';
import { useAccountingData } from '@/hooks/modules/useAccountingData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateFreightInvoiceDialog } from './CreateFreightInvoiceDialog';
import { toast } from 'sonner';

const FreightAccountingPage = () => {
  const { containers, shipments, clients } = useFreightData();
  const { invoices, isLoading } = useAccountingData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter and format invoices to include container and shipment info
  const enrichedInvoices = React.useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) {
      console.log("No invoices data available:", invoices);
      return [];
    }
    
    return invoices.map(invoice => {
      const container = containers?.find(c => c.number === invoice.containerReference);
      const shipment = shipments?.find(s => s.reference === invoice.shipmentReference);
      const client = clients?.find(c => c.id === invoice.clientId);

      return {
        ...invoice,
        clientName: client?.name || invoice.clientName || container?.client || shipment?.customer || 'Inconnu',
        containerCost: container?.costs?.[0]?.amount || 0,
        shipmentStatus: shipment?.status || ''
      };
    });
  }, [invoices, containers, shipments, clients]);

  const handleCreateInvoice = (data: any) => {
    console.log('Creating invoice with data:', data);
    toast.success('Facture créée avec succès');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures Transport</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement des factures...</p>
        </div>
      ) : enrichedInvoices.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Aucune facture trouvée</h3>
          <p className="text-gray-500 mb-4">Créez une nouvelle facture pour commencer</p>
          <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Facture
          </Button>
        </div>
      ) : (
        <InvoicesTable 
          invoices={enrichedInvoices}
          isLoading={isLoading}
          onView={(id) => console.log('View invoice:', id)}
          onEdit={(id) => console.log('Edit invoice:', id)}
          onDelete={(id) => console.log('Delete invoice:', id)}
          onPay={(id) => console.log('Pay invoice:', id)}
        />
      )}

      <CreateFreightInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
};

export default FreightAccountingPage;
