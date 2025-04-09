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
  const [loadingCancelled, setLoadingCancelled] = useState(false);

  const cancelLoading = useCallback(() => {
    console.log("Loading operation cancelled");
    setLoadingCancelled(true);
    setIsLoading(false);
  }, []);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setLoadingCancelled(false);
    setLoadingTimedOut(false);
    
    try {
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const clientsQuery = query(clientsCollection);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          setLoadingTimedOut(true);
          setIsLoading(false);
          reject(new Error('Le chargement des données a pris trop de temps'));
        }, 10000);
      });
      
      const querySnapshot = await Promise.race([
        getDocs(clientsQuery),
        timeoutPromise
      ]);
      
      if (loadingCancelled) {
        console.log("Fetch operation cancelled, not processing results");
        return;
      }
      
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      
      console.log(`Successfully fetched ${clientsData.length} clients from Firebase collection ${COLLECTIONS.CRM.CLIENTS}`);
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

  const addClient = async (clientData: ClientFormData): Promise<Client | void> => {
    try {
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const newClient: Client = {
        id: uuidv4(),
        ...clientData,
        status: statusValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await executeWithNetworkRetry(async () => {
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        const docRef = await addDoc(clientsCollection, newClient);
        newClient.id = docRef.id;
        console.log(`Client added to collection ${COLLECTIONS.CRM.CLIENTS} with ID: ${docRef.id}`);
        toast.success("Client ajouté avec succès");
      });
      
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

  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | void> => {
    try {
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const existingClientIndex = clients.findIndex(client => client.id === clientId);
      const existingClient = existingClientIndex >= 0 ? clients[existingClientIndex] : null;
      
      if (!existingClient) {
        console.error("Client not found for update:", clientId);
        toast.error("Client introuvable pour la mise à jour");
        return;
      }
      
      const updatedClient: Client = {
        id: clientId,
        ...clientData,
        status: statusValue,
        createdAt: existingClient.createdAt,
        updatedAt: new Date().toISOString(),
      };
      
      await executeWithNetworkRetry(async () => {
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        const updateData = { 
          ...clientData, 
          status: statusValue, 
          updatedAt: new Date().toISOString() 
        };
        await updateDoc(clientDocRef, updateData);
        console.log(`Client updated in collection ${COLLECTIONS.CRM.CLIENTS} with ID: ${clientId}`);
        toast.success("Client mis à jour avec succès");
      });
      
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

  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      await executeWithNetworkRetry(async () => {
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await deleteDoc(clientDocRef);
        console.log(`Client deleted from collection ${COLLECTIONS.CRM.CLIENTS} with ID: ${clientId}`);
        toast.success("Client supprimé avec succès");
      });
      
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

  const seedMockClients = async () => {
    setIsLoading(true);
    try {
      console.log(`Seeding ${mockClientsData.length} mock clients to collection: ${COLLECTIONS.CRM.CLIENTS}`);
      
      for (const client of mockClientsData) {
        const statusValue = client.status as 'active' | 'inactive' | 'lead';
        const clientWithCorrectStatus = { 
          ...client, 
          status: statusValue,
          createdAt: client.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await executeWithNetworkRetry(async () => {
          const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
          await addDoc(clientsCollection, clientWithCorrectStatus);
        });
      }
      
      console.log(`Successfully seeded ${mockClientsData.length} mock clients to Firebase collection ${COLLECTIONS.CRM.CLIENTS}`);
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
