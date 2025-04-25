
import React from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import ClientsTable from './components/ClientsTable';
import ClientsStats from './components/ClientsStats';
import AddClientDialog from './components/AddClientDialog';
import ViewClientDialog from '../dialogs/ViewClientDialog';
import EditClientDialog from '../dialogs/EditClientDialog';
import DeleteClientDialog from '../dialogs/DeleteClientDialog';
import { GarageClient } from '../types/garage-types';

const GarageClientsDashboard = () => {
  const { clients = [], isLoading, updateClient, deleteClient } = useGarageClients();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<GarageClient | null>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  const newClients = clients.filter(c => {
    // Vérifie si createdAt est une chaîne valide avant de la convertir en Date
    if (!c.createdAt || typeof c.createdAt !== 'string') return false;
    
    try {
      const createdDate = new Date(c.createdAt).toISOString().split('T')[0];
      return createdDate === today;
    } catch (error) {
      console.error('Date invalide détectée:', c.createdAt, error);
      return false;
    }
  });

  const activeClients = clients.filter(c => c.status === 'active');
  const inactiveClients = clients.filter(c => c.status === 'inactive');
  const allClients = clients;

  const handleView = (client: GarageClient) => {
    setSelectedClient(client);
    setShowViewDialog(true);
  };

  const handleEdit = (client: GarageClient) => {
    setSelectedClient(client);
    setShowEditDialog(true);
  };

  const handleDelete = (client: GarageClient) => {
    setSelectedClient(client);
    setShowDeleteDialog(true);
  };

  const handleUpdate = async (updatedClient: GarageClient) => {
    await updateClient.mutateAsync(updatedClient);
    setShowEditDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedClient) {
      await deleteClient.mutateAsync(selectedClient.id);
      setShowDeleteDialog(false);
    }
  };

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
        <ClientsTable 
          clients={clients} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <AddClientDialog 
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <ViewClientDialog 
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        client={selectedClient}
      />

      <EditClientDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        client={selectedClient}
        onSave={handleUpdate}
        isLoading={updateClient.isPending}
      />

      <DeleteClientDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        client={selectedClient}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteClient.isPending}
      />
    </div>
  );
};

export default GarageClientsDashboard;
