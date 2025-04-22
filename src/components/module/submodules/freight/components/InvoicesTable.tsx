
import React, { useState } from 'react';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
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

  const columns = [
    {
      accessorKey: 'clientName',
      header: 'Client'
    },
    {
      accessorKey: 'amount',
      header: 'Montant',
      cell: ({ row }: any) => `${row.original.amount.toLocaleString('fr-FR')} €`
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Référence'
    },
    {
      accessorKey: 'status',
      header: 'Statut'
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedInvoice(row.original);
              setViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedInvoice(row.original);
              setEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedInvoice(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleDelete = async () => {
    if (selectedInvoice) {
      await onDelete(selectedInvoice.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DataTable columns={columns} data={invoices} />

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
            onConfirm={handleDelete}
            invoiceNumber={selectedInvoice.invoiceNumber || selectedInvoice.id}
          />
        </>
      )}
    </>
  );
};
