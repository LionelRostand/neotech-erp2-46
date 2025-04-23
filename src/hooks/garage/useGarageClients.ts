
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
  
  const { add, getAll, loading, error } = useFirestore(collectionPath || 'garage_clients');

  const addClient = async (clientData: Omit<GarageClient, 'id'>) => {
    try {
      const result = await add(clientData);
      toast.success('Client ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

  const { data: clients = [], refetch } = useQuery({
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
        toast.error('Erreur lors de la récupération des clients');
        return [];
      }
    }
  });

  return {
    clients,
    addClient,
    refetchClients: refetch,
    loading,
    error
  };
};
