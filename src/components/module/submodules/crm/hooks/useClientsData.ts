
import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import mockClientsData from "../data/mockClients";
import { toast } from 'sonner';
import { executeWithNetworkRetry, isNetworkError } from '@/hooks/firestore/network-handler';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  
  // Flag to indicate if the loading operation has been cancelled
  const [loadingCancelled, setLoadingCancelled] = useState(false);

  // Function to cancel the loading operation
  const cancelLoading = useCallback(() => {
    console.log("Loading operation cancelled");
    setLoadingCancelled(true);
    setIsLoading(false);
  }, []);

  // Fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setLoadingCancelled(false); // Reset the cancellation flag
    setLoadingTimedOut(false); // Reset the timeout flag
    
    try {
      // Utilisation explicite de la collection crm_clients
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const clientsQuery = query(clientsCollection);
      
      // Add a timeout for the fetch operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          setLoadingTimedOut(true);
          setIsLoading(false);
          reject(new Error('Le chargement des données a pris trop de temps'));
        }, 10000); // 10 seconds timeout
      });
      
      // Race between the fetch operation and the timeout
      const querySnapshot = await Promise.race([
        getDocs(clientsQuery),
        timeoutPromise
      ]);
      
      if (loadingCancelled) {
        console.log("Fetch operation cancelled, not processing results");
        return; // Do not process results if loading was cancelled
      }
      
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      
      setClients(clientsData);
      setError(null);
    } catch (err: any) {
      if (loadingTimedOut) {
        console.warn("Fetch operation timed out, handling error");
        toast.warning("Le chargement des données a pris trop de temps. Veuillez vérifier votre connexion.");
      } else if (isNetworkError(err)) {
        console.error('Network error while fetching clients:', err);
        setIsOfflineMode(true);
        toast.error("Mode hors ligne activé. Les modifications ne seront pas synchronisées tant que vous n'êtes pas en ligne.");
      } else {
        console.error('Error fetching clients:', err);
        setError(err);
        toast.error(`Erreur lors du chargement des clients: ${err.message}`);
      }
    } finally {
      if (!loadingTimedOut && !loadingCancelled) {
        setIsLoading(false);
      }
    }
  }, [loadingCancelled, loadingTimedOut]);

  // Add a client to Firestore
  const addClient = async (clientData: ClientFormData): Promise<Client | void> => {
    try {
      // S'assurer que le statut est de type correct
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const newClient: Client = {
        id: uuidv4(),
        ...clientData,
        status: statusValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Execute the add operation with network retry
      await executeWithNetworkRetry(async () => {
        // Utilisation explicite de la collection crm_clients
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        await addDoc(clientsCollection, newClient);
        console.log("Client added to collection:", COLLECTIONS.CRM.CLIENTS);
        toast.success("Client ajouté avec succès");
      });
      
      // Optimistically update the local state
      setClients(prevClients => [...prevClients, newClient]);
      return newClient;
    } catch (error: any) {
      console.error("Error adding client:", error);
      
      if (isNetworkError(error)) {
        setIsOfflineMode(true);
        toast.error("Mode hors ligne activé. Les modifications ne seront pas synchronisées tant que vous n'êtes pas en ligne.");
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${error.message}`);
      }
    }
  };

  // Update a client in Firestore
  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | void> => {
    try {
      // S'assurer que le statut est de type correct
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const updatedClient: Client = {
        id: clientId,
        ...clientData,
        status: statusValue,
        updatedAt: new Date().toISOString(),
      };
      
      // Execute the update operation with network retry
      await executeWithNetworkRetry(async () => {
        // Utilisation explicite de la collection crm_clients
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        const updateData = { ...clientData, status: statusValue, updatedAt: new Date().toISOString() };
        await updateDoc(clientDocRef, updateData);
        console.log("Client updated in collection:", COLLECTIONS.CRM.CLIENTS);
        toast.success("Client mis à jour avec succès");
      });
      
      // Optimistically update the local state
      setClients(prevClients =>
        prevClients.map(client => (client.id === clientId ? updatedClient : client))
      );
      return updatedClient;
    } catch (error: any) {
      console.error("Error updating client:", error);
      
      if (isNetworkError(error)) {
        setIsOfflineMode(true);
        toast.error("Mode hors ligne activé. Les modifications ne seront pas synchronisées tant que vous n'êtes pas en ligne.");
      } else {
        toast.error(`Erreur lors de la mise à jour du client: ${error.message}`);
      }
    }
  };

  // Delete a client from Firestore
  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      // Execute the delete operation with network retry
      await executeWithNetworkRetry(async () => {
        // Utilisation explicite de la collection crm_clients
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await deleteDoc(clientDocRef);
        console.log("Client deleted from collection:", COLLECTIONS.CRM.CLIENTS);
        toast.success("Client supprimé avec succès");
      });
      
      // Optimistically update the local state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    } catch (error: any) {
      console.error("Error deleting client:", error);
      
      if (isNetworkError(error)) {
        setIsOfflineMode(true);
        toast.error("Mode hors ligne activé. Les modifications ne seront pas synchronisées tant que vous n'êtes pas en ligne.");
      } else {
        toast.error(`Erreur lors de la suppression du client: ${error.message}`);
      }
    }
  };

  // Seed mock clients into Firestore
  const seedMockClients = async () => {
    setIsLoading(true);
    try {
      console.log("Seeding clients to collection:", COLLECTIONS.CRM.CLIENTS);
      
      for (const client of mockClientsData) {
        // S'assurer que le statut est de type correct
        const statusValue = client.status as 'active' | 'inactive' | 'lead';
        const clientWithCorrectStatus = { ...client, status: statusValue };
        
        // Utilisation explicite de la collection crm_clients
        const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, client.id);
        await executeWithNetworkRetry(async () => {
          await updateDoc(clientRef, clientWithCorrectStatus);
        });
      }
      
      // After seeding, refresh the client list
      await fetchClients();
      toast.success("Données de démonstration ajoutées avec succès");
    } catch (error: any) {
      console.error("Error seeding mock clients:", error);
      
      if (isNetworkError(error)) {
        setIsOfflineMode(true);
        toast.error("Mode hors ligne activé. Les modifications ne seront pas synchronisées tant que vous n'êtes pas en ligne.");
      } else {
        toast.error(`Erreur lors de l'ajout des données de démonstration: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
