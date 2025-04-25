
import React, { useState } from 'react';
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
import AddAppointmentDialog from '../appointments/AddAppointmentDialog';
import { GarageClient } from '../types/garage-types';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

const GarageClientsDashboard = () => {
  const { clients = [], isLoading, updateClient, deleteClient } = useGarageClients();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<GarageClient | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Assurer des chemins de collection valides
  const vehiclesPath = COLLECTIONS.GARAGE.VEHICLES || 'garage_vehicles';
  const mechanicsPath = COLLECTIONS.GARAGE.MECHANICS || 'garage_mechanics';
  const servicesPath = COLLECTIONS.GARAGE.SERVICES || 'garage_services';

  const { data: vehicles = [] } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData(vehiclesPath)
  });

  const { data: mechanics = [] } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData(mechanicsPath)
  });

  const { data: services = [] } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData(servicesPath)
  });

  const handleCreateAppointment = (client: GarageClient) => {
    setSelectedClient(client);
    setShowAppointmentDialog(true);
  };

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
        todayCount={clients.filter(c => {
          try {
            return new Date(c.createdAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
          } catch {
            return false;
          }
        }).length}
        activeCount={clients.filter(c => c.status === 'active').length}
        inactiveCount={clients.filter(c => c.status === 'inactive').length}
        totalCount={clients.length}
      />

      <Card className="p-6">
        <ClientsTable 
          clients={clients}
          onView={(client) => {
            setSelectedClient(client);
            setShowViewDialog(true);
          }}
          onEdit={(client) => {
            setSelectedClient(client);
            setShowEditDialog(true);
          }}
          onDelete={(client) => {
            setSelectedClient(client);
            setShowDeleteDialog(true);
          }}
          onCreateAppointment={handleCreateAppointment}
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

      <AddAppointmentDialog 
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        clients={clients}
        vehicles={vehicles}
        mechanics={mechanics}
        services={services}
        clientId={selectedClient?.id}
      />
    </div>
  );
};

export default GarageClientsDashboard;
