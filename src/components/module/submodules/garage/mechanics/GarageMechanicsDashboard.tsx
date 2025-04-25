
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { DataTable } from "@/components/ui/data-table";
import { UserCog, UserCheck, Clock, Ban } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

const GarageMechanicsDashboard = () => {
  const { data: mechanics = [], isLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData(`${COLLECTIONS.GARAGE.MECHANICS}`)
  });

  const availableMechanics = mechanics.filter(m => m.status === 'available');
  const busyMechanics = mechanics.filter(m => m.status === 'busy');
  const unavailableMechanics = mechanics.filter(m => m.status === 'unavailable');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'specialization',
      header: 'Spécialisation',
    },
    {
      accessorKey: 'experience',
      header: 'Expérience',
    },
    {
      accessorKey: 'currentTask',
      header: 'Tâche actuelle',
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        return status === 'available' ? 'Disponible' :
               status === 'busy' ? 'Occupé' :
               status === 'unavailable' ? 'Indisponible' : status;
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Mécaniciens</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Disponibles"
          value={availableMechanics.length.toString()}
          icon={<UserCheck className="h-4 w-4" />}
          description="Mécaniciens disponibles"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="Occupés"
          value={busyMechanics.length.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="En intervention"
          className="bg-yellow-50 hover:bg-yellow-100"
        />
        <StatCard
          title="Indisponibles"
          value={unavailableMechanics.length.toString()}
          icon={<Ban className="h-4 w-4" />}
          description="Absents ou en pause"
          className="bg-gray-50 hover:bg-gray-100"
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
    </div>
  );
};

export default GarageMechanicsDashboard;
