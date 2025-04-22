
import React from 'react';
import { useFreightData } from '@/hooks/modules/useFreightData';
import { InvoicesTable } from '../../../accounting/components/InvoicesTable';
import { useInvoicesData } from '@/hooks/modules/useAccountingData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const FreightAccountingPage = () => {
  const { containers, shipments, clients } = useFreightData();
  const { invoices, isLoading } = useInvoicesData();

  // Filter and format invoices to include container and shipment info
  const enrichedInvoices = React.useMemo(() => {
    return invoices?.map(invoice => {
      const container = containers?.find(c => c.number === invoice.containerReference);
      const shipment = shipments?.find(s => s.reference === invoice.shipmentReference);
      const client = clients?.find(c => c.id === invoice.clientId);

      return {
        ...invoice,
        clientName: client?.name || container?.client || shipment?.customer || 'Inconnu',
        containerCost: container?.costs?.[0]?.amount || 0,
        shipmentStatus: shipment?.status || ''
      };
    }) || [];
  }, [invoices, containers, shipments, clients]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures Transport</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <InvoicesTable 
        invoices={enrichedInvoices}
        isLoading={isLoading}
        onView={(id) => console.log('View invoice:', id)}
        onEdit={(id) => console.log('Edit invoice:', id)}
        onDelete={(id) => console.log('Delete invoice:', id)}
        onPay={(id) => console.log('Pay invoice:', id)}
      />
    </div>
  );
};

export default FreightAccountingPage;
