import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { onSnapshot, collection, getDocs, query, QueryConstraint, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  
  const { add, update, remove, get } = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelLoading = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("Aborting client data fetch operation");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchClients = useCallback(async () => {
    cancelLoading();
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching clients data...");
      
      try {
        const collectionPath = COLLECTIONS.CRM.CLIENTS;
        console.log("Getting collection reference for", collectionPath);
        
        const collectionRef = collection(db, collectionPath);
        
        const q = query(
          collectionRef,
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (abortController.signal.aborted) {
              console.log("Fetch was aborted, not updating state");
              return;
            }
            
            const clientsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            })) as Client[];
            
            console.log("Fetched clients data:", clientsData);
            setClients(clientsData);
            setIsLoading(false);
            setIsOfflineMode(false);
            
            if (clientsData.length === 0) {
              console.log("No clients found, but connection is working");
            }
          },
          (err) => {
            console.error("Error fetching clients:", err);
            
            if (abortController.signal.aborted) {
              console.log("Fetch was aborted, not updating error state");
              return;
            }
            
            if (err.code === 'failed-precondition' || err.code === 'unavailable' || err.code === 'resource-exhausted') {
              console.log("Network error, switching to offline mode");
              setIsOfflineMode(true);
              
              setClients([]);
            } else {
              setError(err);
            }
            
            setIsLoading(false);
          }
        );
        
        abortController.signal.addEventListener('abort', () => {
          console.log("Aborting client data fetch, unsubscribing");
          unsubscribe();
          setIsLoading(false);
        });
        
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error("Error setting up clients listener:", err);
        
        if (abortController.signal.aborted) {
          console.log("Setup was aborted, not updating error state");
          return;
        }
        
        throw err;
      }
    } catch (err) {
      console.error("Error in fetchClients:", err);
      
      if (abortController.signal.aborted) {
        console.log("Operation was aborted, not updating error state");
        return;
      }
      
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      
      setIsOfflineMode(true);
      setClients([]);
    }
  }, [cancelLoading]);

  useEffect(() => {
    fetchClients();
    
    return () => {
      cancelLoading();
    };
  }, [fetchClients, cancelLoading]);

  const addClient = async (clientData: ClientFormData) => {
    try {
      const status = clientData.status as 'active' | 'inactive' | 'lead';
      
      const newClient: Omit<Client, 'id'> = {
        ...clientData,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _offlineCreated: isOfflineMode
      };
      
      if (isOfflineMode) {
        const offlineClient: Client = {
          ...newClient,
          id: `temp-${uuidv4()}`,
        };
        
        setClients(prev => [offlineClient, ...prev]);
        toast.success("Client ajouté en mode hors ligne");
        return offlineClient;
      } else {
        const docRef = await add(newClient);
        
        if (docRef && docRef.id) {
          const addedClient: Client = {
            ...newClient,
            id: docRef.id,
          };
          
          setClients(prev => [addedClient, ...prev]);
          toast.success("Client ajouté avec succès");
          return addedClient;
        } else {
          throw new Error("Échec de l'ajout du client");
        }
      }
    } catch (error) {
      console.error("Error adding client:", error);
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de l'ajout: ${message}`);
      throw error;
    }
  };

  const updateClient = async (clientId: string, clientData: ClientFormData) => {
    try {
      const status = clientData.status as 'active' | 'inactive' | 'lead';
      
      const updatedFields = {
        ...clientData,
        status,
        updatedAt: new Date().toISOString()
      };
      
      if (isOfflineMode) {
        const updatedClient = {
          ...updatedFields,
          id: clientId,
          _offlineUpdated: true as const
        };
        
        setClients(prev => prev.map(client => 
          client.id === clientId ? { ...client, ...updatedClient } as Client : client
        ));
        
        toast.success("Client mis à jour en mode hors ligne");
        return updatedClient;
      } else {
        await update(clientId, updatedFields);
        
        setClients(prev => prev.map(client => 
          client.id === clientId ? { ...client, ...updatedFields, id: clientId } as Client : client
        ));
        
        toast.success("Client mis à jour avec succès");
        return { ...updatedFields, id: clientId };
      }
    } catch (error) {
      console.error("Error updating client:", error);
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la mise à jour: ${message}`);
      throw error;
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      if (isOfflineMode) {
        const deletedClient = {
          updatedAt: new Date().toISOString(),
          _offlineUpdated: true as const,
          _offlineDeleted: true as const
        };
        
        setClients(prev => prev.map(client => 
          client.id === clientId ? { ...client, ...deletedClient } as Client : client
        ).filter(client => !client._offlineDeleted));
        
        toast.success("Client supprimé en mode hors ligne");
        return true;
      } else {
        await remove(clientId);
        
        setClients(prev => prev.filter(client => client.id !== clientId));
        
        toast.success("Client supprimé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la suppression: ${message}`);
      throw error;
    }
  };

  const seedMockClients = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const mockData = [
        {
          name: "Tech Solutions",
          contactName: "Jean Martin",
          contactEmail: "jean@techsolutions.com",
          contactPhone: "01 23 45 67 89",
          sector: "technology",
          status: "active" as const,
          revenue: "1-10M",
        },
        {
          name: "Finance Express",
          contactName: "Marie Dubois",
          contactEmail: "marie@financeexpress.fr",
          contactPhone: "01 98 76 54 32",
          sector: "finance",
          status: "active" as const,
          revenue: "10-50M",
        },
        {
          name: "Education Plus",
          contactName: "Pierre Lambert",
          contactEmail: "pierre@educationplus.org",
          contactPhone: "01 45 67 89 12",
          sector: "education",
          status: "inactive" as const,
          revenue: "<1M",
        }
      ];
      
      const addPromises = mockData.map(client => addClient(client));
      await Promise.all(addPromises);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error seeding mock clients:", error);
      setIsLoading(false);
      return false;
    }
  }, [addClient]);

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
