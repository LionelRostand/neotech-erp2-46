
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

const VehiclesTable: React.FC<VehiclesTableProps> = ({ vehicles }) => {
  const columns = [
    {
      header: "Marque / Modèle",
      accessorKey: "make",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.make}</div>
          <div className="text-sm text-gray-500">{row.original.model}</div>
        </div>
      ),
    },
    {
      header: "Plaque",
      accessorKey: "licensePlate",
    },
    {
      header: "Kilométrage",
      accessorKey: "mileage",
      cell: ({ row }) => row.original.mileage?.toLocaleString() + " km",
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={
              status === 'active' ? 'bg-green-100 text-green-800' :
              status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
              status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }
          >
            {status === 'active' ? 'Actif' :
             status === 'maintenance' ? 'En maintenance' :
             status === 'inactive' ? 'Inactif' :
             'En réservation'}
          </Badge>
        );
      },
    },
    {
      header: "Dernière révision",
      accessorKey: "lastService",
      cell: ({ row }) => row.original.lastService ? new Date(row.original.lastService).toLocaleDateString() : '-',
    },
    {
      header: "Prochaine révision",
      accessorKey: "nextService",
      cell: ({ row }) => {
        if (!row.original.nextService) return '-';
        const nextService = new Date(row.original.nextService);
        const today = new Date();
        const isOverdue = nextService <= today;
        
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {nextService.toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      isLoading={false}
      emptyMessage="Aucun véhicule trouvé"
    />
  );
};

export default VehiclesTable;
