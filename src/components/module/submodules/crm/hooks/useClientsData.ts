
import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIREBASE_COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Mock clients data for offline mode demonstration
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Tech Solutions SA',
    contactName: 'Jean Dupont',
    contactEmail: 'jean@techsolutions.com',
    contactPhone: '0612345678',
    sector: 'technology',
    status: 'active',
    revenue: '1500000',
    address: '123 Rue de la Technologie, Paris',
    website: 'www.techsolutions.com',
    notes: 'Client depuis 5 ans, très satisfait de nos services.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2019-05-15'
  },
  {
    id: '2',
    name: 'Finance Plus',
    contactName: 'Marie Lambert',
    contactEmail: 'marie@financeplus.fr',
    contactPhone: '0687654321',
    sector: 'finance',
    status: 'active',
    revenue: '2300000',
    address: '45 Avenue des Finances, Lyon',
    website: 'www.financeplus.fr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2020-03-10'
  },
  {
    id: '3',
    name: 'Santé Moderne',
    contactName: 'Pierre Martin',
    contactEmail: 'pierre@santemoderne.fr',
    contactPhone: '0654321987',
    sector: 'healthcare',
    status: 'inactive',
    revenue: '980000',
    address: '78 Boulevard de la Santé, Marseille',
    createdAt: new Date().toISOString(),
    customerSince: '2018-11-22'
  },
  {
    id: '4',
    name: 'Éducation Nationale',
    contactName: 'Sophie Petit',
    contactEmail: 'sophie@education.gouv.fr',
    contactPhone: '0698765432',
    sector: 'education',
    status: 'lead',
    revenue: '5000000',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fetch clients data from Firestore
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clientsCollection = collection(db, FIREBASE_COLLECTIONS.CRM.CLIENTS);
      
      // Listen for snapshot updates
      const unsubscribe = onSnapshot(
        clientsCollection,
        (snapshot) => {
          const clientsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Convert Firestore timestamps to ISO strings for consistency
              createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate().toISOString(),
              customerSince: data.customerSince?.toDate().toISOString()
            } as Client;
          });
          
          setClients(clientsData);
          setIsLoading(false);
          setIsOfflineMode(false);
        },
        (err) => {
          console.error('Error fetching clients:', err);
          // If offline or error, fall back to mock data
          setClients(mockClients);
          setError(err as Error);
          setIsOfflineMode(true);
          setIsLoading(false);
          toast.error('Mode démo activé: Connexion à la base de données impossible');
        }
      );
      
      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up clients listener:', err);
      setClients(mockClients);
      setError(err as Error);
      setIsOfflineMode(true);
      setIsLoading(false);
      toast.error('Mode démo activé: Connexion à la base de données impossible');
      
      // Return a dummy unsubscribe function
      return () => {};
    }
  }, []);

  // Add a new client to Firestore
  const addClient = async (formData: ClientFormData) => {
    try {
      // If in offline mode, add to local state only
      if (isOfflineMode) {
        const newClient: Client = {
          id: uuidv4(),
          ...formData,
          status: formData.status as 'active' | 'inactive' | 'lead',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setClients(prev => [...prev, newClient]);
        toast.success('Client ajouté en mode démo');
        return;
      }
      
      // Add to Firestore
      const newClientRef = doc(collection(db, FIREBASE_COLLECTIONS.CRM.CLIENTS));
      
      // Prepare the data with proper timestamps
      const clientData = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(newClientRef, clientData);
      toast.success('Client ajouté avec succès');
    } catch (err) {
      console.error('Error adding client:', err);
      
      // If error occurs, switch to offline mode and add to local state
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        toast.error('Mode démo activé suite à une erreur: Connexion à la base de données impossible');
        
        const newClient: Client = {
          id: uuidv4(),
          ...formData,
          status: formData.status as 'active' | 'inactive' | 'lead',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setClients(prev => [...prev, newClient]);
        toast.success('Client ajouté en mode démo');
      } else {
        toast.error('Erreur lors de l\'ajout du client');
        throw err;
      }
    }
  };

  // Update an existing client in Firestore
  const updateClient = async (id: string, formData: ClientFormData) => {
    try {
      // If in offline mode, update in local state only
      if (isOfflineMode) {
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...formData,
                status: formData.status as 'active' | 'inactive' | 'lead',
                updatedAt: new Date().toISOString() 
              } 
            : client
        ));
        toast.success('Client mis à jour en mode démo');
        return;
      }
      
      // Update in Firestore
      const clientRef = doc(db, FIREBASE_COLLECTIONS.CRM.CLIENTS, id);
      
      // Prepare the data with proper timestamps
      const clientData = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead',
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(clientRef, clientData);
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      
      // If error occurs, switch to offline mode and update in local state
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        toast.error('Mode démo activé suite à une erreur: Connexion à la base de données impossible');
        
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...formData,
                status: formData.status as 'active' | 'inactive' | 'lead',
                updatedAt: new Date().toISOString() 
              } 
            : client
        ));
        toast.success('Client mis à jour en mode démo');
      } else {
        toast.error('Erreur lors de la mise à jour du client');
        throw err;
      }
    }
  };

  // Delete a client from Firestore
  const deleteClient = async (id: string) => {
    try {
      // If in offline mode, delete from local state only
      if (isOfflineMode) {
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success('Client supprimé en mode démo');
        return;
      }
      
      // Delete from Firestore
      const clientRef = doc(db, FIREBASE_COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientRef);
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      
      // If error occurs, switch to offline mode and delete from local state
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        toast.error('Mode démo activé suite à une erreur: Connexion à la base de données impossible');
        
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success('Client supprimé en mode démo');
      } else {
        toast.error('Erreur lors de la suppression du client');
        throw err;
      }
    }
  };

  // Add seed data for demo purposes
  const seedMockClients = async () => {
    try {
      // If in offline mode, add mock clients to local state only
      if (isOfflineMode) {
        setClients(prev => {
          // Only add clients if they don't already exist
          if (prev.length === 0) {
            return [...mockClients];
          }
          toast.info('Des clients de démonstration existent déjà');
          return prev;
        });
        toast.success('Clients de démonstration ajoutés en mode démo');
        return;
      }
      
      // Add mock clients to Firestore
      const clientsCollection = collection(db, FIREBASE_COLLECTIONS.CRM.CLIENTS);
      
      // Check if we already have clients
      if (clients.length > 0) {
        toast.info('Des clients existent déjà dans la base de données');
        return;
      }
      
      // Add each mock client to Firestore
      const addPromises = mockClients.map(async (client) => {
        const newClientRef = doc(clientsCollection);
        
        // Prepare the data with proper timestamps
        const clientData = {
          name: client.name,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
          sector: client.sector,
          status: client.status,
          revenue: client.revenue,
          address: client.address || '',
          website: client.website || '',
          notes: client.notes || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          customerSince: client.customerSince ? Timestamp.fromDate(new Date(client.customerSince)) : null
        };
        
        await setDoc(newClientRef, clientData);
      });
      
      await Promise.all(addPromises);
      toast.success('Clients de démonstration ajoutés avec succès');
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      
      // If error occurs, switch to offline mode and add mock clients to local state
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        toast.error('Mode démo activé suite à une erreur: Connexion à la base de données impossible');
        
        setClients(mockClients);
        toast.success('Clients de démonstration ajoutés en mode démo');
      } else {
        toast.error('Erreur lors de l\'ajout des clients de démonstration');
        throw err;
      }
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    const unsubscribe = fetchClients();
    
    // Cleanup on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
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
    seedMockClients
  };
};
