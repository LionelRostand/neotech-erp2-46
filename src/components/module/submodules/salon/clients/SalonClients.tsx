
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientsList from './components/ClientsList';
import ClientSearch from './components/ClientSearch';
import ClientDetailsDialog from './components/ClientDetailsDialog';
import AddClientDialog from './components/AddClientDialog';
import { useSalonClients } from '../hooks/useSalonClients';
import { useToast } from '@/hooks/use-toast';
import { SalonClient } from '../types/salon-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths } from 'date-fns';

const SalonClients = () => {
  const { toast } = useToast();
  const { clients, isLoading, addClient, updateClient, deleteClient } = useSalonClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SalonClient | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  // Apply additional filters
  const displayedClients = useMemo(() => {
    if (filterType === 'all') return filteredClients;
    
    const threeMonthsAgo = subMonths(new Date(), 3).toISOString();
    
    switch (filterType) {
      case 'recent':
        return filteredClients.filter(
          client => client.lastVisit && client.lastVisit > threeMonthsAgo
        );
      case 'loyal':
        return filteredClients.filter(
          client => client.loyaltyPoints >= 100
        );
      case 'inactive':
        return filteredClients.filter(
          client => !client.lastVisit || client.lastVisit < threeMonthsAgo
        );
      default:
        return filteredClients;
    }
  }, [filteredClients, filterType]);

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
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'list' | 'cards')}
            className="hidden sm:block"
          >
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="cards">Cartes</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ClientSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            onAddClient={() => setIsAddClientOpen(true)}
            filter={filterType}
            onFilterChange={setFilterType}
          />
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">
                {displayedClients.length} clients trouvés
              </div>
            </div>
            
            <ClientsList 
              clients={displayedClients} 
              isLoading={isLoading} 
              onViewClient={handleViewClient}
              filter={filterType}
            />
          </div>
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
