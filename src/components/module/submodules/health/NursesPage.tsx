
import React, { useState } from 'react';
import { Clipboard, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Staff } from './types/health-types';
import DataTable from '@/components/DataTable';
import { toast } from 'sonner';
import StatusBadge from '@/components/StatusBadge';

const NursesPage: React.FC = () => {
  const { staff, isLoading } = useHealthData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter only nursing staff
  const nurses = staff?.filter(s => 
    s.role === 'nurse' || 
    s.role === 'infirmier' || 
    s.role === 'infirmière' || 
    s.department?.toLowerCase().includes('infirm')
  ) || [];

  const columns = [
    {
      key: 'lastName',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.lastName} {row.original.firstName}
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Service',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Téléphone',
    },
    {
      key: 'status',
      header: 'Statut',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status}>{row.original.status}</StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast.info("Affichage des détails à implémenter");
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
          <Users className="h-6 w-6 text-primary" />
          Infirmiers
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Infirmier
        </Button>
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          title="Liste des infirmiers"
          data={nurses}
          columns={columns}
          className="w-full"
        />
      </Card>
    </div>
  );
};

export default NursesPage;
