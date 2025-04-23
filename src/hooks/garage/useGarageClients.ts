
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageClients = () => {
  const { add, getAll, loading, error } = useFirestore(COLLECTIONS.GARAGE.CLIENTS);

  const addClient = async (clientData: Omit<GarageClient, 'id' | 'createdAt'>) => {
    try {
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        vehicles: [],
        totalSpent: 0,
        status: 'active' as const
      };

      const result = await add(newClient);
      toast.success('Client ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

  const fetchClients = async () => {
    try {
      return await getAll() as GarageClient[];
    } catch (err) {
      console.error('Erreur lors de la récupération des clients:', err);
      toast.error('Erreur lors de la récupération des clients');
      return [];
    }
  };

  return {
    addClient,
    fetchClients,
    loading,
    error
  };
};
