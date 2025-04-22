
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, CreditCard } from "lucide-react";
import CreateFreightInvoiceDialog from './CreateFreightInvoiceDialog';
import { PayFreightInvoiceDialog } from '../accounting/PayFreightInvoiceDialog';
import { DataTable } from '@/components/ui/data-table';
import { useFreightInvoices, FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { generateDocuments } from '../utils/documentGenerator';

const FreightInvoicesPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FreightInvoice | null>(null);
  const { invoices, isLoading, refetchInvoices, updateInvoice } = useFreightInvoices();

  const handlePayInvoice = (invoice: FreightInvoice) => {
    setSelectedInvoice(invoice);
    setShowPayDialog(true);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      if (!selectedInvoice) return;

      console.log('Processing payment for invoice:', selectedInvoice.id);
      
      // Update invoice status to paid
      await updateInvoice(selectedInvoice.id, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference
      });

      // Generate and save documents
      console.log('Generating documents for invoice:', selectedInvoice.invoiceNumber);
      await generateDocuments(selectedInvoice, paymentData);
      
      // Refresh the invoices list and show success message
      await refetchInvoices();
      toast.success('Paiement enregistré et documents générés avec succès');
      setShowPayDialog(false);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du traitement du paiement');
    }
  };

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
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: FreightInvoice } }) => (
        <div className="flex space-x-2">
          {row.original.status !== "paid" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePayInvoice(row.original)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payer
            </Button>
          )}
        </div>
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

      {selectedInvoice && (
        <PayFreightInvoiceDialog
          open={showPayDialog}
          onOpenChange={setShowPayDialog}
          invoice={selectedInvoice}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default FreightInvoicesPage;
