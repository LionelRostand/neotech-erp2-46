
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2, Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import { GarageClient } from '../types/garage-types';
import AddClientDialog from '../dialogs/AddClientDialog';
import ViewClientDialog from '../dialogs/ViewClientDialog';
import EditClientDialog from '../dialogs/EditClientDialog';
import DeleteClientDialog from '../dialogs/DeleteClientDialog';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from "sonner";

const GarageClientsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<GarageClient | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { clients, isLoading: isLoadingClients, refetchClients } = useGarageClients();
  const { update, remove } = useFirestore(COLLECTIONS.GARAGE.CLIENTS);

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
    setIsLoading(true);
    try {
      await update(updatedClient.id, updatedClient);
      toast.success("Client mis à jour avec succès");
      setShowEditDialog(false);
      refetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error("Erreur lors de la mise à jour du client");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    setIsLoading(true);
    try {
      await remove(selectedClient.id);
      toast.success("Client supprimé avec succès");
      setShowDeleteDialog(false);
      refetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error("Erreur lors de la suppression du client");
    } finally {
      setIsLoading(false);
    }
  };

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
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
          isLoading={isLoadingClients}
        />
      </Card>

      <AddClientDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {selectedClient && (
        <>
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
            isLoading={isLoading}
          />

          <DeleteClientDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDeleteConfirm}
            clientName={`${selectedClient.firstName} ${selectedClient.lastName}`}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default GarageClientsDashboard;
