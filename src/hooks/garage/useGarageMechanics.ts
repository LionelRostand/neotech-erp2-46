
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageMechanics = () => {
  const queryClient = useQueryClient();
  
  const { data: mechanics = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const updateMechanic = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Mechanic> }) => {
      const mechanicRef = doc(db, COLLECTIONS.GARAGE.MECHANICS, id);
      await updateDoc(mechanicRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
    },
  });

  const deleteMechanic = useMutation({
    mutationFn: async (id: string) => {
      const mechanicRef = doc(db, COLLECTIONS.GARAGE.MECHANICS, id);
      await deleteDoc(mechanicRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
    },
  });

  return {
    mechanics,
    isLoading,
    error,
    updateMechanic: async (id: string, data: Partial<Mechanic>) => {
      await updateMechanic.mutateAsync({ id, data });
    },
    deleteMechanic: async (id: string) => {
      await deleteMechanic.mutateAsync(id);
    }
  };
};
