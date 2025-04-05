
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Reference to the clients collection
  const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);

  // Fetch all clients
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const q = query(clientsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedClients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Client));
      
      setClients(fetchedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new client
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const newClientRef = await addDoc(clientsRef, {
        ...clientData,
        createdAt: serverTimestamp(),
      });
      
      // Refresh clients list
      fetchClients();
      
      return newClientRef.id;
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await updateDoc(clientRef, {
        ...clientData,
        updatedAt: serverTimestamp(),
      });
      
      // Refresh clients list
      fetchClients();
      
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientRef);
      
      // Refresh clients list
      fetchClients();
      
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      throw err;
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // For demo purposes, let's add mock data if no clients exist
  useEffect(() => {
    if (!isLoading && clients.length === 0 && !error) {
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Acme Corporation',
          sector: 'Technology',
          revenue: '1-10M',
          status: 'active',
          contactName: 'John Doe',
          contactEmail: 'john.doe@acme.com',
          contactPhone: '+33123456789',
          address: '123 Main St, Paris',
          notes: 'Key account with long history',
          website: 'https://acme.com',
          createdAt: new Date().toISOString(),
          customerSince: new Date().toISOString().split('T')[0]
        },
        {
          id: '2',
          name: 'Globex Industries',
          sector: 'Manufacturing',
          revenue: '10-50M',
          status: 'active',
          contactName: 'Jane Smith',
          contactEmail: 'j.smith@globex.com',
          contactPhone: '+33987654321',
          address: '456 Avenue de la République, Lyon',
          notes: 'Recent client with expansion plans',
          website: 'https://globex.com',
          createdAt: new Date().toISOString(),
          customerSince: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
      ];
      setClients(mockClients);
    }
  }, [isLoading, clients, error]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient
  };
};
