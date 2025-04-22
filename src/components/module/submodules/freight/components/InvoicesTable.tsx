
import React from 'react';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface InvoicesTableProps {
  invoices: FreightInvoice[];
  isLoading?: boolean;
  onView: (invoice: FreightInvoice) => void;
  onEdit: (invoice: FreightInvoice) => void;
  onDelete: (invoice: FreightInvoice) => void;
}

export const InvoicesTable = ({ 
  invoices, 
  isLoading = false, 
  onView, 
  onEdit, 
  onDelete 
}: InvoicesTableProps) => {
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
          row.original.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status === 'paid' ? 'Payée' : row.original.status}
        </span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'DATE',
      cell: ({ row }: any) => {
        const date = row.original.createdAt 
          ? new Date(row.original.createdAt).toLocaleDateString('fr-FR') 
          : 'N/A';
        return date;
      }
    },
    {
      accessorKey: 'actions',
      header: 'ACTIONS',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <DataTable 
      columns={columns} 
      data={invoices} 
      isLoading={isLoading}
      emptyMessage="Aucune facture disponible" 
    />
  );
};
