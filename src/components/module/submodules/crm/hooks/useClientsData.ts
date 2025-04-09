
import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import mockClientsData from '../data/mockClients';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Get firestore instance with the correct collection path
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);

  // Function to cancel the loading operation
  const cancelLoading = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("Cancelling loading operation");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  // Fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    // If there's an ongoing fetch, cancel it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this fetch
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    setIsOfflineMode(false);
    
    try {
      console.log("Fetching clients data...");
      const fetchedClients = await firestore.getAll();
      
      if (Array.isArray(fetchedClients)) {
        console.log(`Fetched ${fetchedClients.length} clients`);
        
        if (fetchedClients.length === 0) {
          console.log("No clients found, but connection is working");
        }
        
        console.log("Fetched clients data:", fetchedClients);
        setClients(fetchedClients as Client[]);
      } else {
        console.error("Invalid response format:", fetchedClients);
        throw new Error("Format de réponse invalide");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      
      // Only set error if the operation wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        const error = err instanceof Error ? err : new Error("Une erreur est survenue");
        setError(error);
        
        // If it's a network error or 400 error, enable offline mode
        if (error.message.includes("network") || 
            error.message.includes("Failed to fetch") || 
            error.message.includes("400")) {
          console.log("Enabling offline mode due to network error");
          setIsOfflineMode(true);
          
          // In offline mode, use mock data
          setClients(mockClientsData);
          toast.warning("Mode hors-ligne activé. Les données sont simulées.");
        }
      }
    } finally {
      // Only update loading state if the operation wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [firestore]);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
    
    // Clean up any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchClients]);

  // Add a client
  const addClient = async (clientData: ClientFormData) => {
    try {
      if (isOfflineMode) {
        // In offline mode, create a mock client with a UUID
        const newClient: Client = {
          id: uuidv4(),
          ...clientData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _offlineCreated: true
        };
        
        setClients(prev => [...prev, newClient]);
        toast.success("Client ajouté (mode hors-ligne)");
        return newClient;
      } else {
        // Online mode: add to Firestore
        const result = await firestore.add({
          ...clientData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        // Add the new client to the local state for immediate UI update
        if (result && result.id) {
          const newClient: Client = {
            id: result.id,
            ...clientData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setClients(prev => [...prev, newClient]);
          toast.success("Client ajouté avec succès");
          return newClient;
        } else {
          throw new Error("Erreur lors de la création du client");
        }
      }
    } catch (err) {
      console.error("Error adding client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur: ${errorMessage}`);
      
      // If there's a network error, try to operate in offline mode
      if (errorMessage.includes("network") || 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("400")) {
        setIsOfflineMode(true);
        
        // Create an offline client
        const offlineClient: Client = {
          id: uuidv4(),
          ...clientData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _offlineCreated: true
        };
        
        setClients(prev => [...prev, offlineClient]);
        toast.info("Client ajouté en mode hors-ligne");
        return offlineClient;
      }
      
      throw err;
    }
  };

  // Update a client
  const updateClient = async (id: string, clientData: ClientFormData) => {
    try {
      if (isOfflineMode) {
        // In offline mode, update the client in local state
        setClients(prev => 
          prev.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  ...clientData, 
                  updatedAt: new Date().toISOString(),
                  _offlineUpdated: true 
                } 
              : client
          )
        );
        
        toast.success("Client mis à jour (mode hors-ligne)");
        return { ...clientData, id, _offlineUpdated: true };
      } else {
        // Online mode: update in Firestore
        await firestore.update(id, {
          ...clientData,
          updatedAt: new Date().toISOString()
        });
        
        // Update the client in local state
        setClients(prev => 
          prev.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  ...clientData, 
                  updatedAt: new Date().toISOString() 
                } 
              : client
          )
        );
        
        toast.success("Client mis à jour avec succès");
        return { ...clientData, id };
      }
    } catch (err) {
      console.error("Error updating client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur: ${errorMessage}`);
      
      // If there's a network error, try to operate in offline mode
      if (errorMessage.includes("network") || 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("400")) {
        setIsOfflineMode(true);
        
        // Update the client in local state
        setClients(prev => 
          prev.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  ...clientData, 
                  updatedAt: new Date().toISOString(),
                  _offlineUpdated: true 
                } 
              : client
          )
        );
        
        toast.info("Client mis à jour en mode hors-ligne");
        return { ...clientData, id, _offlineUpdated: true };
      }
      
      throw err;
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      if (isOfflineMode) {
        // In offline mode, remove the client from local state
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success("Client supprimé (mode hors-ligne)");
      } else {
        // Online mode: delete from Firestore
        await firestore.remove(id);
        
        // Remove the client from local state
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success("Client supprimé avec succès");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur: ${errorMessage}`);
      
      // If there's a network error, try to operate in offline mode
      if (errorMessage.includes("network") || 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("400")) {
        setIsOfflineMode(true);
        
        // Remove the client from local state anyway
        setClients(prev => prev.filter(client => client.id !== id));
        toast.info("Client supprimé en mode hors-ligne");
      } else {
        throw err;
      }
    }
  };

  // Seed mock clients
  const seedMockClients = async () => {
    try {
      setIsLoading(true);
      
      if (isOfflineMode) {
        // In offline mode, just use the mock data
        setClients(mockClientsData);
        toast.success("Données de démo chargées (mode hors-ligne)");
      } else {
        // Online mode: add mock clients to Firestore
        const promises = mockClientsData.map(async (client) => {
          try {
            // Remove id and _offlineCreated properties
            const { id, _offlineCreated, ...clientData } = client;
            return await firestore.add(clientData);
          } catch (error) {
            console.error(`Error adding mock client ${client.name}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        const successCount = results.filter(Boolean).length;
        
        if (successCount > 0) {
          // Refresh clients after seeding
          await fetchClients();
          toast.success(`${successCount} clients de démo ajoutés avec succès`);
        } else {
          throw new Error("Impossible d'ajouter les clients de démo");
        }
      }
    } catch (err) {
      console.error("Error seeding mock clients:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur: ${errorMessage}`);
      
      // If there's a network error, use offline mode
      if (errorMessage.includes("network") || 
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("400")) {
        setIsOfflineMode(true);
        setClients(mockClientsData);
        toast.info("Données de démo chargées en mode hors-ligne");
      }
    } finally {
      setIsLoading(false);
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
