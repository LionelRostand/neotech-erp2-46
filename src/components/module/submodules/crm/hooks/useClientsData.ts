
import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Function to create a mock timestamp (for offline/fallback mode)
const createMockTimestamp = (): FirestoreTimestamp => ({
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0
});

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fetch clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using onSnapshot to listen for real-time updates
      const unsubscribe = onSnapshot(
        collection(db, COLLECTIONS.CRM.CLIENTS),
        (snapshot) => {
          const clientsData: Client[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || '',
              contactName: data.contactName || '',
              contactEmail: data.contactEmail || '',
              contactPhone: data.contactPhone || '',
              sector: data.sector || '',
              status: data.status || 'active',
              revenue: data.revenue || '',
              address: data.address || '',
              website: data.website || '',
              notes: data.notes || '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
          });
          
          setClients(clientsData);
          setIsLoading(false);
          setIsOfflineMode(false);
        },
        (err) => {
          console.error("Firestore clients listener error:", err);
          setError(err as Error);
          setIsLoading(false);
          
          // If error is a 400 or network error, switch to offline mode
          if (err.code === 400 || err.code === "unavailable" || err.message?.includes('400')) {
            setIsOfflineMode(true);
            toast.error("Problème de connexion à la base de données. Mode démo activé.", {
              duration: 4000,
            });
          }
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Error setting up clients listener:", err);
      setError(err);
      setIsLoading(false);
      
      // If error is a 400, switch to offline mode
      if (err.code === 400 || err.message?.includes('400')) {
        setIsOfflineMode(true);
        toast.error("Problème de connexion à la base de données. Mode démo activé.");
      }
      
      return () => {}; // Return empty function as cleanup
    }
  }, []);

  // Initialize data fetch
  useEffect(() => {
    const unsubscribe = fetchClients();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchClients]);

  // Add client
  const addClient = async (formData: ClientFormData): Promise<Client> => {
    try {
      const clientData = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, COLLECTIONS.CRM.CLIENTS), clientData);
      
      toast.success("Client ajouté avec succès");
      
      return { 
        id: docRef.id, 
        ...formData
      } as Client;
    } catch (err: any) {
      console.error("Error adding client:", err);
      
      // Check if it's a 400 error or Firebase is unavailable
      if (err.code === 400 || err.code === "unavailable" || err.message?.includes('400')) {
        setIsOfflineMode(true);
        toast.warning("Mode démo: Client ajouté localement (temporaire)");
        
        // Create a mock client with a UUID and add it to local state
        const mockClient: Client = {
          id: uuidv4(),
          ...formData,
          createdAt: createMockTimestamp(),
          updatedAt: createMockTimestamp()
        };
        
        // Update the local state
        setClients(prev => [mockClient, ...prev]);
        
        return mockClient;
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${err.message}`);
        throw err;
      }
    }
  };

  // Update client
  const updateClient = async (id: string, formData: ClientFormData): Promise<void> => {
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      
      await updateDoc(clientRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Client modifié avec succès");
    } catch (err: any) {
      console.error("Error updating client:", err);
      
      // Check if it's a 400 error or Firebase is unavailable
      if (err.code === 400 || err.code === "unavailable" || err.message?.includes('400')) {
        setIsOfflineMode(true);
        toast.warning("Mode démo: Modifications locales uniquement (temporaire)");
        
        // Update the client in local state
        setClients(prev => 
          prev.map(client => 
            client.id === id ? { 
              ...client, 
              ...formData, 
              updatedAt: createMockTimestamp() 
            } : client
          )
        );
      } else {
        toast.error(`Erreur lors de la modification du client: ${err.message}`);
        throw err;
      }
    }
  };

  // Delete client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientRef);
      
      toast.success("Client supprimé avec succès");
    } catch (err: any) {
      console.error("Error deleting client:", err);
      
      // Check if it's a 400 error or Firebase is unavailable
      if (err.code === 400 || err.code === "unavailable" || err.message?.includes('400')) {
        setIsOfflineMode(true);
        toast.warning("Mode démo: Suppression locale uniquement (temporaire)");
        
        // Remove the client from local state
        setClients(prev => prev.filter(client => client.id !== id));
      } else {
        toast.error(`Erreur lors de la suppression du client: ${err.message}`);
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
    deleteClient
  };
};
