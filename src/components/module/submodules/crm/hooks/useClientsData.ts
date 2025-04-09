
import { useState, useEffect, useCallback } from 'react';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import { orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

/**
 * Custom hook to manage clients data from Firestore
 */
export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Fonction pour formater une date en ISO String ou garder un string
  const formatDateOrKeepString = (date: Date | string): string => {
    return date instanceof Date ? date.toISOString() : date;
  };

  // Fonction pour récupérer les clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching clients from Firestore...');
      const clientsData = await getAllDocuments(COLLECTIONS.CRM.CLIENTS, [
        orderBy('createdAt', 'desc')
      ]);
      
      console.log(`Fetched ${clientsData.length} clients:`, clientsData);
      setClients(clientsData as Client[]);
      setError(null);
      setIsOfflineMode(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      
      // Si nous avons des données en cache, ne pas considérer comme une erreur fatale
      if (clients.length > 0) {
        console.log('Using cached clients data...');
        setIsOfflineMode(true);
        toast.warning('Connexion limitée. Les données affichées peuvent ne pas être à jour.');
      } else {
        const error = err instanceof Error ? err : new Error('Erreur lors de la récupération des clients');
        setError(error);
        toast.error(`Erreur: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [clients.length]);

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Ajouter un client
  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    console.log('Adding client:', clientData);
    try {
      // Créer un objet client avec les timestamps
      const now = new Date();
      const newClient = {
        ...clientData,
        status: clientData.status as 'active' | 'inactive' | 'lead',
        createdAt: formatDateOrKeepString(now),
        updatedAt: formatDateOrKeepString(now),
      };

      if (isOfflineMode) {
        // En mode hors ligne, simuler un ajout local
        console.log('Adding client in offline mode');
        const mockId = `local_${Date.now()}`;
        const clientWithId = { id: mockId, ...newClient };
        
        setClients(prev => [clientWithId, ...prev]);
        toast.warning('Client ajouté en mode hors ligne. La synchronisation se fera une fois la connexion rétablie.');
        return clientWithId;
      }
      
      // Ajouter le client à Firestore
      const result = await addDocument(COLLECTIONS.CRM.CLIENTS, newClient);
      console.log('Client added successfully:', result);
      
      // Mettre à jour l'état local avec le nouveau client
      const addedClient = result as Client;
      setClients(prev => [addedClient, ...prev]);
      
      return addedClient;
    } catch (err) {
      console.error('Error adding client:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de l\'ajout du client');
      throw error;
    }
  };

  // Mettre à jour un client
  const updateClient = async (id: string, clientData: ClientFormData): Promise<Client> => {
    console.log(`Updating client ${id}:`, clientData);
    try {
      // Créer un objet avec les données mises à jour et le timestamp
      const now = new Date();
      const updatedData = {
        ...clientData,
        status: clientData.status as 'active' | 'inactive' | 'lead',
        updatedAt: formatDateOrKeepString(now),
      };

      if (isOfflineMode) {
        // En mode hors ligne, simuler une mise à jour locale
        console.log('Updating client in offline mode');
        setClients(prev => 
          prev.map(client => client.id === id ? { ...client, ...updatedData } : client)
        );
        toast.warning('Client mis à jour en mode hors ligne. La synchronisation se fera une fois la connexion rétablie.');
        return { id, ...updatedData } as Client;
      }
      
      // Mettre à jour dans Firestore
      await updateDocument(COLLECTIONS.CRM.CLIENTS, id, updatedData);
      console.log('Client updated successfully');
      
      // Mettre à jour l'état local
      const updatedClient = { id, ...updatedData } as Client;
      setClients(prev => 
        prev.map(client => client.id === id ? updatedClient : client)
      );
      
      return updatedClient;
    } catch (err) {
      console.error('Error updating client:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de la mise à jour du client');
      throw error;
    }
  };

  // Supprimer un client
  const deleteClient = async (id: string): Promise<void> => {
    console.log(`Deleting client ${id}`);
    try {
      if (isOfflineMode) {
        // En mode hors ligne, simuler une suppression locale
        console.log('Deleting client in offline mode');
        setClients(prev => prev.filter(client => client.id !== id));
        toast.warning('Client supprimé en mode hors ligne. La synchronisation se fera une fois la connexion rétablie.');
        return;
      }
      
      // Supprimer de Firestore
      await deleteDocument(COLLECTIONS.CRM.CLIENTS, id);
      console.log('Client deleted successfully');
      
      // Mettre à jour l'état local
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de la suppression du client');
      throw error;
    }
  };

  // Fonction pour ajouter plusieurs clients de démo
  const seedMockClients = async (): Promise<void> => {
    console.log('Seeding mock clients...');
    try {
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const seedClients = [
        {
          name: "TechnoVision",
          contactName: "Sophie Martin",
          contactEmail: "sophie.martin@technovision.fr",
          contactPhone: "01 23 45 67 89",
          sector: "technology",
          status: "active" as const,
          revenue: "2500000",
          address: "15 rue de l'Innovation, 75008 Paris",
          website: "https://technovision.fr",
          notes: "Client premium depuis 2019. Intéressé par les solutions cloud.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "Finance Plus",
          contactName: "Thomas Dubois",
          contactEmail: "t.dubois@financeplus.com",
          contactPhone: "01 98 76 54 32",
          sector: "finance",
          status: "active" as const,
          revenue: "5000000",
          address: "8 avenue des Champs-Élysées, 75008 Paris",
          website: "https://financeplus.com",
          notes: "Gros client avec multiples contrats. Renouvellement annuel en mars.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "MédiSanté",
          contactName: "Claire Bernard",
          contactEmail: "c.bernard@medisante.fr",
          contactPhone: "01 45 67 89 10",
          sector: "healthcare",
          status: "active" as const,
          revenue: "1800000",
          address: "23 boulevard des Hôpitaux, 69003 Lyon",
          website: "https://medisante.fr",
          notes: "Réseau de cliniques privées. Contact mensuel nécessaire.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "Éducation Nationale",
          contactName: "Philippe Laurent",
          contactEmail: "p.laurent@education.gouv.fr",
          contactPhone: "01 56 78 90 12",
          sector: "education",
          status: "inactive" as const,
          revenue: "0",
          address: "110 rue de Grenelle, 75007 Paris",
          website: "https://education.gouv.fr",
          notes: "Contrat en attente de renouvellement suite à appel d'offres.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "CommerceRapide",
          contactName: "Julie Moreau",
          contactEmail: "j.moreau@commercerapide.com",
          contactPhone: "01 34 56 78 90",
          sector: "retail",
          status: "lead" as const,
          revenue: "800000",
          address: "45 avenue du Commerce, 33000 Bordeaux",
          website: "https://commercerapide.com",
          notes: "Prospect chaud, plusieurs réunions déjà effectuées.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "IndustrieTech",
          contactName: "Marc Lefebvre",
          contactEmail: "m.lefebvre@industrietech.fr",
          contactPhone: "01 23 45 67 89",
          sector: "manufacturing",
          status: "active" as const,
          revenue: "3500000",
          address: "78 route des Usines, 59000 Lille",
          website: "https://industrietech.fr",
          notes: "Client historique. Contrat pluriannuel.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "ConsultingPro",
          contactName: "Nathalie Petit",
          contactEmail: "n.petit@consultingpro.com",
          contactPhone: "01 87 65 43 21",
          sector: "services",
          status: "active" as const,
          revenue: "1200000",
          address: "12 rue des Consultants, 75016 Paris",
          website: "https://consultingpro.com",
          notes: "Partenaire stratégique. Nombreuses opportunités.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "Assur & Co",
          contactName: "Pierre Durand",
          contactEmail: "p.durand@assuretco.fr",
          contactPhone: "01 23 45 67 89",
          sector: "finance",
          status: "inactive" as const,
          revenue: "950000",
          address: "34 boulevard Haussmann, 75009 Paris",
          website: "https://assuretco.fr",
          notes: "Client en pause. Reprise de contact prévue au T3.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "AgriNouveaux",
          contactName: "Jean Dupont",
          contactEmail: "j.dupont@agrinouveaux.fr",
          contactPhone: "01 56 78 90 12",
          sector: "other",
          status: "lead" as const,
          revenue: "450000",
          address: "56 chemin des Champs, 31000 Toulouse",
          website: "https://agrinouveaux.fr",
          notes: "Coopérative agricole intéressée par nos solutions digitales.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        },
        {
          name: "TransportExpress",
          contactName: "Sandrine Leroy",
          contactEmail: "s.leroy@transportexpress.com",
          contactPhone: "01 90 87 65 43",
          sector: "other",
          status: "active" as const,
          revenue: "1700000",
          address: "89 avenue de la Logistique, 13000 Marseille",
          website: "https://transportexpress.com",
          notes: "Besoin de solutions sur mesure. Budget conséquent.",
          createdAt: formatDateOrKeepString(oneYearAgo),
          updatedAt: formatDateOrKeepString(now),
        }
      ];
      
      // En mode hors ligne, ajouter localement
      if (isOfflineMode) {
        const mockClientsWithIds = seedClients.map((client, index) => ({
          id: `local_seed_${index}_${Date.now()}`,
          ...client
        }));
        
        setClients(prev => [...mockClientsWithIds, ...prev]);
        toast.warning('Clients de démo ajoutés en mode hors ligne. La synchronisation se fera une fois la connexion rétablie.');
        return;
      }
      
      // Sinon, ajouter dans Firestore
      const promises = seedClients.map(client => 
        addDocument(COLLECTIONS.CRM.CLIENTS, client)
      );
      
      await Promise.all(promises);
      console.log('Mock clients added successfully!');
      
      // Rafraîchir les données
      fetchClients();
      toast.success('10 clients de démonstration ont été ajoutés avec succès!');
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de l\'ajout des clients de démo');
      toast.error(`Erreur: ${error.message}`);
      throw error;
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
    deleteClient,
    seedMockClients
  };
};
