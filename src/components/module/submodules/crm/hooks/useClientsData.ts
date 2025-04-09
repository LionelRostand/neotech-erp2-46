
import { useState, useCallback, useEffect } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import useFirestore from '@/hooks/useFirestore';
import { toast } from 'sonner';
import mockClientsData from '../data/mockClients';

/**
 * Hook for managing client data in Firestore with offline fallback
 */
export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  
  // Create a firestore hook instance for the clients collection
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Function to fetch all clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsCancelled(false);
    
    try {
      console.log("Fetching clients from Firestore");
      const result = await firestore.getAll();
      
      if (isCancelled) {
        console.log("Fetch operation was cancelled");
        return;
      }
      
      // Map the result to proper Client objects with all required properties
      const mappedClients: Client[] = result.map(item => {
        // Ensure all required fields are present with default values if not
        return {
          id: item.id || '',
          name: item.name || '',
          contactName: item.contactName || '',
          contactEmail: item.contactEmail || '',
          contactPhone: item.contactPhone || '',
          sector: item.sector || '',
          revenue: item.revenue || '',
          createdAt: item.createdAt || new Date().toISOString(),
          // Ensure status is one of the valid enum values
          status: (item.status as 'active' | 'inactive' | 'lead') || 'active',
          // Optional fields
          address: item.address || undefined,
          website: item.website || undefined,
          notes: item.notes || undefined,
          updatedAt: item.updatedAt || undefined,
          customerSince: item.customerSince || undefined,
          _offlineCreated: item._offlineCreated || undefined,
          _offlineUpdated: item._offlineUpdated || undefined,
          _offlineDeleted: item._offlineDeleted || undefined
        };
      });
      
      console.log("Fetched clients:", mappedClients);
      setClients(mappedClients);
      setIsOfflineMode(false);
    } catch (err) {
      if (isCancelled) {
        console.log("Error handling skipped due to cancelled operation");
        return;
      }
      
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // If we get an error, we'll switch to offline mode with mock data
      console.log("Switching to offline mode with mock data");
      setClients(mockClientsData);
      setIsOfflineMode(true);
      
      // Show offline mode notification
      toast.error("Impossible de se connecter au serveur. Mode démo activé.");
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  }, [firestore, isCancelled]);
  
  // Function to cancel ongoing operations
  const cancelLoading = useCallback(() => {
    console.log("Cancelling client data loading");
    setIsCancelled(true);
    setIsLoading(false);
  }, []);
  
  // Load clients on initial mount
  useEffect(() => {
    fetchClients();
    
    // Cleanup
    return () => {
      cancelLoading();
    };
  }, [fetchClients, cancelLoading]);
  
  // Function to add a new client
  const addClient = async (clientData: ClientFormData) => {
    try {
      console.log("Adding new client:", clientData);
      
      // Create properly typed client data, with createdAt timestamp
      const newClientData: Partial<Client> = {
        createdAt: new Date().toISOString(),
        name: clientData.name,
        contactName: clientData.contactName,
        contactEmail: clientData.contactEmail,
        contactPhone: clientData.contactPhone,
        sector: clientData.sector,
        // Ensure status is a valid enum value
        status: clientData.status as 'active' | 'inactive' | 'lead',
        revenue: clientData.revenue,
        address: clientData.address,
        website: clientData.website,
        notes: clientData.notes
      };
      
      let result;
      
      if (isOfflineMode) {
        // In offline mode, just create a mock client with ID
        const mockId = `offline_${Date.now()}`;
        result = { 
          id: mockId, 
          ...newClientData, 
          _offlineCreated: true 
        };
        
        // Update local state
        setClients(prev => [...prev, result as Client]);
        
        // Show success message
        toast.success("Client ajouté en mode démo");
      } else {
        // Add to Firestore
        result = await firestore.add(newClientData);
        
        // Refetch to update the list
        fetchClients();
        
        // Show success message
        toast.success("Client ajouté avec succès");
      }
      
      return result;
    } catch (err) {
      console.error("Error adding client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur lors de l'ajout du client: ${errorMessage}`);
      throw err;
    }
  };
  
  // Function to update an existing client
  const updateClient = async (id: string, clientData: ClientFormData) => {
    try {
      console.log("Updating client:", id, clientData);
      
      // Create properly typed update data, with updatedAt timestamp
      const updateData: Partial<Client> = {
        updatedAt: new Date().toISOString(),
        name: clientData.name,
        contactName: clientData.contactName,
        contactEmail: clientData.contactEmail,
        contactPhone: clientData.contactPhone,
        sector: clientData.sector,
        // Ensure status is a valid enum value
        status: clientData.status as 'active' | 'inactive' | 'lead',
        revenue: clientData.revenue,
        address: clientData.address,
        website: clientData.website,
        notes: clientData.notes
      };
      
      let result;
      
      if (isOfflineMode) {
        // In offline mode, update the client in local state
        setClients(prev => 
          prev.map(client => 
            client.id === id 
              ? { ...client, ...updateData, _offlineUpdated: true } 
              : client
          )
        );
        
        result = { id, ...updateData, _offlineUpdated: true };
        
        // Show success message for demo mode
        toast.success("Client mis à jour en mode démo");
      } else {
        // Update in Firestore
        result = await firestore.update(id, updateData);
        
        // Refetch to update the list
        fetchClients();
        
        // Show success message
        toast.success("Client mis à jour avec succès");
      }
      
      return result;
    } catch (err) {
      console.error("Error updating client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur lors de la mise à jour du client: ${errorMessage}`);
      throw err;
    }
  };
  
  // Function to delete a client
  const deleteClient = async (id: string) => {
    try {
      console.log("Deleting client:", id);
      
      if (isOfflineMode) {
        // In offline mode, just remove from local state
        setClients(prev => prev.filter(client => client.id !== id));
        
        // Show success message for demo mode
        toast.success("Client supprimé en mode démo");
        return { id, _offlineDeleted: true };
      } else {
        // Delete from Firestore
        await firestore.remove(id);
        
        // Refetch to update the list
        fetchClients();
        
        // Show success message
        toast.success("Client supprimé avec succès");
        return { id };
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur lors de la suppression du client: ${errorMessage}`);
      throw err;
    }
  };
  
  // Function to seed mock clients data
  const seedMockClients = async () => {
    try {
      console.log("Seeding mock clients data");
      
      if (isOfflineMode) {
        // In offline mode, just set the clients state with mock data
        setClients(mockClientsData);
        toast.success("Données de démonstration ajoutées avec succès");
        return mockClientsData;
      } else {
        // Add each mock client to Firestore
        const results = [];
        
        for (const client of mockClientsData) {
          // Remove id and offline properties when adding to Firestore
          const { id, _offlineCreated, _offlineUpdated, _offlineDeleted, ...clientData } = client;
          results.push(await firestore.add(clientData));
        }
        
        // Refetch to update the list
        fetchClients();
        
        toast.success("Données de démonstration ajoutées avec succès");
        return results;
      }
    } catch (err) {
      console.error("Error seeding mock data:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(`Erreur lors de l'ajout des données de démonstration: ${errorMessage}`);
      throw err;
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
