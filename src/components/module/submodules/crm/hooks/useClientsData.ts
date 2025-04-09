import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import mockClientsData from '../data/mockClients';
import { toast } from 'sonner';
import { formatDocumentWithTimestamps } from '@/hooks/firestore/common-utils';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [shouldCancelLoading, setShouldCancelLoading] = useState(false);
  
  // Initialize Firestore hook for CRM clients collection
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Function to fetch clients data
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setShouldCancelLoading(false);
    
    try {
      console.log('Fetching clients data...');
      
      // Try to get clients from Firestore
      const clientsData = await firestore.getAll();
      
      console.log('Clients data fetched:', clientsData);
      
      // Return early if we've been asked to cancel loading
      if (shouldCancelLoading) {
        console.log('Loading cancelled');
        setIsLoading(false);
        return;
      }
      
      // Cast the data to Client type to ensure type safety
      const typedClients = clientsData.map(client => {
        // Create a typed client with default values for all required fields
        const typedClient: Client = {
          id: client.id || `default-${Date.now()}`,
          name: client.name as string || '',
          contactName: client.contactName as string || '',
          contactEmail: client.contactEmail as string || '',
          contactPhone: client.contactPhone as string || '',
          sector: client.sector as string || '',
          revenue: client.revenue as string || '',
          createdAt: client.createdAt as string || new Date().toISOString(),
          status: (client.status as "active" | "inactive" | "lead") || "active"
        };
        
        // Add optional fields if they exist in the data
        if ('address' in client) typedClient.address = client.address as string;
        if ('website' in client) typedClient.website = client.website as string;
        if ('notes' in client) typedClient.notes = client.notes as string;
        if ('updatedAt' in client) typedClient.updatedAt = client.updatedAt as string;
        if ('customerSince' in client) typedClient.customerSince = client.customerSince as string;
        if ('_offlineCreated' in client) typedClient._offlineCreated = client._offlineCreated as boolean;
        if ('_offlineUpdated' in client) typedClient._offlineUpdated = client._offlineUpdated as boolean;
        if ('_offlineDeleted' in client) typedClient._offlineDeleted = client._offlineDeleted as boolean;
        
        return typedClient;
      });
      
      setClients(typedClients);
      setIsOfflineMode(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      
      if (shouldCancelLoading) {
        console.log('Loading cancelled after error');
        setIsLoading(false);
        return;
      }
      
      // If there's an error, we'll use mock data instead
      setClients(mockClientsData);
      setIsOfflineMode(true);
      
      // Set the error for debugging purposes
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      // Show a toast with the error message
      toast.error("Impossible de charger les données depuis le serveur. Mode démo activé.");
      console.log('Using mock data due to error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [firestore, shouldCancelLoading]);
  
  // Cancel loading function that can be called from outside
  const cancelLoading = useCallback(() => {
    console.log('Cancelling client data loading...');
    setShouldCancelLoading(true);
  }, []);
  
  // Load clients on component mount
  useEffect(() => {
    fetchClients();
    
    // Cleanup function to prevent state updates if component unmounts during fetch
    return () => {
      setShouldCancelLoading(true);
    };
  }, [fetchClients]);
  
  // Function to add a new client
  const addClient = async (clientData: ClientFormData) => {
    try {
      console.log('Adding new client:', clientData);
      
      // Create a new Client object with timestamps
      const newClient: Partial<Client> = {
        ...clientData,
        createdAt: new Date().toISOString()
      };
      
      // If offline, add to local state only
      if (isOfflineMode) {
        const mockClient: Client = {
          ...newClient as Client,
          id: `mock-${Date.now()}`,
          _offlineCreated: true
        } as Client;
        
        setClients(prev => [...prev, mockClient]);
        
        toast.success("Client ajouté en mode démo");
        return mockClient;
      }
      
      // Otherwise, add to Firestore
      const result = await firestore.add(newClient);
      
      // Add the new client to the state
      const clientWithId: Client = {
        ...newClient as Client,
        id: result.id
      } as Client;
      
      setClients(prev => [...prev, clientWithId]);
      
      toast.success("Client ajouté avec succès");
      return clientWithId;
    } catch (err) {
      console.error('Error adding client:', err);
      
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast.error(`Erreur lors de l'ajout du client: ${error.message}`);
      throw error;
    }
  };
  
  // Function to update an existing client
  const updateClient = async (id: string, clientData: ClientFormData) => {
    try {
      console.log('Updating client with ID:', id);
      console.log('Update data:', clientData);
      
      // Create an updated Client object with current timestamp
      const updatedClient: Partial<Client> = {
        ...clientData,
        updatedAt: new Date().toISOString()
      };
      
      // If offline, update in local state only
      if (isOfflineMode) {
        const offlineUpdatedClient: Client = {
          ...updatedClient as Client,
          id,
          _offlineUpdated: true
        } as Client;
        
        setClients(prev => prev.map(client => 
          client.id === id 
            ? offlineUpdatedClient
            : client
        ));
        
        toast.success("Client mis à jour en mode démo");
        return offlineUpdatedClient;
      }
      
      // Otherwise, update in Firestore
      await firestore.update(id, updatedClient);
      
      // Update the client in the state
      const clientWithId: Client = {
        ...updatedClient as Client,
        id
      } as Client;
      
      setClients(prev => prev.map(client => 
        client.id === id ? clientWithId : client
      ));
      
      toast.success("Client mis à jour avec succès");
      return clientWithId;
    } catch (err) {
      console.error('Error updating client:', err);
      
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast.error(`Erreur lors de la mise à jour du client: ${error.message}`);
      throw error;
    }
  };
  
  // Function to delete a client
  const deleteClient = async (id: string) => {
    try {
      // If offline, mark as deleted in local state
      if (isOfflineMode) {
        setClients(prev => prev.map(client => {
          if (client.id === id) {
            return {
              ...client,
              _offlineDeleted: true,
              updatedAt: new Date().toISOString(),
              _offlineUpdated: true
            } as Client;
          }
          return client;
        }).filter(client => !client._offlineDeleted));
        
        toast.success("Client supprimé en mode démo");
        return true;
      }
      
      // Otherwise, delete from Firestore
      await firestore.remove(id);
      
      // Remove the client from the state
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast.success("Client supprimé avec succès");
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast.error(`Erreur lors de la suppression du client: ${error.message}`);
      throw error;
    }
  };
  
  // Function to seed mock clients data
  const seedMockClients = async () => {
    try {
      if (isOfflineMode) {
        // In offline mode, simply add mock clients to state
        setClients(mockClientsData);
        toast.success("Données démo ajoutées en mode hors ligne");
        return true;
      }
      
      // Otherwise, add mock clients to Firestore
      const promises = mockClientsData.map(async (client) => {
        const { id, ...clientData } = client;
        await firestore.add(clientData);
      });
      
      await Promise.all(promises);
      
      // Refresh clients list
      await fetchClients();
      
      toast.success("Données démo ajoutées avec succès");
      return true;
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast.error(`Erreur lors de l'ajout des données démo: ${error.message}`);
      throw error;
    }
  };
  
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
