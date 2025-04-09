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

  // Function to fetch clients from Firestore with timeouts
  const fetchClients = useCallback(async () => {
    // Reset cancellation state
    setIsCancelled(false);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching clients from Firestore...");
      
      // Add a timeout to the fetch operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Délai d\'attente dépassé lors du chargement des clients'));
        }, 5000); // 5 seconds timeout
        
        // Clean up timeout if needed
        if (isCancelled) clearTimeout(timeoutId);
      });
      
      // Race between the actual fetch and the timeout
      const clientsData = await Promise.race([
        clientsFirestore.getAll(),
        timeoutPromise
      ]);
      
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
      
      // Handle timeout error specifically
      if (err instanceof Error && err.message.includes('Délai d\'attente')) {
        console.log("Timeout occurred, using mock data");
        setIsOfflineMode(true);
        setClients(mockClientsData);
        setError(err);
        toast.warning("Le délai de chargement a été dépassé. Utilisation des données de démonstration.");
        return;
      }
      
      // Handle firebase's offline mode
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || 
          errorMessage.includes('unavailable') || 
          errorMessage.includes('internal') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('timed out')) {
        console.log("Using offline mode with mock data");
        setIsOfflineMode(true);
        setClients(mockClientsData);
        setError(null);
        toast.info("Mode hors ligne activé. Les données locales sont affichées.");
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

  // Add a new client with timeout handling
  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    try {
      // Validate required fields
      if (!clientData.name?.trim()) {
        throw new Error("Le nom du client est obligatoire");
      }
      
      // Prepare client data with timestamp
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      console.log("Adding client to Firebase:", newClient);
      
      // Add a timeout to the add operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Délai d\'attente dépassé lors de l\'ajout du client'));
        }, 7000); // 7 seconds timeout
      });
      
      // Race between the actual add and the timeout
      const addedClient = await Promise.race([
        clientsFirestore.add(newClient),
        timeoutPromise
      ]);
      
      console.log("Client added successfully, response:", addedClient);
      
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
      
      // Handle timeout error specifically
      if (err instanceof Error && err.message.includes('Délai d\'attente')) {
        // Attempt to save in offline mode
        const offlineClient: Client = {
          id: `offline_${Date.now()}`,
          name: clientData.name || '',
          contactName: clientData.contactName || '',
          contactEmail: clientData.contactEmail || '',
          contactPhone: clientData.contactPhone || '',
          sector: clientData.sector || '',
          revenue: clientData.revenue || '',
          status: clientData.status as 'active' | 'inactive' | 'lead',
          address: clientData.address || '',
          website: clientData.website || '',
          notes: clientData.notes || '',
          createdAt: new Date().toISOString(),
          _offlineCreated: true,
          _offlineUpdated: false,
          _offlineDeleted: false
        };
        
        setClients(prev => [...prev, offlineClient]);
        setIsOfflineMode(true);
        
        toast.warning("Délai d'attente dépassé. Le client a été sauvegardé localement et sera synchronisé ultérieurement.");
        return offlineClient;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de l'ajout du client: ${errorMessage}`);
      throw err;
    }
  };

  // Update an existing client with timeout handling
  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    try {
      // Prepare update data with timestamp
      const updateData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      // Add a timeout to the update operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Délai d\'attente dépassé lors de la mise à jour du client'));
        }, 7000); // 7 seconds timeout
      });
      
      // Race between the actual update and the timeout
      await Promise.race([
        clientsFirestore.update(id, updateData),
        timeoutPromise
      ]);
      
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
      
      // Handle timeout error specifically
      if (err instanceof Error && err.message.includes('Délai d\'attente')) {
        // Find the client to update locally
        const currentClient = clients.find(client => client.id === id);
        if (!currentClient) {
          throw new Error(`Client with ID ${id} not found`);
        }
        
        // Update the client locally
        const offlineUpdatedClient: Client = {
          ...currentClient,
          ...clientData,
          updatedAt: new Date().toISOString(),
          _offlineUpdated: true
        };
        
        setClients(prev => 
          prev.map(client => client.id === id ? offlineUpdatedClient : client)
        );
        
        setIsOfflineMode(true);
        toast.warning("Délai d'attente dépassé. Les modifications ont été sauvegardées localement et seront synchronisées ultérieurement.");
        return offlineUpdatedClient;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la mise à jour du client: ${errorMessage}`);
      throw err;
    }
  };

  // Delete a client with timeout handling
  const deleteClient = async (id: string): Promise<void> => {
    try {
      // Add a timeout to the delete operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Délai d\'attente dépassé lors de la suppression du client'));
        }, 7000); // 7 seconds timeout
      });
      
      // Race between the actual delete and the timeout
      await Promise.race([
        clientsFirestore.remove(id),
        timeoutPromise
      ]);
      
      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast.success("Client supprimé avec succès");
    } catch (err) {
      console.error("Error deleting client:", err);
      
      // Handle timeout error specifically
      if (err instanceof Error && err.message.includes('Délai d\'attente')) {
        // Mark client as deleted locally
        const deletedClient = clients.find(client => client.id === id);
        if (deletedClient) {
          const offlineDeletedClient: Client = {
            ...deletedClient,
            _offlineDeleted: true
          };
          
          // Keep in list but mark as deleted for later sync
          setClients(prev => 
            prev.map(client => client.id === id ? offlineDeletedClient : client).filter(client => !client._offlineDeleted)
          );
          
          setIsOfflineMode(true);
          toast.warning("Délai d'attente dépassé. Le client a été marqué pour suppression et sera synchronisé ultérieurement.");
          return;
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Erreur lors de la suppression du client: ${errorMessage}`);
      throw err;
    }
  };

  // Seed mock clients to Firestore with timeout handling
  const seedMockClients = async (): Promise<void> => {
    try {
      setIsLoading(true);
      let seedCount = 0;
      let timeoutCount = 0;
      
      const addClientWithTimeout = async (clientData: any) => {
        try {
          // Add a timeout to each add operation
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('timeout'));
            }, 5000); // 5 seconds timeout per client
          });
          
          // Race between the actual add and the timeout
          await Promise.race([
            clientsFirestore.add(clientData),
            timeoutPromise
          ]);
          
          seedCount++;
          return true;
        } catch (err) {
          if (err instanceof Error && err.message.includes('timeout')) {
            timeoutCount++;
            return false;
          }
          throw err;
        }
      };
      
      // Process clients in batches to reduce timeouts
      const batchSize = 3;
      for (let i = 0; i < mockClientsData.length; i += batchSize) {
        const batch = mockClientsData.slice(i, i + batchSize);
        
        // Process batch in parallel
        const promises = batch.map(client => {
          // Skip the ID as Firestore will generate one
          const { id, ...clientData } = client;
          return addClientWithTimeout(clientData);
        });
        
        await Promise.all(promises);
        
        // Show progress toast
        if ((i + batchSize) < mockClientsData.length) {
          toast.info(`Ajout des clients en cours... ${i + batchSize}/${mockClientsData.length}`);
        }
      }
      
      // Refresh the clients list to get the newly added documents
      await fetchClients();
      
      if (timeoutCount > 0) {
        toast.warning(`${seedCount} clients ajoutés. ${timeoutCount} clients n'ont pas pu être ajoutés en raison d'un délai d'attente.`);
      } else {
        toast.success(`${seedCount} clients de démonstration ajoutés avec succès`);
      }
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
