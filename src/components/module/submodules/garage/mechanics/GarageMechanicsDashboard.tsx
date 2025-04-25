
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { DataTable } from "@/components/ui/data-table";
import { UserCog, Clock, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { AddMechanicDialog } from './AddMechanicDialog';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

const GarageMechanicsDashboard = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const { data: mechanics = [], isLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS)
  });

  // Filter mechanics by status
  const availableMechanics = mechanics.filter(m => m.status === 'available' || m.status === 'Disponible');
  const busyMechanics = mechanics.filter(m => m.status === 'in_service' || m.status === 'busy');
  const onBreakMechanics = mechanics.filter(m => m.status === 'on_break' || m.status === 'onBreak');

  const columns = [
    {
      accessorKey: 'firstName',
      header: 'Prénom',
    },
    {
      accessorKey: 'lastName',
      header: 'Nom',
    },
    {
      accessorFn: (row: Mechanic) => (row.specialization || []).join(', '),
      header: 'Spécialisation',
    },
    {
      accessorKey: 'phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        return status === 'available' ? 'Disponible' :
               status === 'in_service' || status === 'busy' ? 'Occupé' :
               status === 'on_break' || status === 'onBreak' ? 'En pause' : status;
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Mécaniciens</h2>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un mécanicien
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Disponibles"
          value={availableMechanics.length.toString()}
          icon={<UserCog className="h-4 w-4" />}
          description="Mécaniciens disponibles"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="En service"
          value={busyMechanics.length.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Mécaniciens occupés"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En pause"
          value={onBreakMechanics.length.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Mécaniciens en pause"
          className="bg-yellow-50 hover:bg-yellow-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des mécaniciens</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={mechanics}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AddMechanicDialog 
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
      />
    </div>
  );
};

export default GarageMechanicsDashboard;
