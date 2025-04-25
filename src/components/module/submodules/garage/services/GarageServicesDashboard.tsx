
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useGarageServices } from '../hooks/useGarageServices';
import { AddServiceDialog } from './AddServiceDialog';

const GarageServicesDashboard = () => {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const { services, servicesStats } = useGarageServices();

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "vehicleInfo",
      header: "Véhicule",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "mechanicName",
      header: "Mécanicien",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "progress",
      header: "Progression",
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Réparations</h2>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle réparation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50">
          <h3 className="font-medium mb-2">Réparations aujourd'hui</h3>
          <p className="text-2xl font-bold">{servicesStats.today}</p>
          <p className="text-sm text-gray-500">Planifiées pour aujourd'hui</p>
        </Card>

        <Card className="p-4 bg-yellow-50">
          <h3 className="font-medium mb-2">En cours</h3>
          <p className="text-2xl font-bold">{servicesStats.inProgress}</p>
          <p className="text-sm text-gray-500">Réparations actives</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <h3 className="font-medium mb-2">En attente de pièces</h3>
          <p className="text-2xl font-bold">{servicesStats.waitingParts}</p>
          <p className="text-sm text-gray-500">Commandes en attente</p>
        </Card>

        <Card className="p-4 bg-green-50">
          <h3 className="font-medium mb-2">Total réparations</h3>
          <p className="text-2xl font-bold">{servicesStats.total}</p>
          <p className="text-sm text-gray-500">Toutes les réparations</p>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Dernières réparations</h3>
          <DataTable 
            columns={columns} 
            data={services} 
          />
        </div>
      </Card>

      <AddServiceDialog 
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
      />
    </div>
  );
};

export default GarageServicesDashboard;
