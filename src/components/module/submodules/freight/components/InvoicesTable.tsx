
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { ViewInvoiceDialog } from './ViewInvoiceDialog';
import { EditInvoiceDialog } from './EditInvoiceDialog';
import { DeleteInvoiceDialog } from './DeleteInvoiceDialog';

interface InvoicesTableProps {
  invoices: FreightInvoice[];
  onUpdate: (id: string, data: Partial<FreightInvoice>) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
}

export const InvoicesTable = ({ invoices, onUpdate, onDelete }: InvoicesTableProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<FreightInvoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handlePayInvoice = async (invoice: FreightInvoice) => {
    // Mark the invoice as paid
    const success = await onUpdate(invoice.id, { 
      status: 'paid',
      paidAt: new Date().toISOString(),
    });
    
    if (success) {
      // You might want to show a toast or some feedback here
      console.log("Invoice marked as paid:", invoice.id);
    }
  };

  const columns = [
    {
      accessorKey: 'clientName',
      header: 'CLIENT'
    },
    {
      accessorKey: 'amount',
      header: 'MONTANT',
      cell: ({ row }: any) => `${row.original.amount.toLocaleString('fr-FR')} €`
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'RÉFÉRENCE'
    },
    {
      accessorKey: 'status',
      header: 'STATUT',
      cell: ({ row }: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === 'paid' ? 'bg-green-100 text-green-800' : 
          row.original.status === 'pending' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.original.status === 'paid' ? 'Payée' : 
           row.original.status === 'pending' ? 'En attente' : 'Annulée'}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'DATE',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString('fr-FR')
    },
    {
      header: 'ACTIONS',
      cell: ({ row }: any) => {
        const invoice = row.original as FreightInvoice;
        const isPaid = invoice.status === 'paid';
        const isPending = invoice.status === 'pending';
        
        return (
          <div className="flex items-center gap-2">
            {isPaid && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePayInvoice(invoice)}
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <DataTable 
        columns={columns} 
        data={invoices} 
        isLoading={false}
        emptyMessage="Aucune facture trouvée"
      />

      {selectedInvoice && (
        <>
          <ViewInvoiceDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            invoice={selectedInvoice}
          />
          
          <EditInvoiceDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            invoice={selectedInvoice}
            onUpdate={onUpdate}
          />
          
          <DeleteInvoiceDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            invoiceNumber={selectedInvoice.invoiceNumber || selectedInvoice.id}
            onConfirm={() => onDelete(selectedInvoice.id)}
          />
        </>
      )}
    </>
  );
};
