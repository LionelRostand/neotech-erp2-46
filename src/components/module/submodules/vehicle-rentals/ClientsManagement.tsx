
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { Client } from './types/rental-types';
import CreateClientDialog from './dialogs/client/CreateClientDialog';
import ClientsList from './components/client/ClientsList';
import ClientsSearchBar from './components/client/ClientsSearchBar';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from "sonner";

const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>(COLLECTIONS.TRANSPORT.CLIENTS)
  });

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (client.firstName?.toLowerCase() || '').includes(searchLower) ||
      (client.lastName?.toLowerCase() || '').includes(searchLower) ||
      (client.email?.toLowerCase() || '').includes(searchLower) ||
      (client.phone || '').includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Clients</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <ClientsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetch}
        onNewClient={() => setShowCreateDialog(true)}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          Chargement des clients...
        </div>
      ) : (
        <ClientsList clients={filteredClients} />
      )}

      <CreateClientDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ClientsManagement;
