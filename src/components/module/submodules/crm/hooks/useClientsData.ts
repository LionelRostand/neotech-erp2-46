import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import mockClientsData from '../data/mockClients';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  
  // Get the Firestore hook for clients collection
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Function to fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    if (isCancelled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching clients data...");
      
      // Use the getAll method from the firestore hook
      const clientsData = await firestore.getAll();
      
      console.log("Fetched clients data:", clientsData);
      
      if (clientsData.length === 0) {
        console.log("No clients found, but connection is working");
      }
      
      // Cast the data to Client type to ensure type safety
      const typedClients = clientsData.map(client => {
        const typedClient: Partial<Client> = {
          ...client,
          name: client.name || '',
          contactName: client.contactName || '',
          contactEmail: client.contactEmail || '',
          contactPhone: client.contactPhone || '',
          sector: client.sector || '',
          revenue: client.revenue || '',
          createdAt: client.createdAt || new Date().toISOString(),
          status: (client.status as "active" | "inactive" | "lead") || "active"
        };
        
        return typedClient as Client;
      });
      
      setClients(typedClients);
      setIsOfflineMode(false);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // If we can't connect to Firestore, fall back to mock data
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        toast.error("Impossible de se connecter à la base de données. Mode démo activé.", {
          duration: 5000
        });
        
        // Initialize with mock data in offline mode
        setClients(mockClientsData as Client[]);
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  }, [firestore, isOfflineMode, isCancelled]);
  
  // Cancel loading operation
  const cancelLoading = useCallback(() => {
    setIsCancelled(true);
    setIsLoading(false);
    
    // Reset after a delay to allow for new operations
    setTimeout(() => {
      setIsCancelled(false);
    }, 500);
  }, []);
  
  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
    
    // Cleanup function
    return () => {
      setIsCancelled(true);
    };
  }, [fetchClients]);
  
  // Add client
  const addClient = async (clientData: ClientFormData) => {
    try {
      // Prepare the client data
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: clientData.status as "active" | "inactive" | "lead"
      };
      
      // If offline, add to local state only
      if (isOfflineMode) {
        const mockClient = {
          ...newClient,
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
      const clientWithId = {
        ...newClient,
        id: result.id
      } as Client;
      
      setClients(prev => [...prev, clientWithId]);
      toast.success("Client ajouté avec succès");
      return clientWithId;
    } catch (err) {
      console.error("Error adding client:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de l'ajout du client: ${message}`);
      throw err;
    }
  };
  
  // Update client
  const updateClient = async (id: string, clientData: ClientFormData) => {
    try {
      // Create updated client data
      const updatedClient = {
        ...clientData,
        updatedAt: new Date().toISOString(),
        status: clientData.status as "active" | "inactive" | "lead"
      };
      
      // If offline, update in local state only
      if (isOfflineMode) {
        const offlineUpdatedClient = {
          ...updatedClient,
          id,
          _offlineUpdated: true
        };
        
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { ...client, ...offlineUpdatedClient } as Client
            : client
        ));
        
        toast.success("Client mis à jour en mode démo");
        return offlineUpdatedClient as Client;
      }
      
      // Otherwise, update in Firestore
      await firestore.update(id, updatedClient);
      
      // Update the client in the state
      const clientWithId = {
        ...updatedClient,
        id
      } as Client;
      
      setClients(prev => prev.map(client => 
        client.id === id ? clientWithId : client
      ));
      
      toast.success("Client mis à jour avec succès");
      return clientWithId;
    } catch (err) {
      console.error("Error updating client:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la mise à jour du client: ${message}`);
      throw err;
    }
  };
  
  // Delete client
  const deleteClient = async (id: string) => {
    try {
      // If offline, mark as deleted in local state
      if (isOfflineMode) {
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { ...client, _offlineDeleted: true, updatedAt: new Date().toISOString(), _offlineUpdated: true } as Client
            : client
        ).filter(client => !client._offlineDeleted));
        
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
      console.error("Error deleting client:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la suppression du client: ${message}`);
      throw err;
    }
  };
  
  // Seed mock clients
  const seedMockClients = async () => {
    try {
      if (isOfflineMode) {
        // In offline mode, just use mock data directly
        setClients(mockClientsData as Client[]);
        toast.success("Clients démo ajoutés en mode hors ligne");
        return;
      }
      
      // Otherwise, add them to Firestore
      const promises = mockClientsData.map(async client => {
        const { id, _offlineCreated, ...clientData } = client;
        try {
          return await firestore.add({
            ...clientData,
            status: clientData.status as "active" | "inactive" | "lead"
          });
        } catch (error) {
          console.error(`Error adding demo client ${client.name}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const successCount = results.filter(Boolean).length;
      
      await fetchClients(); // Refresh the client list
      
      if (successCount > 0) {
        toast.success(`${successCount} clients de démo ajoutés avec succès.`);
      } else {
        toast.error("Impossible d'ajouter les clients de démo. Vérifiez votre connexion.");
      }
    } catch (err) {
      console.error("Error seeding clients:", err);
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de l'ajout des clients démo: ${message}`);
    }
  };
  
  return {
    clients: clients.filter(client => !client._offlineDeleted),
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
