
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
      console.log('Fetching clients from collection:', COLLECTIONS.CRM.CLIENTS);
      
      // Get data directly using the getAll method
      const fetchedClients = await firestore.getAll([orderBy('createdAt', 'desc')]);
      console.log('Fetched clients:', fetchedClients);
      
      // Format the client data
      const formattedClients = fetchedClients.map(client => {
        const typedClient = client as any; // Type assertion to avoid property access errors
        
        // Handle Firestore Timestamp conversion
        let createdAtStr = '';
        let customerSinceStr = '';
        
        if (typedClient.createdAt instanceof Timestamp) {
          createdAtStr = typedClient.createdAt.toDate().toISOString();
        } else if (typedClient.createdAt) {
          createdAtStr = new Date(typedClient.createdAt).toISOString();
        } else {
          createdAtStr = new Date().toISOString();
        }
        
        if (typedClient.customerSince instanceof Timestamp) {
          customerSinceStr = typedClient.customerSince.toDate().toISOString().split('T')[0];
        } else if (typedClient.customerSince) {
          customerSinceStr = new Date(typedClient.customerSince).toISOString().split('T')[0];
        } else {
          customerSinceStr = new Date().toISOString().split('T')[0];
        }
        
        return {
          id: typedClient.id,
          ...typedClient,
          createdAt: createdAtStr,
          customerSince: customerSinceStr,
          // Ensure all required fields are present
          name: typedClient.name || '',
          contactName: typedClient.contactName || '',
          contactEmail: typedClient.contactEmail || '',
          contactPhone: typedClient.contactPhone || '',
          sector: typedClient.sector || '',
          revenue: typedClient.revenue || '',
          status: typedClient.status || 'active'
        } as Client;
      });
      
      console.log('Formatted clients:', formattedClients);
      setClients(formattedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err as Error);
      // Afficher un message d'erreur mais toujours finir le chargement
      toast.error('Erreur lors du chargement des clients. Essayez de rafraîchir la page.');
    } finally {
      // Toujours mettre fin au chargement, même en cas d'erreur
      setIsLoading(false);
    }
  }, [firestore]);

  // Initialiser avec des données de démo si aucun client n'est trouvé
  const initializeWithDemoData = useCallback(async () => {
    try {
      await seedMockClients();
      console.log('Demo data initialized');
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
    }
  }, []);

  // Add a new client
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      // Ensure all required fields are present before adding to Firestore
      const sanitizedData = {
        name: clientData.name || '',
        contactName: clientData.contactName || '',
        contactEmail: clientData.contactEmail || '',
        contactPhone: clientData.contactPhone || '',
        sector: clientData.sector || '',
        revenue: clientData.revenue || '',
        status: clientData.status || 'active',
        address: clientData.address || '',
        website: clientData.website || '',
        notes: clientData.notes || '',
        customerSince: clientData.customerSince || new Date().toISOString().split('T')[0]
      };

      await firestore.add({
        ...sanitizedData,
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
  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      // Create a clean object with only valid Firestore fields
      const updateData: Record<string, any> = {};
      
      // Add only defined properties to update data
      Object.entries(clientData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'createdAt') {
          updateData[key] = value;
        }
      });

      await firestore.update(id, {
        ...updateData,
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
      
      // Add each client individually with proper error handling
      for (const client of mockClients) {
        try {
          await firestore.add({
            ...client,
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          console.error('Error adding mock client:', error);
          // Continue with the next client even if one fails
        }
      }
      
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
    const loadData = async () => {
      await fetchClients();
    };
    
    loadData();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients,
    initializeWithDemoData
  };
};
