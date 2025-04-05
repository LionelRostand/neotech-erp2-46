
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the correct path from collections
  const crmClientsPath = COLLECTIONS.CRM.CLIENTS; // 'crm/clients'
  
  // Create a function to get the correct collection reference
  const getClientsCollection = () => {
    // For 'crm/clients' path, we need to use a different approach
    // We'll use a static document ID for the parent document
    const crmDocId = 'crm'; // Static document ID for the crm document
    return collection(db, 'crm', crmDocId, 'clients');
  };

  // Fetch all clients
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const clientsRef = getClientsCollection();
      const q = query(clientsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      // Si la collection est vide, ajouter des données de démonstration
      if (snapshot.empty) {
        console.log('Aucun client trouvé, ajout de données de démonstration');
        await seedMockClients();
        fetchClients(); // Récupérer à nouveau après l'ajout des données de démo
        return;
      }
      
      const fetchedClients = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Gérer les données de dates qui peuvent être des Timestamp Firestore
        let createdAtStr = '';
        let customerSinceStr = '';
        
        if (data.createdAt instanceof Timestamp) {
          createdAtStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt) {
          createdAtStr = new Date(data.createdAt).toISOString();
        } else {
          createdAtStr = new Date().toISOString();
        }
        
        if (data.customerSince instanceof Timestamp) {
          customerSinceStr = data.customerSince.toDate().toISOString().split('T')[0];
        } else if (data.customerSince) {
          customerSinceStr = new Date(data.customerSince).toISOString().split('T')[0];
        } else {
          customerSinceStr = new Date().toISOString().split('T')[0];
        }
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAtStr,
          customerSince: customerSinceStr
        } as Client;
      });
      
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
      const clientsRef = getClientsCollection();
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
      const crmDocId = 'crm';
      const clientRef = doc(db, 'crm', crmDocId, 'clients', id);
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
      const crmDocId = 'crm';
      const clientRef = doc(db, 'crm', crmDocId, 'clients', id);
      await deleteDoc(clientRef);
      
      // Refresh clients list
      fetchClients();
      
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      throw err;
    }
  };

  // Seed mock data if collection is empty
  const seedMockClients = async () => {
    try {
      const clientsRef = getClientsCollection();
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
        addDoc(clientsRef, {
          ...client,
          createdAt: serverTimestamp(),
        })
      );
      
      await Promise.all(promises);
      console.log('Données de démonstration ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

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
