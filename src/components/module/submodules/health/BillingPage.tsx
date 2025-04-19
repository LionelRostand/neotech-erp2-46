
import React, { useState } from 'react';
import { CreditCard, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AddBillDialog from './dialogs/AddBillDialog';

const BillingPage = () => {
  const { billing: invoices, patients, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get patient name for display
  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  // Search functionality
  const filteredInvoices = invoices?.filter(invoice => 
    getPatientName(invoice.patientId).toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.dueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: 'id',
      header: 'N° Facture',
      cell: ({ row }) => (
        <div className="font-medium">FAC-{row.original.id?.substring(0, 8).toUpperCase()}</div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date d\'émission',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.date), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.date;
        }
      }
    },
    {
      accessorKey: 'dueDate',
      header: 'Date d\'échéance',
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.dueDate), 'dd/MM/yyyy', { locale: fr });
        } catch (error) {
          return row.original.dueDate;
        }
      }
    },
    {
      accessorKey: 'patientId',
      header: 'Patient',
      cell: ({ row }) => (
        <div>{getPatientName(row.original.patientId)}</div>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Montant',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.total.toFixed(2)} €</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast.info("Affichage de la facture à implémenter");
            }}
          >
            Voir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Facturation
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher une facture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredInvoices}
          isLoading={isLoading}
          noDataText="Aucune facture trouvée"
          searchPlaceholder="Rechercher une facture..."
        />
      </Card>

      <AddBillDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default BillingPage;
