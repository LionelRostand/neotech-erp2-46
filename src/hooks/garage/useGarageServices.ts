
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageService } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageServices = () => {
  const { add, getAll, update, remove, loading, error } = useFirestore(COLLECTIONS.GARAGE.SERVICES);

  const addService = async (serviceData: Omit<GarageService, 'id'>) => {
    try {
      const result = await add({
        ...serviceData,
        createdAt: new Date().toISOString()
      });
      toast.success('Service ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du service:', err);
      toast.error('Erreur lors de l\'ajout du service');
      throw err;
    }
  };

  const { data: services = [], refetch } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: async () => {
      try {
        const result = await getAll() as GarageService[];
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des services:', err);
        toast.error('Erreur lors de la récupération des services');
        return [];
      }
    }
  });

  return {
    services,
    addService,
    refetchServices: refetch,
    loading,
    error
  };
};
