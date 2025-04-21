
import React from 'react';
import { Button } from "@/components/ui/button";
import { useFreightClients } from '../hooks/useFreightClients';
import { UserPlus } from "lucide-react";
import FreightClientsTable from './FreightClientsTable';
import CreateClientDialog from './CreateClientDialog';
import FreightClientViewDialog from './FreightClientViewDialog';
import FreightClientEditDialog from './FreightClientEditDialog';
import FreightClientDeleteDialog from './FreightClientDeleteDialog';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from "sonner";

const FreightClientsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const { clients, isLoading, error, refetchClients } = useFreightClients();
  const [selectedClient, setSelectedClient] = React.useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetchClients();
  };

  const handleView = (client: any) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setEditDialogOpen(true);
  };

  const handleDelete = (client: any) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    setEditLoading(true);
    try {
      const clientRef = doc(db, COLLECTIONS.FREIGHT.CLIENTS, selectedClient.id);
      await updateDoc(clientRef, values);
      toast.success("Client modifié avec succès");
      setEditDialogOpen(false);
      refetchClients();
    } catch (err: any) {
      toast.error("Erreur lors de la modification");
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const clientRef = doc(db, COLLECTIONS.FREIGHT.CLIENTS, selectedClient.id);
      await deleteDoc(clientRef);
      toast.success("Client supprimé avec succès");
      setDeleteDialogOpen(false);
      refetchClients();
    } catch (err: any) {
      toast.error("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
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
      <FreightClientsTable
        clients={clients}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CreateClientDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <FreightClientViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        client={selectedClient}
      />
      <FreightClientEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        client={selectedClient}
        onSubmit={handleEditSubmit}
        submitting={editLoading}
      />
      <FreightClientDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        client={selectedClient}
        onDelete={handleDeleteConfirm}
        deleting={deleteLoading}
      />
    </div>
  );
};

export default FreightClientsPage;
