import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageClients = () => {
  const collectionPath = COLLECTIONS.GARAGE.CLIENTS;
  const { add, getAll, update, remove, loading, error } = useFirestore(collectionPath);

  const addClient = async (clientData: Omit<GarageClient, 'id'>) => {
    try {
      console.log('Tentative d\'ajout du client:', clientData);
      const newClient = {
        ...clientData,
        vehicles: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      const result = await add(newClient);
      console.log('Client ajouté avec succès:', result);
      
      toast.success('Client ajouté avec succès');
      await refetch();
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

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
        console.log('Récupération des clients depuis:', collectionPath);
        const result = await getAll() as GarageClient[];
        console.log('Clients récupérés:', result);
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
