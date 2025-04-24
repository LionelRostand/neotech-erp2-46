
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageClients = () => {
  const { add, getAll } = useFirestore(COLLECTIONS.GARAGE.CLIENTS);

  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        console.log('Récupération des clients depuis:', COLLECTIONS.GARAGE.CLIENTS);
        const result = await getAll() as GarageClient[];
        console.log('Clients récupérés:', result);
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des clients:', err);
        return [];
      }
    }
  });

  const addClient = async (clientData: Omit<GarageClient, 'id'>) => {
    try {
      console.log('Tentative d\'ajout du client:', clientData);
      const newClient = {
        ...clientData,
        vehicles: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      await add(newClient);
      console.log('Client ajouté avec succès');
      
      toast.success('Client ajouté avec succès');
      await refetch();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };

  return {
    clients,
    addClient,
    isLoading,
    error,
    refetchClients: refetch
  };
};
