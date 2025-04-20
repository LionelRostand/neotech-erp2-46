
import React from 'react';
import { Button } from "@/components/ui/button";
import { useFreightClients } from '../hooks/useFreightClients';
import { UserPlus } from "lucide-react";
import FreightClientsTable from './FreightClientsTable';
import CreateClientDialog from './CreateClientDialog';

const FreightClientsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const { clients, isLoading, error, refetchClients } = useFreightClients();

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetchClients();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <FreightClientsTable clients={clients} isLoading={isLoading} />
      
      <CreateClientDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default FreightClientsPage;
