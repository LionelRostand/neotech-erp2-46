import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { DataTable } from "@/components/ui/data-table";
import { Wrench, Clock, CheckCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

const GarageServicesDashboard = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.SERVICES)
  });

  const activeServices = services.filter(s => s.status === 'active');
  const pendingServices = services.filter(s => s.status === 'pending');
  const completedServices = services.filter(s => s.status === 'completed');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Service',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'duration',
      header: 'Durée',
    },
    {
      accessorKey: 'price',
      header: 'Prix',
      cell: ({ row }) => `${row.original.price} €`,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        return status === 'active' ? 'Actif' :
               status === 'pending' ? 'En attente' :
               status === 'completed' ? 'Terminé' : status;
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Services actifs"
          value={activeServices.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Services en cours"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En attente"
          value={pendingServices.length.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="Services à traiter"
          className="bg-yellow-50 hover:bg-yellow-100"
        />
        <StatCard
          title="Terminés"
          value={completedServices.length.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Services complétés"
          className="bg-green-50 hover:bg-green-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={services}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageServicesDashboard;
