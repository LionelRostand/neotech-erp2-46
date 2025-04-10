
import { useState, useCallback, useEffect } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Client } from '../../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import mockClients from '../../data/mockClients';
import { toast } from 'sonner';

export const useClientsQuery = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [loadingOperationCancelled, setLoadingOperationCancelled] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setLoadingOperationCancelled(false);
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!auth.currentUser) {
        console.log("L'utilisateur n'est pas authentifié, affichage des données de démo");
        setClients(mockClients);
        setIsOfflineMode(true);
        return;
      }

      // Use the correct collection path from COLLECTIONS
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const clientsQuery = query(clientsCollection);
      const querySnapshot = await getDocs(clientsQuery);
      
      const clientsData: Client[] = [];
      querySnapshot.forEach(doc => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      
      console.log(`Retrieved ${clientsData.length} clients from Firestore`);
      setClients(clientsData);
      setIsOfflineMode(false);
      setError(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching clients:', error);
      
      if (error.message.includes('offline') || 
          error.message.includes('unavailable')) {
        console.log('Network error, using mock data');
        toast.error('Application fonctionnant en mode hors ligne');
        setClients(mockClients);
        setIsOfflineMode(true);
      } else if ((error as any).code === 'permission-denied') {
        toast.error("Erreur d'accès: permissions insuffisantes");
        console.error("Permission denied accessing clients collection");
        setClients(mockClients);
      } else {
        setError(error);
        toast.error(`Erreur lors du chargement des clients: ${error.message}`);
      }
    } finally {
      if (!loadingOperationCancelled) {
        setIsLoading(false);
      }
    }
  }, [loadingOperationCancelled]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const cancelLoading = useCallback(() => {
    console.log("Loading operation cancelled");
    setLoadingOperationCancelled(true);
    setIsLoading(false);
  }, []);

  const seedMockClients = async () => {
    setIsLoading(true);
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!auth.currentUser) {
        toast.error("Vous devez être connecté pour ajouter des données démo");
        return;
      }
      
      for (const mockClient of mockClients) {
        // Use the correct collection path from COLLECTIONS
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        await addDoc(clientsCollection, {
          ...mockClient,
          id: undefined,
          createdBy: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      toast.success("Données démo ajoutées avec succès");
      await fetchClients();
    } catch (error: any) {
      console.error("Error seeding mock clients:", error);
      
      if (error.code === 'permission-denied') {
        toast.error("Vous n'avez pas les droits nécessaires pour ajouter des données démo");
      } else {
        toast.error(`Erreur lors de l'ajout des données démo: ${error.message}`);
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
    cancelLoading,
    seedMockClients
  };
};
