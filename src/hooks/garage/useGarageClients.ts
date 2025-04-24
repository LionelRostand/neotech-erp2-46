
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageClients = () => {
  // Make sure we're using a valid collection path
  const collectionPath = COLLECTIONS.GARAGE.CLIENTS;
  
  // Check if collectionPath is defined before using it
  if (!collectionPath) {
    console.error('Collection path for garage clients is undefined or empty');
  }
  
  const { add, getAll, update, remove, loading, error } = useFirestore(collectionPath || 'garage_clients');

  const addClient = async (clientData: Omit<GarageClient, 'id'>) => {
    try {
      console.log('Attempting to add client:', clientData);
      const result = await add({
        ...clientData,
        vehicles: [],
        status: 'active',
        createdAt: new Date().toISOString()
      });
      console.log('Client added successfully, result:', result);
      await refetch(); // Refresh client list
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      throw err;
    }
  };

  // Fonction pour mettre à jour un client
  const updateClient = async (clientId: string, data: Partial<GarageClient>) => {
    try {
      await update(clientId, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Rafraîchir les données après la mise à jour
      await refetch();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du client:', err);
      throw err;
    }
  };
  
  // Fonction pour supprimer un client
  const deleteClient = async (clientId: string) => {
    try {
      await remove(clientId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      throw err;
    }
  };

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        if (!collectionPath) {
          console.error('Cannot fetch clients: Collection path is empty');
          return [];
        }
        
        const result = await getAll() as GarageClient[];
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des clients:', err);
        return [];
      }
    }
  });

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    refetchClients: refetch,
    loading,
    error,
    isLoading
  };
};
