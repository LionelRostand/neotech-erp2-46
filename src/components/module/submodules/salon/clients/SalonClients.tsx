
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientsList from './components/ClientsList';
import ClientSearch from './components/ClientSearch';
import ClientDetailsDialog from './components/ClientDetailsDialog';
import AddClientDialog from './components/AddClientDialog';
import { useSalonClients } from '../hooks/useSalonClients';
import { useToast } from '@/hooks/use-toast';
import { SalonClient } from '../types/salon-types';

const SalonClients = () => {
  const { toast } = useToast();
  const { clients, isLoading, addClient, updateClient, deleteClient } = useSalonClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SalonClient | null>(null);

  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = (client: SalonClient) => {
    addClient(client);
    setIsAddClientOpen(false);
    toast({
      title: "Client ajouté",
      description: `${client.firstName} ${client.lastName} a été ajouté avec succès`,
    });
  };

  const handleUpdateClient = (client: SalonClient) => {
    updateClient(client);
    setIsDetailsOpen(false);
    toast({
      title: "Client mis à jour",
      description: `Les informations de ${client.firstName} ${client.lastName} ont été mises à jour`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
    setIsDetailsOpen(false);
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès",
    });
  };

  const handleViewClient = (client: SalonClient) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5">
          <CardTitle>Gestion des Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            onAddClient={() => setIsAddClientOpen(true)}
          />
          
          <ClientsList 
            clients={filteredClients} 
            isLoading={isLoading} 
            onViewClient={handleViewClient}
          />
        </CardContent>
      </Card>

      {selectedClient && (
        <ClientDetailsDialog
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          client={selectedClient}
          onUpdate={handleUpdateClient}
          onDelete={handleDeleteClient}
        />
      )}

      <AddClientDialog
        isOpen={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        onAdd={handleAddClient}
      />
    </div>
  );
};

export default SalonClients;
