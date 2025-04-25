
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageMechanics = () => {
  const queryClient = useQueryClient();
  
  // Fetch mechanics data
  const { data: mechanics = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Add a new mechanic
  const addMechanic = useMutation({
    mutationFn: async (newMechanic: Omit<Mechanic, 'id'>) => {
      try {
        const mechanicsCollection = collection(db, COLLECTIONS.GARAGE.MECHANICS);
        const docRef = await addDoc(mechanicsCollection, {
          ...newMechanic,
          createdAt: new Date().toISOString(),
        });
        return { id: docRef.id, ...newMechanic };
      } catch (error) {
        console.error('Error adding mechanic:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Mécanicien ajouté avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
    },
    onError: (error) => {
      console.error('Error adding mechanic:', error);
      toast.error('Erreur lors de l\'ajout du mécanicien');
    }
  });

  // Update mechanic
  const updateMechanic = useMutation({
    mutationFn: async (updatedMechanic: Mechanic) => {
      try {
        const mechanicDoc = doc(db, COLLECTIONS.GARAGE.MECHANICS, updatedMechanic.id);
        await updateDoc(mechanicDoc, updatedMechanic);
        return updatedMechanic;
      } catch (error) {
        console.error('Error updating mechanic:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Mécanicien mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
    },
    onError: (error) => {
      console.error('Error updating mechanic:', error);
      toast.error('Erreur lors de la mise à jour du mécanicien');
    }
  });

  // Delete mechanic
  const deleteMechanic = useMutation({
    mutationFn: async (mechanicId: string) => {
      try {
        const mechanicDoc = doc(db, COLLECTIONS.GARAGE.MECHANICS, mechanicId);
        await deleteDoc(mechanicDoc);
        return mechanicId;
      } catch (error) {
        console.error('Error deleting mechanic:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Mécanicien supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
    },
    onError: (error) => {
      console.error('Error deleting mechanic:', error);
      toast.error('Erreur lors de la suppression du mécanicien');
    }
  });
  
  return {
    mechanics,
    isLoading,
    error,
    addMechanic,
    updateMechanic,
    deleteMechanic,
    refetchMechanics: refetch
  };
};
