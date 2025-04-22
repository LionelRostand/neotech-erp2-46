
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import CreateFreightInvoiceDialog from './CreateFreightInvoiceDialog';
import { DataTable } from '@/components/ui/data-table';
import { useFreightInvoices, FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency } from '@/lib/utils';

const FreightInvoicesPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { invoices, isLoading } = useFreightInvoices();

  const columns = [
    {
      header: "Client",
      accessorKey: "clientName",
    },
    {
      header: "Montant",
      accessorKey: "amount",
      cell: ({ row }: { row: { original: FreightInvoice } }) => (
        <span>{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      header: "Référence",
      cell: ({ row }: { row: { original: FreightInvoice } }) => (
        <span>
          {row.original.shipmentReference || row.original.containerNumber || "-"}
        </span>
      ),
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: { row: { original: FreightInvoice } }) => {
        const status = row.original.status;
        let statusType = "warning";
        let statusText = "En attente";
        
        if (status === "paid") {
          statusType = "success";
          statusText = "Payée";
        } else if (status === "cancelled") {
          statusType = "danger";
          statusText = "Annulée";
        }
        
        return <StatusBadge status={statusType}>{statusText}</StatusBadge>;
      },
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: FreightInvoice } }) => (
        <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      ),
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm">
        {!isLoading && invoices.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Aucune facture</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer une nouvelle facture.
            </p>
            <div className="mt-6">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Facture
              </Button>
            </div>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={invoices} 
            isLoading={isLoading}
            emptyMessage="Aucune facture trouvée"
          />
        )}
      </div>

      <CreateFreightInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default FreightInvoicesPage;
