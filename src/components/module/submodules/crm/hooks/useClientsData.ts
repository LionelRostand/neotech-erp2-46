
import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the Firestore hook with the clients collection
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  // Fetch all clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedClients = await firestore.getAll([orderBy('createdAt', 'desc')]);
      
      // Format the client data
      const formattedClients = fetchedClients.map(client => {
        // Handle Firestore Timestamp conversion
        let createdAtStr = '';
        let customerSinceStr = '';
        
        if (client.createdAt instanceof Timestamp) {
          createdAtStr = client.createdAt.toDate().toISOString();
        } else if (client.createdAt) {
          createdAtStr = new Date(client.createdAt).toISOString();
        } else {
          createdAtStr = new Date().toISOString();
        }
        
        if (client.customerSince instanceof Timestamp) {
          customerSinceStr = client.customerSince.toDate().toISOString().split('T')[0];
        } else if (client.customerSince) {
          customerSinceStr = new Date(client.customerSince).toISOString().split('T')[0];
        } else {
          customerSinceStr = new Date().toISOString().split('T')[0];
        }
        
        return {
          id: client.id,
          ...client,
          createdAt: createdAtStr,
          customerSince: customerSinceStr,
          // Ensure all required fields are present
          name: client.name || '',
          contactName: client.contactName || '',
          contactEmail: client.contactEmail || '',
          contactPhone: client.contactPhone || '',
          sector: client.sector || '',
          revenue: client.revenue || '',
          status: client.status || 'active'
        } as Client;
      });
      
      setClients(formattedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err as Error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  // Add a new client
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      await firestore.add({
        ...clientData,
        createdAt: serverTimestamp(),
      });
      
      // Refresh clients list
      await fetchClients();
      
      toast.success('Client ajouté avec succès');
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      await firestore.update(id, {
        ...clientData,
        updatedAt: serverTimestamp(),
      });
      
      // Refresh clients list
      await fetchClients();
      
      toast.success('Client mis à jour avec succès');
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
      throw err;
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      await firestore.remove(id);
      
      // Refresh clients list
      await fetchClients();
      
      toast.success('Client supprimé avec succès');
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
      throw err;
    }
  };

  // Seed mock data if collection is empty - useful for initialization
  const seedMockClients = async () => {
    try {
      const mockClients: Omit<Client, 'id'>[] = [
        {
          name: 'Acme Corporation',
          sector: 'technology',
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
          name: 'Globex Industries',
          sector: 'manufacturing',
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
      
      const promises = mockClients.map(client => 
        firestore.add({
          ...client,
          createdAt: serverTimestamp(),
        })
      );
      
      await Promise.all(promises);
      console.log('Données de démonstration ajoutées avec succès');
      toast.success('Données de démonstration ajoutées avec succès');
      
      // Refresh clients list
      await fetchClients();
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
      toast.error('Erreur lors de l\'ajout des données de démonstration');
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients
  };
};
