
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { addDocument, getAllDocuments, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Définition des secteurs d'activité pour les clients
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Fabrication' },
  { value: 'services', label: 'Services' },
  { value: 'food', label: 'Alimentation' },
  { value: 'transport', label: 'Transport' },
  { value: 'construction', label: 'Construction' },
  { value: 'energy', label: 'Énergie' },
  { value: 'other', label: 'Autre' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedClients = await getAllDocuments(COLLECTIONS.CRM.CLIENTS);
      setClients(fetchedClients as Client[]);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Add client
  const addClient = useCallback(async (clientData: ClientFormData): Promise<Client | null> => {
    try {
      // Ensure the customerSince field is set
      const data = {
        ...clientData,
        customerSince: clientData.customerSince || new Date().toISOString().split('T')[0],
        status: clientData.status || 'active'
      };

      const newClient = await addDocument(COLLECTIONS.CRM.CLIENTS, data);
      setClients(prev => [newClient as Client, ...prev]);
      return newClient as Client;
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error('Failed to add client');
      return null;
    }
  }, []);

  // Update client
  const updateClient = useCallback(async (id: string, clientData: Partial<ClientFormData>): Promise<Client | null> => {
    try {
      const updatedClient = await updateDocument(COLLECTIONS.CRM.CLIENTS, id, clientData);
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updatedClient } as Client : client
      ));
      return updatedClient as Client;
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Failed to update client');
      return null;
    }
  }, []);

  // Delete client
  const deleteClient = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDocument(COLLECTIONS.CRM.CLIENTS, id);
      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Failed to delete client');
      return false;
    }
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    addClient, 
    updateClient, 
    deleteClient,
    refreshClients: fetchClients
  };
};
