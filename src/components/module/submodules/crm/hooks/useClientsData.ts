
import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ClientFormData, Client } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';
import { mockClients } from '../data/mockClients';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [loadingOperationCancelled, setLoadingOperationCancelled] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setLoadingOperationCancelled(false);
    try {
      // Attempt to get real data from Firestore
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const clientsQuery = query(clientsCollection);
      const querySnapshot = await getDocs(clientsQuery);
      
      // Process the results
      const clientsData: Client[] = [];
      querySnapshot.forEach(doc => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      
      console.log(`Retrieved ${clientsData.length} clients from Firestore`);
      setClients(clientsData);
      setIsOfflineMode(false);
      setError(null);
    } catch (err) {
      // Handle error and fall back to mock data if appropriate
      const error = err as Error;
      console.error('Error fetching clients:', error);
      
      // Only show error message for network-related errors
      if (error.message.includes('offline') || 
          error.message.includes('unavailable')) {
        console.log('Network error, using mock data');
        toast.error('Application fonctionnant en mode hors ligne');
        setClients(mockClients);
        setIsOfflineMode(true);
      } else {
        // For other errors, show the error message
        setError(error);
        toast.error(`Erreur lors du chargement des clients: ${error.message}`);
      }
    } finally {
      if (!loadingOperationCancelled) {
        setIsLoading(false);
      }
    }
  }, [loadingOperationCancelled]);

  // Load clients when the component mounts
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const cancelLoading = useCallback(() => {
    console.log("Loading operation cancelled");
    setLoadingOperationCancelled(true);
    setIsLoading(false);
  }, []);

  // Seed mock clients for demonstration purposes
  const seedMockClients = async () => {
    setIsLoading(true);
    try {
      // Add each mock client to Firebase
      for (const mockClient of mockClients) {
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        await addDoc(clientsCollection, {
          ...mockClient,
          id: undefined // Firebase will assign an ID
        });
      }
      
      toast.success("Données démo ajoutées avec succès");
      // Refresh the client list after seeding
      await fetchClients();
    } catch (error: any) {
      console.error("Error seeding mock clients:", error);
      toast.error(`Erreur lors de l'ajout des données démo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: ClientFormData): Promise<Client | void> => {
    try {
      setIsLoading(true);
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      // Préparer les données client pour Firebase (sans ID)
      const newClientData = {
        ...clientData,
        status: statusValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Ajouter à Firebase
      let docRef;
      await executeWithNetworkRetry(async () => {
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        docRef = await addDoc(clientsCollection, newClientData);
        console.log(`Client added to collection ${COLLECTIONS.CRM.CLIENTS} with ID: ${docRef.id}`);
        toast.success("Client ajouté avec succès");
      });
      
      // Récupérer les données mises à jour depuis Firebase
      await fetchClients();
      
      // Retourner le nouveau client avec l'ID généré
      if (docRef) {
        return { 
          id: docRef.id, 
          ...newClientData 
        } as Client;
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible d'ajouter le client en mode hors ligne");
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | void> => {
    try {
      setIsLoading(true);
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const updateData = {
        ...clientData,
        status: statusValue,
        updatedAt: new Date().toISOString(),
      };
      
      await executeWithNetworkRetry(async () => {
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await updateDoc(clientDocRef, updateData);
        console.log(`Client ${clientId} updated successfully`);
        toast.success("Client mis à jour avec succès");
      });
      
      // Récupérer les données mises à jour depuis Firebase
      await fetchClients();
      
      return { 
        id: clientId, 
        ...updateData 
      } as Client;
    } catch (error: any) {
      console.error("Error updating client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible de mettre à jour le client en mode hors ligne");
      } else {
        toast.error(`Erreur lors de la mise à jour du client: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      setIsLoading(true);
      await executeWithNetworkRetry(async () => {
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await deleteDoc(clientDocRef);
        console.log(`Client ${clientId} deleted successfully`);
        toast.success("Client supprimé avec succès");
      });
      
      // Récupérer les données mises à jour depuis Firebase
      await fetchClients();
    } catch (error: any) {
      console.error("Error deleting client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible de supprimer le client en mode hors ligne");
      } else {
        toast.error(`Erreur lors de la suppression du client: ${error.message}`);
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
