import { useState, useCallback, useEffect } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { mockClients } from '../data/mockClients';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Hook for managing clients data with Firestore integration
 */
export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  
  // Get firestore instance for the clients collection
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Function to fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    
    try {
      console.log('Fetching clients from Firestore');
      const clientsData = await firestore.getAll();
      
      // If operation was cancelled during async call, don't update state
      if (isCancelled) {
        console.log('Client data loading was cancelled, not updating state');
        return [];
      }
      
      // Map the data to ensure it matches the Client type with default values for missing properties
      const typedClients: Client[] = clientsData.map(client => {
        // Ensure type safety by providing default values for all Client properties
        return {
          id: client.id || '',
          name: client.name || '',
          contactName: client.contactName || '',
          contactEmail: client.contactEmail || '',
          contactPhone: client.contactPhone || '',
          sector: client.sector || '',
          revenue: client.revenue || '',
          createdAt: client.createdAt || new Date().toISOString(),
          // Cast status to the allowed type or default to 'active'
          status: (client.status as Client['status']) || 'active',
          // Optional fields with default values
          address: client.address || undefined,
          website: client.website || undefined,
          notes: client.notes || undefined,
          updatedAt: client.updatedAt || undefined,
          customerSince: client.customerSince || undefined,
          _offlineCreated: client._offlineCreated || undefined,
          _offlineUpdated: client._offlineUpdated || undefined,
          _offlineDeleted: client._offlineDeleted || undefined,
        };
      });
      
      console.log('Fetched clients:', typedClients);
      setClients(typedClients);
      setIsOfflineMode(false);
      return typedClients;
    } catch (err) {
      console.error('Error fetching clients:', err);
      
      // If operation was cancelled during async call, don't update state
      if (isCancelled) {
        console.log('Client data loading was cancelled after error');
        return [];
      }
      
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // If we get a 400 error or network error, switch to offline mode
      if (err instanceof Error) {
        const isNetworkError = err.message.includes('network error') || 
                               err.message.includes('Failed to fetch') ||
                               err.message.includes('Network Error');
        
        const is400Error = err.message.includes('400') || 
                           err.message.includes('INVALID_ARGUMENT');
        
        if (isNetworkError || is400Error) {
          console.log('Network or 400 error detected, switching to offline mode');
          setIsOfflineMode(true);
          
          // Load mock data in offline mode
          const mockData = getMockClients();
          setClients(mockData);
          return mockData;
        }
      }
      
      return [];
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  }, [firestore, isCancelled]);

  // Function to cancel any ongoing loading operation
  const cancelLoading = useCallback(() => {
    console.log("Cancelling client data loading");
    setIsCancelled(true);
    setIsLoading(false);
  }, []);
  
  // Function to add a client
  const addClient = useCallback(async (clientData: ClientFormData) => {
    setIsLoading(true);
    try {
      // Prepare client data with required fields and timestamps
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        // Ensure status is one of the allowed values
        status: clientData.status as Client['status'],
        // Optional fields provided as undefined if not present in the form data
        address: clientData.address || undefined,
        website: clientData.website || undefined,
        notes: clientData.notes || undefined,
      };
      
      // If in offline mode, just add to local state with a fake ID
      if (isOfflineMode) {
        const offlineClient: Client = {
          ...newClient,
          id: `temp-${Date.now()}`,
          _offlineCreated: true,
        };
        
        setClients(prev => [offlineClient, ...prev]);
        toast.success('Client ajouté en mode hors ligne');
        setIsLoading(false);
        return offlineClient;
      }
      
      // Otherwise, add to Firestore
      const result = await firestore.add(newClient);
      
      // Refresh clients list to include the new client
      await fetchClients();
      
      toast.success('Client ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Error adding client:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, fetchClients, isOfflineMode]);
  
  // Function to update a client
  const updateClient = useCallback(async (id: string, clientData: Partial<ClientFormData>) => {
    setIsLoading(true);
    try {
      // Prepare update data with timestamp
      const updateData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
        // Ensure status is one of the allowed values if it's being updated
        status: clientData.status as Client['status'],
      };
      
      // If in offline mode, just update local state
      if (isOfflineMode) {
        const updatedClients = clients.map(client => 
          client.id === id 
            ? { ...client, ...updateData, _offlineUpdated: true } 
            : client
        );
        
        setClients(updatedClients);
        toast.success('Client mis à jour en mode hors ligne');
        setIsLoading(false);
        
        // Return the updated client
        const updatedClient = updatedClients.find(client => client.id === id);
        return updatedClient || null;
      }
      
      // Otherwise, update in Firestore
      const result = await firestore.update(id, updateData);
      
      // Refresh clients list to include the updated client
      await fetchClients();
      
      toast.success('Client mis à jour avec succès');
      return result;
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, fetchClients, clients, isOfflineMode]);
  
  // Function to delete a client
  const deleteClient = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // If in offline mode, just update local state (mark as deleted or remove)
      if (isOfflineMode) {
        // For offline created clients, just remove them from local state
        if (clients.some(client => client.id === id && client._offlineCreated)) {
          setClients(prev => prev.filter(client => client.id !== id));
        } else {
          // For existing clients, mark as deleted for later sync
          setClients(prev => 
            prev.map(client => 
              client.id === id 
                ? { ...client, _offlineDeleted: true } 
                : client
            )
          );
        }
        
        toast.success('Client supprimé en mode hors ligne');
        setIsLoading(false);
        return { id };
      }
      
      // Otherwise, delete from Firestore
      await firestore.remove(id);
      
      // Update local state to remove the deleted client
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast.success('Client supprimé avec succès');
      return { id };
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, clients, isOfflineMode]);
  
  // Function to seed mock clients data
  const seedMockClients = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if there are already clients
      const existingClients = await firestore.getAll();
      
      if (existingClients.length > 0) {
        toast.info('Des clients existent déjà dans la base de données.');
        return;
      }
      
      // Get mock clients data
      const mockData = getMockClients();
      
      // If in offline mode, just add to local state
      if (isOfflineMode) {
        setClients(mockData.map(client => ({ ...client, _offlineCreated: true })));
        toast.success('Données de démonstration ajoutées en mode hors ligne');
        return;
      }
      
      // Add each mock client to Firestore
      const promises = mockData.map(client => {
        // Remove the id as Firestore will generate one
        const { id, ...clientData } = client;
        return firestore.add(clientData);
      });
      
      await Promise.all(promises);
      
      // Refresh the clients list
      await fetchClients();
      
      toast.success('Données de démonstration ajoutées avec succès');
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [firestore, fetchClients, isOfflineMode]);
  
  // Function to get mock clients
  const getMockClients = useCallback((): Client[] => {
    return mockClients;
  }, []);
  
  // Load clients when the component mounts
  useEffect(() => {
    fetchClients();
    
    // Cleanup function - cancel any ongoing operations
    return () => {
      cancelLoading();
    };
  }, [fetchClients, cancelLoading]);
  
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
