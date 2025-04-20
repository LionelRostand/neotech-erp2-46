
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RentalSettings } from '@/components/module/submodules/vehicle-rentals/types/settings-types';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from "sonner";

export const useRentalSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['rentals', 'settings'],
    queryFn: () => fetchCollectionData(COLLECTIONS.TRANSPORT.SETTINGS)
      .then(data => data[0] as RentalSettings),
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: Partial<RentalSettings>) => {
      const settingsRef = doc(db, COLLECTIONS.TRANSPORT.SETTINGS, 'general');
      await setDoc(settingsRef, newSettings, { merge: true });
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals', 'settings'] });
      toast.success('Paramètres mis à jour avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour des paramètres');
      console.error('Error updating settings:', error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};
