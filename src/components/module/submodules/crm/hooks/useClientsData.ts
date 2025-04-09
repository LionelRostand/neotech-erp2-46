
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import useFirestore from '@/hooks/useFirestore';
import { toast } from 'sonner';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Use the CRM.CLIENTS collection from Firebase
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsData = await firestore.getAll();
      console.log('Fetched clients data:', clientsData);
      setClients(clientsData as Client[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error(`Erreur lors du chargement des clients: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  // Add a new client
  const addClient = useCallback(async (clientData: ClientFormData) => {
    try {
      console.log('Adding client:', clientData);
      // Get current timestamp in ISO format
      const now = new Date().toISOString();
      
      // Prepare data with timestamps
      const newClientData = {
        ...clientData,
        createdAt: now,
        updatedAt: now,
      };
      
      // Add document to Firestore
      const result = await firestore.add(newClientData);
      console.log('Added client result:', result);
      
      // Create a full client object with the returned ID
      const newClient: Client = {
        id: result.id,
        ...newClientData,
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      // Update local state
      setClients(prevClients => [...prevClients, newClient]);
      
      toast.success(`Client "${clientData.name}" ajouté avec succès`);
      return newClient;
    } catch (err) {
      console.error('Error adding client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      // Check if this is a network error
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend')) {
        setIsOfflineMode(true);
        toast.info('Client enregistré en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${message}`);
      }
      
      throw err;
    }
  }, [firestore]);

  // Update an existing client
  const updateClient = useCallback(async (id: string, clientData: ClientFormData) => {
    try {
      console.log('Updating client:', id, clientData);
      // Add updated timestamp
      const updatedData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      // Update document in Firestore
      const result = await firestore.update(id, updatedData);
      console.log('Update client result:', result);
      
      // Update local state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...updatedData, 
                status: clientData.status as 'active' | 'inactive' | 'lead',
              } 
            : client
        )
      );
      
      toast.success(`Client "${clientData.name}" mis à jour avec succès`);
      return result;
    } catch (err) {
      console.error('Error updating client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      // Check if this is a network error
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend')) {
        setIsOfflineMode(true);
        toast.info('Modification enregistrée en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
        
        // Even in offline mode, update the local state
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  ...clientData, 
                  updatedAt: new Date().toISOString(),
                  status: clientData.status as 'active' | 'inactive' | 'lead',
                  _offlineUpdated: true,
                } 
              : client
          )
        );
        
        return { id, _offlineUpdated: true };
      } else {
        toast.error(`Erreur lors de la mise à jour du client: ${message}`);
        throw err;
      }
    }
  }, [firestore]);

  // Delete a client
  const deleteClient = useCallback(async (id: string) => {
    try {
      console.log('Deleting client:', id);
      // Delete document from Firestore
      const result = await firestore.remove(id);
      console.log('Delete client result:', result);
      
      // Update local state
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      
      toast.success('Client supprimé avec succès');
      return result;
    } catch (err) {
      console.error('Error deleting client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend')) {
        setIsOfflineMode(true);
        toast.info('Suppression enregistrée en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
        
        // Even in offline mode, update the local state
        setClients(prevClients => prevClients.filter(client => client.id !== id));
        
        return { id, _offlineDeleted: true };
      } else {
        toast.error(`Erreur lors de la suppression du client: ${message}`);
        throw err;
      }
    }
  }, [firestore]);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
    
    // Check if we're in offline mode
    const handleOnlineStatus = () => {
      const isOnline = navigator.onLine;
      setIsOfflineMode(!isOnline);
      
      // If we're back online and were previously offline, refresh data
      if (isOnline && isOfflineMode) {
        toast.info('Connexion rétablie. Synchronisation des données...');
        fetchClients();
      }
    };
    
    // Setup online/offline listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Initial check
    setIsOfflineMode(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [fetchClients, isOfflineMode]);

  return {
    clients,
    isLoading,
    error,
    isOfflineMode,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
};
