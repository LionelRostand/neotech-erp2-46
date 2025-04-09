import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import { v4 as uuidv4 } from 'uuid';

// Define the type for Firestore timestamp
type FirestoreTimestamp = Timestamp;

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fetch clients data from Firestore
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const clientsSnapshot = await getDocs(clientsCollection);
      
      const clientsData = clientsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          sector: data.sector,
          status: data.status,
          revenue: data.revenue,
          address: data.address,
          website: data.website,
          notes: data.notes,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          customerSince: data.customerSince
        } as Client;
      });

      setClients(clientsData);
      setIsOfflineMode(false);
      setError(null);
      console.log('Fetched clients:', clientsData.length);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      
      // Check for specific Firestore errors that indicate offline/connection issues
      if (err.code === 'unavailable' || 
          err.code === 'failed-precondition' || 
          err.code === 'resource-exhausted' ||
          err.name === 'FirebaseError') {
        console.log('Firebase connection issue detected, switching to offline mode');
        setIsOfflineMode(true);
        toast.error('La connexion à Firebase a échoué. Mode démo activé.');
      } else {
        setError(err);
        toast.error(`Erreur de chargement des clients: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
    
    // Return a cleanup function
    return () => {
      console.log('Cleanup function called');
    };
  }, []);

  // Add a new client to Firestore
  const addClient = async (formData: ClientFormData) => {
    try {
      // Check if we're in offline mode
      if (isOfflineMode) {
        // Create a mock client with a unique ID
        const newMockClient: Client = {
          id: uuidv4(),
          ...formData,
          status: formData.status as 'active' | 'inactive' | 'lead',
          createdAt: new Date(),
          updatedAt: new Date(),
          customerSince: new Date().toISOString().split('T')[0]
        };

        // Add to local state
        setClients(prev => [...prev, newMockClient]);
        toast.success('Client ajouté en mode démo.');
        return newMockClient;
      }

      // Online mode - add to Firestore
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const docRef = await addDoc(clientsCollection, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        customerSince: new Date().toISOString().split('T')[0]
      });

      // Create the new client object with the document ID
      const newClient: Client = {
        id: docRef.id,
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead',
        createdAt: new Date(),
        updatedAt: new Date(),
        customerSince: new Date().toISOString().split('T')[0]
      };

      // Update local state
      setClients(prev => [...prev, newClient]);
      toast.success('Client ajouté avec succès.');
      return newClient;
    } catch (err: any) {
      console.error('Error adding client:', err);
      
      // Check if this is a connection issue
      if (err.code === 'unavailable' || 
          err.code === 'failed-precondition' || 
          err.name === 'FirebaseError') {
        setIsOfflineMode(true);
        toast.error('Impossible d\'ajouter le client. Mode démo activé.');
        
        // Create and return a mock client anyway
        const mockClient: Client = {
          id: uuidv4(),
          ...formData,
          status: formData.status as 'active' | 'inactive' | 'lead',
          createdAt: new Date(),
          updatedAt: new Date(),
          customerSince: new Date().toISOString().split('T')[0]
        };
        
        setClients(prev => [...prev, mockClient]);
        return mockClient;
      }
      
      toast.error(`Erreur d'ajout du client: ${err.message}`);
      throw err;
    }
  };

  // Update a client in Firestore
  const updateClient = async (id: string, formData: ClientFormData) => {
    try {
      // Check if we're in offline mode
      if (isOfflineMode) {
        // Update the client in local state only
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...formData, 
                status: formData.status as 'active' | 'inactive' | 'lead',
                updatedAt: new Date()
              } 
            : client
        ));
        toast.success('Client mis à jour en mode démo.');
        return;
      }

      // Online mode - update in Firestore
      const clientDoc = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await updateDoc(clientDoc, {
        ...formData,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === id 
          ? { 
              ...client, 
              ...formData, 
              status: formData.status as 'active' | 'inactive' | 'lead',
              updatedAt: new Date()
            } 
          : client
      ));
      toast.success('Client mis à jour avec succès.');
    } catch (err: any) {
      console.error('Error updating client:', err);
      
      // Check if this is a connection issue
      if (err.code === 'unavailable' || 
          err.code === 'failed-precondition' || 
          err.name === 'FirebaseError') {
        setIsOfflineMode(true);
        
        // Update in local state despite the error
        setClients(prev => prev.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...formData, 
                status: formData.status as 'active' | 'inactive' | 'lead',
                updatedAt: new Date()
              } 
            : client
        ));
        toast.warning('Client mis à jour en mode démo.');
        return;
      }
      
      toast.error(`Erreur de mise à jour du client: ${err.message}`);
      throw err;
    }
  };

  // Delete a client from Firestore
  const deleteClient = async (id: string) => {
    try {
      // Check if we're in offline mode
      if (isOfflineMode) {
        // Remove the client from local state only
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success('Client supprimé en mode démo.');
        return;
      }

      // Online mode - delete from Firestore
      const clientDoc = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientDoc);

      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client supprimé avec succès.');
    } catch (err: any) {
      console.error('Error deleting client:', err);
      
      // Check if this is a connection issue
      if (err.code === 'unavailable' || 
          err.code === 'failed-precondition' || 
          err.name === 'FirebaseError') {
        setIsOfflineMode(true);
        
        // Remove from local state despite the error
        setClients(prev => prev.filter(client => client.id !== id));
        toast.warning('Client supprimé en mode démo.');
        return;
      }
      
      toast.error(`Erreur de suppression du client: ${err.message}`);
      throw err;
    }
  };

  // Seed mock clients data for demo mode
  const seedMockClients = async () => {
    try {
      // Check if already in offline mode
      if (!isOfflineMode) {
        // Try to access Firestore to confirm connection
        try {
          const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
          await getDocs(clientsCollection);
        } catch (err) {
          // If error, switch to offline mode
          setIsOfflineMode(true);
        }
      }

      // Generate mock clients
      const mockClients: Client[] = [
        {
          id: uuidv4(),
          name: "TechSolutions",
          contactName: "Jean Dupont",
          contactEmail: "jean.dupont@techsolutions.com",
          contactPhone: "01 23 45 67 89",
          sector: "technology",
          status: "active",
          revenue: "250000",
          address: "15 rue de l'Innovation, 75001 Paris",
          website: "www.techsolutions.com",
          notes: "Client fidèle depuis 5 ans",
          createdAt: new Date(2023, 1, 15),
          updatedAt: new Date(2023, 5, 10),
          customerSince: "2023-01-15"
        },
        {
          id: uuidv4(),
          name: "FinanceExpert",
          contactName: "Marie Leclerc",
          contactEmail: "marie@financeexpert.fr",
          contactPhone: "01 98 76 54 32",
          sector: "finance",
          status: "active",
          revenue: "500000",
          address: "8 avenue des Finances, 69002 Lyon",
          website: "www.financeexpert.fr",
          notes: "Contrat annuel de conseil",
          createdAt: new Date(2022, 8, 20),
          updatedAt: new Date(2023, 4, 5),
          customerSince: "2022-08-20"
        },
        {
          id: uuidv4(),
          name: "Santé Plus",
          contactName: "Pierre Martin",
          contactEmail: "pierre@santeplus.org",
          contactPhone: "04 56 78 90 12",
          sector: "healthcare",
          status: "inactive",
          revenue: "120000",
          address: "25 boulevard Santé, 33000 Bordeaux",
          website: "www.santeplus.org",
          notes: "En attente de renouvellement",
          createdAt: new Date(2022, 5, 8),
          updatedAt: new Date(2023, 2, 15),
          customerSince: "2022-05-08"
        },
        {
          id: uuidv4(),
          name: "EduFutur",
          contactName: "Sophie Bernard",
          contactEmail: "sophie@edufutur.edu",
          contactPhone: "03 45 67 89 01",
          sector: "education",
          status: "lead",
          revenue: "75000",
          address: "12 rue de l'Enseignement, 59000 Lille",
          website: "www.edufutur.edu",
          notes: "Intéressé par notre solution de gestion",
          createdAt: new Date(2023, 3, 12),
          updatedAt: new Date(2023, 3, 12),
          customerSince: "2023-03-12"
        },
        {
          id: uuidv4(),
          name: "Mode Express",
          contactName: "Lucie Petit",
          contactEmail: "lucie@modeexpress.com",
          contactPhone: "01 34 56 78 90",
          sector: "retail",
          status: "active",
          revenue: "350000",
          address: "45 avenue de la Mode, 75008 Paris",
          website: "www.modeexpress.com",
          notes: "Commandes régulières",
          createdAt: new Date(2021, 11, 5),
          updatedAt: new Date(2023, 6, 20),
          customerSince: "2021-11-05"
        }
      ];

      // If in offline mode, just update local state
      if (isOfflineMode) {
        setClients(mockClients);
        toast.success('Données de démonstration chargées en mode démo.');
        return;
      }

      // Otherwise, add to Firestore
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const addPromises = mockClients.map(async (client) => {
        try {
          // Remove id before adding to Firestore (it will generate its own)
          const { id, createdAt, updatedAt, ...clientData } = client;
          
          await addDoc(clientsCollection, {
            ...clientData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error(`Failed to add mock client ${client.name}:`, err);
        }
      });

      await Promise.all(addPromises);
      
      // Refresh clients from Firestore
      await fetchClients();
      toast.success('Données de démonstration ajoutées avec succès.');
    } catch (err: any) {
      console.error('Error seeding mock clients:', err);
      
      // Still show the mock data in case of error
      const mockClients = generateMockClients();
      setClients(mockClients);
      setIsOfflineMode(true);
      
      toast.error(`Erreur lors de l'ajout des données: ${err.message}`);
    }
  };

  // Helper function to generate mock clients
  const generateMockClients = (): Client[] => {
    return [
      {
        id: uuidv4(),
        name: "TechSolutions",
        contactName: "Jean Dupont",
        contactEmail: "jean.dupont@techsolutions.com",
        contactPhone: "01 23 45 67 89",
        sector: "technology",
        status: "active",
        revenue: "250000",
        address: "15 rue de l'Innovation, 75001 Paris",
        website: "www.techsolutions.com",
        notes: "Client fidèle depuis 5 ans",
        createdAt: new Date(2023, 1, 15),
        updatedAt: new Date(2023, 5, 10),
        customerSince: "2023-01-15"
      },
      {
        id: uuidv4(),
        name: "FinanceExpert",
        contactName: "Marie Leclerc",
        contactEmail: "marie@financeexpert.fr",
        contactPhone: "01 98 76 54 32",
        sector: "finance",
        status: "active",
        revenue: "500000",
        address: "8 avenue des Finances, 69002 Lyon",
        website: "www.financeexpert.fr",
        notes: "Contrat annuel de conseil",
        createdAt: new Date(2022, 8, 20),
        updatedAt: new Date(2023, 4, 5),
        customerSince: "2022-08-20"
      },
      {
        id: uuidv4(),
        name: "Santé Plus",
        contactName: "Pierre Martin",
        contactEmail: "pierre@santeplus.org",
        contactPhone: "04 56 78 90 12",
        sector: "healthcare",
        status: "inactive",
        revenue: "120000",
        address: "25 boulevard Santé, 33000 Bordeaux",
        website: "www.santeplus.org",
        notes: "En attente de renouvellement",
        createdAt: new Date(2022, 5, 8),
        updatedAt: new Date(2023, 2, 15),
        customerSince: "2022-05-08"
      },
      {
        id: uuidv4(),
        name: "EduFutur",
        contactName: "Sophie Bernard",
        contactEmail: "sophie@edufutur.edu",
        contactPhone: "03 45 67 89 01",
        sector: "education",
        status: "lead",
        revenue: "75000",
        address: "12 rue de l'Enseignement, 59000 Lille",
        website: "www.edufutur.edu",
        notes: "Intéressé par notre solution de gestion",
        createdAt: new Date(2023, 3, 12),
        updatedAt: new Date(2023, 3, 12),
        customerSince: "2023-03-12"
      },
      {
        id: uuidv4(),
        name: "Mode Express",
        contactName: "Lucie Petit",
        contactEmail: "lucie@modeexpress.com",
        contactPhone: "01 34 56 78 90",
        sector: "retail",
        status: "active",
        revenue: "350000",
        address: "45 avenue de la Mode, 75008 Paris",
        website: "www.modeexpress.com",
        notes: "Commandes régulières",
        createdAt: new Date(2021, 11, 5),
        updatedAt: new Date(2023, 6, 20),
        customerSince: "2021-11-05"
      }
    ];
  };

  // Initial fetch of clients
  useEffect(() => {
    fetchClients();
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
