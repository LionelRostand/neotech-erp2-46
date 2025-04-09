
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import mockClientsData from '../data/mockClients';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  
  // Use our Firestore hook for the crm_clients collection
  const clientsFirestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Function to cancel loading operation
  const cancelLoading = useCallback(() => {
    setIsCancelled(true);
    setIsLoading(false);
  }, []);

  // Function to fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    // Reset cancellation state
    setIsCancelled(false);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching clients from Firestore...");
      const clientsData = await clientsFirestore.getAll();
      
      // Check if operation was cancelled during fetch
      if (isCancelled) {
        console.log("Fetch operation was cancelled");
        return;
      }
      
      // Process and type-check data from Firestore 
      const typedClients: Client[] = clientsData.map((doc: any): Client => {
        return {
          id: doc.id || '',
          name: doc.name || '',
          contactName: doc.contactName || '',
          contactEmail: doc.contactEmail || '',
          contactPhone: doc.contactPhone || '',
          sector: doc.sector || '',
          revenue: doc.revenue || '',
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: doc.updatedAt,
          status: (doc.status as 'active' | 'inactive' | 'lead') || 'active',
          address: doc.address || '',
          website: doc.website || '',
          notes: doc.notes || '',
          customerSince: doc.customerSince,
          _offlineCreated: doc._offlineCreated || false,
          _offlineUpdated: doc._offlineUpdated || false,
          _offlineDeleted: doc._offlineDeleted || false
        };
      });

      console.log(`Fetched ${typedClients.length} clients`);
      setClients(typedClients);
      setIsOfflineMode(false);
    } catch (err) {
      console.error("Error fetching clients:", err);
      
      // Check if operation was cancelled
      if (isCancelled) return;
      
      // Handle firebase's offline mode
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || 
          errorMessage.includes('unavailable') || 
          errorMessage.includes('internal')) {
        console.log("Using offline mode with mock data");
        setIsOfflineMode(true);
        setClients(mockClientsData);
        setError(null);
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error(`Erreur lors du chargement des clients: ${errorMessage}`);
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  }, [clientsFirestore, isCancelled]);

  // Add a new client
  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    try {
      // Prepare client data with timestamp
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      // Add to Firestore
      const addedClient = await clientsFirestore.add(newClient);
      
      // Create properly typed client object
      const typedClient: Client = {
        id: addedClient.id || '',
        name: newClient.name || '',
        contactName: newClient.contactName || '',
        contactEmail: newClient.contactEmail || '',
        contactPhone: newClient.contactPhone || '',
        sector: newClient.sector || '',
        revenue: newClient.revenue || '',
        status: newClient.status,
        address: newClient.address || '',
        website: newClient.website || '',
        notes: newClient.notes || '',
        createdAt: newClient.createdAt,
        _offlineCreated: false,
        _offlineUpdated: false,
        _offlineDeleted: false
      };
      
      // Update local state
      setClients(prev => [...prev, typedClient]);
      
      toast.success(`Client "${clientData.name}" ajouté avec succès`);
      return typedClient;
    } catch (err) {
      console.error("Error adding client:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de l'ajout du client: ${errorMessage}`);
      throw err;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    try {
      // Prepare update data with timestamp
      const updateData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      // Update in Firestore
      await clientsFirestore.update(id, updateData);
      
      // Find current client data to merge with updates
      const currentClient = clients.find(client => client.id === id);
      if (!currentClient) {
        throw new Error(`Client with ID ${id} not found`);
      }
      
      // Create updated client object
      const updatedClient: Client = {
        ...currentClient,
        ...updateData,
        id
      };
      
      // Update local state
      setClients(prev => 
        prev.map(client => client.id === id ? updatedClient : client)
      );

      toast.success(`Client "${clientData.name || 'sélectionné'}" mis à jour avec succès`);
      return updatedClient;
    } catch (err) {
      console.error("Error updating client:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la mise à jour du client: ${errorMessage}`);
      throw err;
    }
  };

  // Delete a client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      // Delete from Firestore
      await clientsFirestore.remove(id);
      
      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast.success("Client supprimé avec succès");
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la suppression du client: ${errorMessage}`);
      throw err;
    }
  };

  // Seed mock clients to Firestore
  const seedMockClients = async (): Promise<void> => {
    try {
      setIsLoading(true);
      let seedCount = 0;
      
      for (const client of mockClientsData) {
        // Skip the ID as Firestore will generate one
        const { id, ...clientData } = client;
        
        // Add to Firestore without updating our local state yet
        await clientsFirestore.add(clientData);
        seedCount++;
      }
      
      // Refresh the clients list to get the newly added documents
      await fetchClients();
      
      toast.success(`${seedCount} clients de démonstration ajoutés avec succès`);
    } catch (err) {
      console.error("Error seeding mock clients:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de l'ajout des clients de démonstration: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
    
    // Cleanup function to handle component unmount
    return () => {
      setIsCancelled(true);
    };
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    isOfflineMode,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients,
    cancelLoading
  };
};
