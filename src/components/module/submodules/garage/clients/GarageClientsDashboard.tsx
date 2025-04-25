
import React from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import ClientsTable from './components/ClientsTable';
import ClientsStats from './components/ClientsStats';
import AddClientDialog from './components/AddClientDialog';

const GarageClientsDashboard = () => {
  const { clients = [], isLoading } = useGarageClients();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  const newClients = clients.filter(c => {
    const createdDate = new Date(c.createdAt).toISOString().split('T')[0];
    return createdDate === today;
  });
  const activeClients = clients.filter(c => c.status === 'active');
  const inactiveClients = clients.filter(c => c.status === 'inactive');
  const allClients = clients;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <ClientsStats 
        todayCount={newClients.length}
        activeCount={activeClients.length}
        inactiveCount={inactiveClients.length}
        totalCount={allClients.length}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des clients</h2>
        <ClientsTable clients={clients} />
      </Card>

      <AddClientDialog 
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageClientsDashboard;
