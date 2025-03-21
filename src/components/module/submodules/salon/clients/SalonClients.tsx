
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsList from './components/ClientsList';
import ClientSearch from './components/ClientSearch';
import ClientDetailsDialog from './components/ClientDetailsDialog';
import AddClientDialog from './components/AddClientDialog';
import { useSalonClients } from '../hooks/useSalonClients';
import { Button } from '@/components/ui/button';
import { Newspaper, Phone, Bell, Plus, Users, Star } from 'lucide-react';
import { toast } from 'sonner';
import { SalonClient } from '../types/salon-types';

const SalonClients = () => {
  const { clients, isLoading, addClient, updateClient, deleteClient } = useSalonClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SalonClient | null>(null);
  const [activeTab, setActiveTab] = useState<string>('clients');

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
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const threeMonthsAgoStr = threeMonthsAgo.toISOString();
    
    switch (filterType) {
      case 'recent':
        return filteredClients.filter(
          client => client.lastVisit && client.lastVisit > threeMonthsAgoStr
        );
      case 'loyal':
        return filteredClients.filter(
          client => client.loyaltyPoints >= 100
        );
      case 'inactive':
        return filteredClients.filter(
          client => !client.lastVisit || client.lastVisit < threeMonthsAgoStr
        );
      default:
        return filteredClients;
    }
  }, [filteredClients, filterType]);

  const handleAddClient = (client: SalonClient) => {
    addClient(client);
    setIsAddClientOpen(false);
    toast("Client ajouté avec succès");
  };

  const handleUpdateClient = (client: SalonClient) => {
    updateClient(client);
    setIsDetailsOpen(false);
    toast("Client mis à jour avec succès");
  };

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
    setIsDetailsOpen(false);
    toast("Client supprimé avec succès");
  };

  const handleViewClient = (client: SalonClient) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleSendNotification = (type: 'sms' | 'email') => {
    toast(`Envoi de ${type === 'sms' ? 'SMS' : 'email'} programmé.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Clients</h2>
        <Button onClick={() => setIsAddClientOpen(true)} className="flex items-center gap-2">
          <Plus size={16} /> Nouveau Client
        </Button>
      </div>

      <Tabs defaultValue="clients" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users size={16} />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Newspaper size={16} />
            <span>Historique</span>
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Star size={16} />
            <span>Programme Fidélité</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Liste des Clients</CardTitle>
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
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Historique des Prestations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-8 rounded-md text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg">Historique des Prestations</h3>
                <p className="text-muted-foreground mt-2">
                  Sélectionnez un client pour voir son historique de rendez-vous et prestations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="loyalty" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Programme de Fidélité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Membres Fidélité</p>
                  <p className="text-2xl font-bold text-blue-600">187</p>
                  <p className="text-xs text-gray-500">sur 345 clients</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Points Distribués</p>
                  <p className="text-2xl font-bold text-green-600">1,240</p>
                  <p className="text-xs text-gray-500">ce mois-ci</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Récompenses Utilisées</p>
                  <p className="text-2xl font-bold text-purple-600">32</p>
                  <p className="text-xs text-gray-500">ce mois-ci</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Offres en cours</h3>
              <div className="space-y-3 mb-6">
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium">Remise de 20% sur coloration</div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">200 points</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pour clients ayant cumulé 200 points ou plus
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium">Soin capillaire offert</div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">150 points</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pour tout service de plus de 60€
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium">-50% sur 2ème produit acheté</div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">100 points</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Valable sur les shampoings et soins
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Notifications</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleSendNotification('sms')} className="flex-1 flex items-center gap-2">
                  <Phone size={16} />
                  <span>Envoyer SMS promotionnel</span>
                </Button>
                <Button variant="outline" onClick={() => handleSendNotification('email')} className="flex-1 flex items-center gap-2">
                  <Bell size={16} />
                  <span>Envoyer Email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
