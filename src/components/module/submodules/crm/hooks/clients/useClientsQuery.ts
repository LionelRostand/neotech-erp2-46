
import { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client } from '@/types/crm';
import { mockClients } from '../../data/mockClients';

export const useClientsQuery = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS || 'crm_clients');
      const clientsQuery = query(clientsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(clientsQuery);
      
      const fetchedClients: Client[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        } as Client;
      });
      
      setClients(fetchedClients);
      setIsOfflineMode(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Une erreur est survenue lors de la récupération des clients.');
      
      // If online but error occurred, don't use mock data
      if (navigator.onLine) {
        setClients([]);
      } else {
        // If offline, use mock data
        setIsOfflineMode(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchClients();
    
    // Listen for online/offline events
    const handleOnline = () => {
      if (isOfflineMode) {
        fetchClients();
      }
    };
    
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchClients, isOfflineMode]);
  
  const cancelLoading = () => {
    if (isLoading) {
      setIsLoading(false);
    }
  };
  
  const seedMockClients = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would add the clients to Firestore
      // For now, we just set the mock data locally
      setClients(mockClients);
      return true;
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      setError('Une erreur est survenue lors de l\'ajout des clients de test.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    clients: clients || [], 
    isLoading, 
    error, 
    isOfflineMode,
    fetchClients,
    cancelLoading,
    seedMockClients
  };
};
