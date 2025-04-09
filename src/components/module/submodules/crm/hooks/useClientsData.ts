
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to manage clients data with Firestore
 * Includes functions for fetching, adding, updating, and deleting clients
 */
export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Mock data for offline mode
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'TechSolutions Inc.',
      contactName: 'Jean Dupont',
      contactEmail: 'jean.dupont@techsolutions.com',
      contactPhone: '+33 1 23 45 67 89',
      sector: 'technology',
      revenue: '10-50M',
      status: 'active',
      address: '15 Rue de l\'Innovation, 75001 Paris',
      website: 'https://techsolutions.example.com',
      notes: 'Client depuis 5 ans, très satisfait de nos services.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerSince: new Date(2019, 5, 15).toISOString()
    },
    {
      id: '2',
      name: 'Finance Plus',
      contactName: 'Marie Laurent',
      contactEmail: 'marie.laurent@financeplus.com',
      contactPhone: '+33 1 98 76 54 32',
      sector: 'finance',
      revenue: '>100M',
      status: 'active',
      address: '8 Avenue des Finances, 69002 Lyon',
      website: 'https://financeplus.example.com',
      notes: 'Grand compte, plusieurs projets en cours.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerSince: new Date(2020, 3, 10).toISOString()
    }
  ];

  // Function to fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const snapshot = await getDocs(clientsCollection);
      
      if (snapshot.empty) {
        console.log('No clients found in Firestore');
        setClients([]);
        setIsOfflineMode(true);
        return () => {};
      }
      
      const clientsList = snapshot.docs.map(doc => {
        // Convert Firestore data to Client object
        const data = doc.data();
        const client: Client = {
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
          // Convert Firestore timestamps to ISO strings
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
          customerSince: data.customerSince || undefined
        };
        return client;
      });
      
      setClients(clientsList);
      setIsOfflineMode(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      setIsOfflineMode(true);
      toast.error('Erreur lors du chargement des clients, mode démo activé');
    } finally {
      setIsLoading(false);
    }
    
    return () => {};
  }, []);

  // Function to add a client to Firestore
  const addClient = async (formData: ClientFormData) => {
    try {
      if (isOfflineMode) {
        // In offline mode, add to local state only
        const newClient: Client = {
          id: uuidv4(),
          ...formData,
          status: formData.status as 'active' | 'inactive' | 'lead',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setClients(prev => [...prev, newClient]);
        toast.success('Client ajouté en mode démo');
        return newClient;
      }
      
      // Add to Firestore
      const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
      const docRef = await addDoc(clientsCollection, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Add to local state for immediate UI update
      const newClient: Client = {
        id: docRef.id,
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setClients(prev => [...prev, newClient]);
      toast.success('Client ajouté avec succès');
      return newClient;
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

  // Function to update a client in Firestore
  const updateClient = async (id: string, formData: ClientFormData) => {
    try {
      if (isOfflineMode) {
        // In offline mode, update local state only
        setClients(prev => 
          prev.map(client => 
            client.id === id 
              ? {
                  ...client,
                  ...formData,
                  status: formData.status as 'active' | 'inactive' | 'lead',
                  updatedAt: new Date().toISOString()
                }
              : client
          )
        );
        toast.success('Client mis à jour en mode démo');
        return;
      }
      
      // Update in Firestore
      const clientDoc = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await updateDoc(clientDoc, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      
      // Update local state for immediate UI update
      setClients(prev => 
        prev.map(client => 
          client.id === id 
            ? {
                ...client,
                ...formData,
                status: formData.status as 'active' | 'inactive' | 'lead',
                updatedAt: new Date().toISOString()
              }
            : client
        )
      );
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
      throw err;
    }
  };

  // Function to delete a client from Firestore
  const deleteClient = async (id: string) => {
    try {
      if (isOfflineMode) {
        // In offline mode, remove from local state only
        setClients(prev => prev.filter(client => client.id !== id));
        toast.success('Client supprimé en mode démo');
        return;
      }
      
      // Delete from Firestore
      const clientDoc = doc(db, COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientDoc);
      
      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
      throw err;
    }
  };

  // Helper function to convert a Date to ISO string
  const formatDate = (date: Date): string => {
    return date.toISOString();
  };

  // Function to seed demo clients
  const seedMockClients = async () => {
    try {
      setIsLoading(true);
      
      const demoClients: Client[] = [
        {
          id: uuidv4(),
          name: 'TechSolutions Inc.',
          contactName: 'Jean Dupont',
          contactEmail: 'jean.dupont@techsolutions.com',
          contactPhone: '+33 1 23 45 67 89',
          sector: 'technology',
          revenue: '10-50M',
          status: 'active',
          address: '15 Rue de l\'Innovation, 75001 Paris',
          website: 'https://techsolutions.example.com',
          notes: 'Client depuis 5 ans, très satisfait de nos services.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2019, 5, 15))
        },
        {
          id: uuidv4(),
          name: 'Finance Plus',
          contactName: 'Marie Laurent',
          contactEmail: 'marie.laurent@financeplus.com',
          contactPhone: '+33 1 98 76 54 32',
          sector: 'finance',
          revenue: '>100M',
          status: 'active',
          address: '8 Avenue des Finances, 69002 Lyon',
          website: 'https://financeplus.example.com',
          notes: 'Grand compte, plusieurs projets en cours.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2020, 3, 10))
        },
        {
          id: uuidv4(),
          name: 'Santé Optimale',
          contactName: 'Pierre Martin',
          contactEmail: 'pierre.martin@santeoptimale.com',
          contactPhone: '+33 4 56 78 90 12',
          sector: 'healthcare',
          revenue: '1-10M',
          status: 'active',
          address: '23 Boulevard de la Santé, 33000 Bordeaux',
          website: 'https://santeoptimale.example.com',
          notes: 'Nouveau client, grand potentiel de croissance.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2021, 7, 22))
        },
        {
          id: uuidv4(),
          name: 'Éducation Nationale',
          contactName: 'Sophie Dubois',
          contactEmail: 'sophie.dubois@education.gouv.fr',
          contactPhone: '+33 1 23 45 67 89',
          sector: 'education',
          revenue: '>100M',
          status: 'active',
          address: '110 Rue de Grenelle, 75007 Paris',
          website: 'https://education.gouv.fr',
          notes: 'Client institutionnel, projets de digitalisation en cours.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2018, 1, 5))
        },
        {
          id: uuidv4(),
          name: 'Commerces Réunis',
          contactName: 'Thomas Blanc',
          contactEmail: 'thomas.blanc@commercesreunis.com',
          contactPhone: '+33 6 78 90 12 34',
          sector: 'retail',
          revenue: '10-50M',
          status: 'active',
          address: '45 Rue du Commerce, 59000 Lille',
          website: 'https://commercesreunis.example.com',
          notes: 'Réseau de magasins en expansion, projets e-commerce.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2019, 9, 30))
        },
        {
          id: uuidv4(),
          name: 'Usines Modernes',
          contactName: 'Claire Legrand',
          contactEmail: 'claire.legrand@usinesmodernes.com',
          contactPhone: '+33 3 45 67 89 01',
          sector: 'manufacturing',
          revenue: '50-100M',
          status: 'active',
          address: '78 Avenue de l\'Industrie, 67000 Strasbourg',
          website: 'https://usinesmodernes.example.com',
          notes: 'Modernisation des chaînes de production en cours.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2017, 4, 18))
        },
        {
          id: uuidv4(),
          name: 'Services Plus',
          contactName: 'Nicolas Petit',
          contactEmail: 'nicolas.petit@servicesplus.com',
          contactPhone: '+33 7 89 01 23 45',
          sector: 'services',
          revenue: '1-10M',
          status: 'lead',
          address: '12 Rue des Services, 44000 Nantes',
          website: 'https://servicesplus.example.com',
          notes: 'En discussion pour un contrat de service.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date())
        },
        {
          id: uuidv4(),
          name: 'Startup Innovante',
          contactName: 'Julie Moreau',
          contactEmail: 'julie.moreau@startupinnovante.com',
          contactPhone: '+33 6 12 34 56 78',
          sector: 'technology',
          revenue: '<1M',
          status: 'lead',
          address: '5 Allée des Startups, 31000 Toulouse',
          website: 'https://startupinnovante.example.com',
          notes: 'Startup prometteuse, en recherche de solutions technologiques.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date())
        },
        {
          id: uuidv4(),
          name: 'Assurances Sécurité',
          contactName: 'Michel Durand',
          contactEmail: 'michel.durand@assurances-securite.com',
          contactPhone: '+33 4 56 78 90 12',
          sector: 'finance',
          revenue: '10-50M',
          status: 'inactive',
          address: '34 Boulevard des Assurances, 13001 Marseille',
          website: 'https://assurances-securite.example.com',
          notes: 'Ancien client, contrat terminé mais potentiel de réactivation.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2016, 2, 7))
        },
        {
          id: uuidv4(),
          name: 'Transports Internationaux',
          contactName: 'Hélène Fabre',
          contactEmail: 'helene.fabre@transports-inter.com',
          contactPhone: '+33 5 67 89 01 23',
          sector: 'services',
          revenue: '50-100M',
          status: 'active',
          address: '56 Rue des Transporteurs, 06000 Nice',
          website: 'https://transports-inter.example.com',
          notes: 'Client fidèle, projets d\'expansion internationale.',
          createdAt: formatDate(new Date()),
          updatedAt: formatDate(new Date()),
          customerSince: formatDate(new Date(2015, 8, 12))
        }
      ];

      if (isOfflineMode) {
        // In offline mode, add to local state only
        setClients(demoClients);
        toast.success('10 clients démo ont été ajoutés');
      } else {
        // Add demo clients to Firestore
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        
        // First check if there are already clients in Firestore
        const snapshot = await getDocs(clientsCollection);
        if (!snapshot.empty) {
          toast.info('Des clients existent déjà dans la base de données');
          return;
        }
        
        // Add clients to Firestore
        const promises = demoClients.map(async client => {
          // Remove id from client for Firestore to generate one
          const { id, ...clientData } = client;
          return addDoc(clientsCollection, {
            ...clientData,
            // Convert dates to Firestore serverTimestamp
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        
        await Promise.all(promises);
        await fetchClients(); // Refresh clients from Firestore
        toast.success('10 clients démo ont été ajoutés');
      }
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      toast.error('Erreur lors de l\'ajout des clients démo');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients on mount
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
