
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import AddClientDialog from '../dialogs/AddClientDialog';

const GarageClientsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const { clients, isLoading } = useGarageClients();

  const columns = [
    {
      header: "Nom",
      accessorKey: "lastName",
      cell: ({ row }) => (
        <div>
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Téléphone",
      accessorKey: "phone",
    },
    {
      header: "Véhicules",
      accessorKey: "vehicles",
      cell: ({ row }) => (
        <div>{row.original.vehicles?.length || 0}</div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
          description="Nombre total de clients"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Clients Actifs"
          value={clients.filter(c => c.status === 'active').length}
          description="Clients avec véhicules actifs"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Nouveaux Clients"
          value={clients.filter(c => {
            const date = new Date(c.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length}
          description="Ce mois-ci"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={clients}
          isLoading={isLoading}
        />
      </Card>

      <AddClientDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageClientsDashboard;
