
import React, { useState } from 'react';
import { Pill, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Inventory } from './types/health-types';
import { DataTable } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

const PharmacyPage: React.FC = () => {
  const { inventory, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter medications from inventory
  const medications = inventory?.filter(item => 
    item.category === 'medication' || 
    item.category === 'médicament'
  ) || [];

  // Search functionality
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nom du médicament',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantité',
      cell: ({ row }) => (
        <div>{row.original.quantity} {row.original.unit}</div>
      ),
    },
    {
      accessorKey: 'unitPrice',
      header: 'Prix unitaire',
      cell: ({ row }) => (
        <div>{row.original.unitPrice?.toFixed(2)} €</div>
      ),
    },
    {
      accessorKey: 'expiryDate',
      header: 'Date d\'expiration',
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
              toast.info("Gestion du stock à implémenter");
            }}
          >
            Gérer le stock
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          Pharmacie
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un médicament
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredMedications}
          isLoading={isLoading}
          noDataText="Aucun médicament trouvé"
          searchPlaceholder="Rechercher un médicament..."
        />
      </Card>
    </div>
  );
};

export default PharmacyPage;
