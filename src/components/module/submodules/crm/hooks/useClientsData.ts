
import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientFormData } from '../types/crm-types';
import { mockClients } from '../data/mockClients';
import { toast } from 'sonner';
import { executeWithNetworkRetry, isNetworkError } from '@/hooks/firestore/network-handler';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Function to cancel loading operations
  const cancelLoading = useCallback(() => {
    if (abortController) {
      console.log("Cancelling client loading operation");
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  // Function to detect if we're offline
  const checkIfOffline = useCallback(() => {
    const offline = !navigator.onLine;
    if (offline) {
      console.log("Network is offline, using cached data if available");
      setIsOfflineMode(true);
    } else {
      setIsOfflineMode(false);
    }
    return offline;
  }, []);

  // Fetch clients from Firestore with fallback
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Cancel any previous loading operations
    cancelLoading();
    
    // Create a new AbortController
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      // Check if we're offline
      const isOffline = checkIfOffline();
      
      // If we're online, fetch from Firestore
      if (!isOffline) {
        try {
          console.log("Fetching clients from Firestore");
          const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
          const q = query(clientsRef, orderBy('createdAt', 'desc'), limit(100));
          
          // Set timeout for the fetch operation
          const timeoutId = setTimeout(() => {
            if (controller && !controller.signal.aborted) {
              controller.abort();
              throw new Error("Fetching clients timed out");
            }
          }, 8000);
          
          const querySnapshot = await getDocs(q);
          clearTimeout(timeoutId);
          
          const fetchedClients: Client[] = [];
          querySnapshot.forEach(doc => {
            const data = doc.data();
            fetchedClients.push({
              id: doc.id,
              name: data.name || '',
              contactName: data.contactName || '',
              contactEmail: data.contactEmail || '',
              contactPhone: data.contactPhone || '',
              sector: data.sector || '',
              status: data.status as 'active' | 'inactive' | 'lead',
              revenue: data.revenue || '',
              address: data.address || '',
              website: data.website || '',
              notes: data.notes || '',
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt,
              customerSince: data.customerSince,
              _offlineCreated: data._offlineCreated || false,
              _offlineUpdated: data._offlineUpdated || false,
              _offlineDeleted: data._offlineDeleted || false,
            });
          });
          
          console.log(`Fetched ${fetchedClients.length} clients from Firestore`);
          setClients(fetchedClients);
          setIsOfflineMode(false);
        } catch (err) {
          console.error("Error fetching clients from Firestore:", err);
          
          // If it's a network error or abort error, fall back to local storage
          if (isNetworkError(err) || err instanceof DOMException && err.name === 'AbortError') {
            console.log("Network error or timeout, falling back to local storage");
            setIsOfflineMode(true);
            const storedClients = localStorage.getItem('crm_clients');
            
            if (storedClients) {
              const parsedClients = JSON.parse(storedClients);
              console.log(`Loaded ${parsedClients.length} clients from local storage`);
              setClients(parsedClients);
            } else {
              // If no local storage data, use mock data
              console.log("No clients in local storage, using mock data");
              setClients(mockClients);
            }
          } else {
            // For other errors, propagate
            throw err;
          }
        }
      } else {
        // We're offline, use local storage
        console.log("Offline mode activated, using local storage");
        const storedClients = localStorage.getItem('crm_clients');
        
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          console.log(`Loaded ${parsedClients.length} clients from local storage`);
          setClients(parsedClients);
        } else {
          // If no local storage data, use mock data
          console.log("No clients in local storage, using mock data");
          setClients(mockClients);
        }
      }
    } catch (err: any) {
      console.error("Error in fetchClients:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Try to load from local storage as a last resort
      try {
        const storedClients = localStorage.getItem('crm_clients');
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          console.log(`Loaded ${parsedClients.length} clients from local storage as fallback`);
          setClients(parsedClients);
        } else {
          // If no local storage, use mock data
          setClients(mockClients);
        }
      } catch (localErr) {
        console.error("Error loading from local storage:", localErr);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, [cancelLoading, checkIfOffline]);

  // Save clients to local storage
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('crm_clients', JSON.stringify(clients));
      console.log(`Saved ${clients.length} clients to local storage`);
    }
  }, [clients]);

  // Initial load
  useEffect(() => {
    fetchClients();
    
    // Set up online/offline event handlers
    const handleOnline = () => {
      console.log("Network is online, refreshing data");
      setIsOfflineMode(false);
      fetchClients();
    };
    
    const handleOffline = () => {
      console.log("Network is offline");
      setIsOfflineMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cancelLoading();
    };
  }, [fetchClients, cancelLoading]);

  // Add a new client
  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    try {
      // Ensure the status field is properly typed
      const validStatus = clientData.status as 'active' | 'inactive' | 'lead';
      
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const newClient: Client = {
        id,
        name: clientData.name,
        contactName: clientData.contactName,
        contactEmail: clientData.contactEmail,
        contactPhone: clientData.contactPhone,
        sector: clientData.sector,
        status: validStatus,
        revenue: clientData.revenue,
        address: clientData.address,
        website: clientData.website,
        notes: clientData.notes,
        createdAt: now,
        updatedAt: now
      };
      
      // If we're offline, mark it for later sync
      if (isOfflineMode || !navigator.onLine) {
        console.log("Adding client in offline mode");
        const offlineClient = {
          ...newClient,
          _offlineCreated: true
        };
        
        setClients(prevClients => [offlineClient, ...prevClients]);
        toast.success("Client ajouté en mode hors ligne");
        return offlineClient;
      }
      
      // Try to add to Firestore with retry
      try {
        console.log("Adding client to Firestore:", newClient);
        
        await executeWithNetworkRetry(async () => {
          const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
          await setDoc(clientRef, newClient);
        });
        
        // If successful, update state
        setClients(prevClients => [newClient, ...prevClients]);
        toast.success("Client ajouté avec succès");
        return newClient;
      } catch (err) {
        console.error("Error adding client to Firestore:", err);
        
        // If it's a network error, add offline and mark for sync
        if (isNetworkError(err)) {
          console.log("Network error, adding client in offline mode");
          const offlineClient = {
            ...newClient,
            _offlineCreated: true
          };
          
          setClients(prevClients => [offlineClient, ...prevClients]);
          toast.success("Client ajouté en mode hors ligne");
          return offlineClient;
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error in addClient:", err);
      toast.error("Erreur lors de l'ajout du client: " + (err.message || String(err)));
      throw err;
    }
  };

  // Update a client
  const updateClient = async (id: string, clientData: ClientFormData): Promise<Client> => {
    try {
      const now = new Date().toISOString();
      
      // Ensure the status field is properly typed
      const validStatus = clientData.status as 'active' | 'inactive' | 'lead';
      
      const updatedClient = {
        ...clientData,
        status: validStatus,
        updatedAt: now
      };
      
      // If we're offline, mark it for later sync
      if (isOfflineMode || !navigator.onLine) {
        console.log("Updating client in offline mode");
        
        const offlineUpdatedClient = {
          ...updatedClient,
          id,
          _offlineUpdated: true
        } as Client;
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id ? offlineUpdatedClient : client
          )
        );
        
        toast.success("Client mis à jour en mode hors ligne");
        return offlineUpdatedClient;
      }
      
      // Try to update in Firestore with retry
      try {
        console.log("Updating client in Firestore:", id, updatedClient);
        
        await executeWithNetworkRetry(async () => {
          const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
          await setDoc(clientRef, updatedClient, { merge: true });
        });
        
        // If successful, update state
        const updated = {
          ...updatedClient,
          id
        } as Client;
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id ? updated : client
          )
        );
        
        toast.success("Client mis à jour avec succès");
        return updated;
      } catch (err) {
        console.error("Error updating client in Firestore:", err);
        
        // If it's a network error, update offline and mark for sync
        if (isNetworkError(err)) {
          console.log("Network error, updating client in offline mode");
          
          const offlineUpdatedClient = {
            ...updatedClient,
            id,
            _offlineUpdated: true
          } as Client;
          
          setClients(prevClients => 
            prevClients.map(client => 
              client.id === id ? offlineUpdatedClient : client
            )
          );
          
          toast.success("Client mis à jour en mode hors ligne");
          return offlineUpdatedClient;
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error in updateClient:", err);
      toast.error("Erreur lors de la mise à jour du client: " + (err.message || String(err)));
      throw err;
    }
  };

  // Delete a client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      // If we're offline, mark it for later deletion
      if (isOfflineMode || !navigator.onLine) {
        console.log("Deleting client in offline mode");
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id ? { ...client, _offlineDeleted: true } : client
          ).filter(client => client.id !== id || client._offlineCreated)
        );
        
        toast.success("Client supprimé en mode hors ligne");
        return;
      }
      
      // Try to delete from Firestore with retry
      try {
        console.log("Deleting client from Firestore:", id);
        
        await executeWithNetworkRetry(async () => {
          const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
          await deleteDoc(clientRef);
        });
        
        // If successful, update state
        setClients(prevClients => prevClients.filter(client => client.id !== id));
        toast.success("Client supprimé avec succès");
      } catch (err) {
        console.error("Error deleting client from Firestore:", err);
        
        // If it's a network error, mark for deletion
        if (isNetworkError(err)) {
          console.log("Network error, marking client for deletion in offline mode");
          
          setClients(prevClients => 
            prevClients.map(client => 
              client.id === id ? { ...client, _offlineDeleted: true } : client
            )
          );
          
          toast.success("Client marqué pour suppression en mode hors ligne");
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error("Error in deleteClient:", err);
      toast.error("Erreur lors de la suppression du client: " + (err.message || String(err)));
      throw err;
    }
  };

  // Seed mock clients
  const seedMockClients = async (): Promise<void> => {
    console.log("Seeding mock clients");
    
    // If we're offline, just add the mock clients locally
    if (isOfflineMode || !navigator.onLine) {
      const now = new Date().toISOString();
      const offlineMockClients = mockClients.map(client => ({
        ...client,
        createdAt: now,
        updatedAt: now,
        _offlineCreated: true
      }));
      
      setClients(prevClients => [...offlineMockClients, ...prevClients]);
      toast.success("Clients de démonstration ajoutés en mode hors ligne");
      return;
    }
    
    // We're online, add to Firestore with retry
    try {
      // Check if we already have clients
      if (clients.length > 0) {
        console.log("Clients already exist, skipping seeding");
        toast.info("Des clients existent déjà dans la base de données");
        return;
      }
      
      const now = new Date().toISOString();
      const batch = [];
      
      // Prepare all client documents
      for (const mockClient of mockClients) {
        const id = uuidv4();
        const client = {
          ...mockClient,
          id,
          createdAt: now,
          updatedAt: now
        };
        
        // Explicitly cast the status to make TypeScript happy
        client.status = client.status as 'active' | 'inactive' | 'lead';
        
        batch.push(
          setDoc(doc(db, COLLECTIONS.CRM.CLIENTS, id), client)
            .then(() => {
              console.log(`Added mock client: ${client.name}`);
              return client;
            })
            .catch(err => {
              console.error(`Failed to add mock client ${client.name}:`, err);
              throw err;
            })
        );
      }
      
      // Wait for all operations to complete
      const addedClients = await Promise.all(batch);
      
      // Update state with new clients
      setClients(prevClients => [...addedClients, ...prevClients]);
      toast.success(`${addedClients.length} clients de démonstration ajoutés avec succès`);
    } catch (err: any) {
      console.error("Error seeding mock clients:", err);
      
      // If it's a network error, add offline
      if (isNetworkError(err)) {
        console.log("Network error, adding mock clients in offline mode");
        
        const now = new Date().toISOString();
        const offlineMockClients = mockClients.map(client => ({
          ...client,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          _offlineCreated: true
        }));
        
        setClients(prevClients => [...offlineMockClients, ...prevClients]);
        toast.success("Clients de démonstration ajoutés en mode hors ligne");
      } else {
        toast.error("Erreur lors de l'ajout des clients de démonstration: " + (err.message || String(err)));
        throw err;
      }
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
