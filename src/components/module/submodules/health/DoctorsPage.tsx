
import React, { useState } from 'react';
import { UserCog, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Doctor } from './types/health-types';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

const DoctorsPage: React.FC = () => {
  const { doctors, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Search functionality
  const filteredDoctors = doctors?.filter(doctor => 
    doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      key: 'lastName',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">
          Dr. {row.original.lastName} {row.original.firstName}
        </div>
      ),
    },
    {
      key: 'specialty',
      header: 'Spécialité',
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
          <UserCog className="h-6 w-6 text-primary" />
          Médecins
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Médecin
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un médecin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <DataTable
          title="Liste des médecins"
          data={filteredDoctors}
          columns={columns}
          className="w-full"
        />
      </Card>
    </div>
  );
};

export default DoctorsPage;
