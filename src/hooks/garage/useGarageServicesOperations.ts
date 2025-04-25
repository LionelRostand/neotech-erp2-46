
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { GarageService } from './useGarageServices';

export const useGarageServicesOperations = () => {
  const { add, update, remove } = useFirestore(COLLECTIONS.GARAGE.SERVICES);

  const createService = async (serviceData: Omit<GarageService, 'id'>) => {
    try {
      await add(serviceData);
      toast.success('Service créé avec succès');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Erreur lors de la création du service');
      throw error;
    }
  };

  return {
    createService,
  };
};
