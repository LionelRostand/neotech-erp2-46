
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import ClientsTable from './components/ClientsTable';
import AddClientDialog from './AddClientDialog';

const GarageClientsDashboard = () => {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const { clients = [], isLoading } = useGarageClients();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Liste des clients</h3>
        <ClientsTable clients={clients} />
      </Card>

      <AddClientDialog 
        isOpen={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onClientAdded={() => {
          setOpenAddDialog(false);
        }}
      />
    </div>
  );
};

export default GarageClientsDashboard;
