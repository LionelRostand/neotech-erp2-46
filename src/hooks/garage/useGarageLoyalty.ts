import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { LoyaltyProgram } from '@/components/module/submodules/garage/types/loyalty-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const useGarageLoyalty = () => {
  const collectionPath = COLLECTIONS.GARAGE.LOYALTY;
  
  if (!collectionPath) {
    console.error('Collection path for garage loyalty is undefined');
    throw new Error('Collection path for garage loyalty is undefined');
  }
  
  const { add, getAll, update, remove, loading, error } = useFirestore(collectionPath);

  const addLoyaltyProgram = async (programData: Omit<LoyaltyProgram, 'id'>) => {
    try {
      const result = await add({
        ...programData,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      toast.success('Programme de fidélité ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du programme de fidélité:', err);
      toast.error('Erreur lors de l\'ajout du programme de fidélité');
      throw err;
    }
  };

  const { data: loyaltyPrograms = [], refetch } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: async () => {
      try {
        const result = await getAll() as LoyaltyProgram[];
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des programmes de fidélité:', err);
        toast.error('Erreur lors de la récupération des programmes de fidélité');
        return [];
      }
    }
  });

  const updateLoyaltyProgram = async (id: string, data: Partial<LoyaltyProgram>) => {
    try {
      await update(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success('Programme de fidélité mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du programme de fidélité:', err);
      toast.error('Erreur lors de la mise à jour du programme de fidélité');
      throw err;
    }
  };

  const deleteLoyaltyProgram = async (id: string) => {
    try {
      await remove(id);
      toast.success('Programme de fidélité supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression du programme de fidélité:', err);
      toast.error('Erreur lors de la suppression du programme de fidélité');
      throw err;
    }
  };

  return {
    loyaltyPrograms,
    addLoyaltyProgram,
    updateLoyaltyProgram,
    deleteLoyaltyProgram,
    refetchLoyaltyPrograms: refetch,
    loading,
    error
  };
};
