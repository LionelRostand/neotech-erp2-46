
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageClients = () => {
  const { add, getAll } = useFirestore(COLLECTIONS.GARAGE.CLIENTS);

  const addClient = async (clientData: Omit<GarageClient, 'id' | 'createdAt' | 'updatedAt' | 'vehicles' | 'totalSpent'>) => {
    try {
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
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
    isLoading,
    error
  };
};
