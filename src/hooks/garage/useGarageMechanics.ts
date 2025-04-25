
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageMechanics = () => {
  const queryClient = useQueryClient();
  
  // Assurer un chemin de collection valide
  const mechanicsPath = COLLECTIONS.GARAGE.MECHANICS || 'garage_mechanics';
  
  const { data: mechanicsRaw = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<any>(mechanicsPath),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
  
  // Normaliser les données pour s'assurer que specialization est toujours un tableau
  const mechanics = mechanicsRaw.map((mechanic: any) => ({
    ...mechanic,
    specialization: Array.isArray(mechanic.specialization) 
      ? mechanic.specialization 
      : typeof mechanic.specialization === 'string' 
        ? [mechanic.specialization] 
        : []
  }));

  const updateMechanic = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Mechanic> }) => {
      // Assurer que specialization est un tableau avant de l'envoyer à Firestore
      const normalizedData = {
        ...data,
        specialization: Array.isArray(data.specialization) 
          ? data.specialization 
          : typeof data.specialization === 'string' 
            ? [data.specialization]
            : data.specialization || []
      };
      
      const mechanicRef = doc(db, mechanicsPath, id);
      await updateDoc(mechanicRef, normalizedData);
      return { id, ...normalizedData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
      toast.success('Mécanicien mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du mécanicien:', error);
      toast.error('Erreur lors de la mise à jour du mécanicien');
    }
  });

  const deleteMechanic = useMutation({
    mutationFn: async (id: string) => {
      const mechanicRef = doc(db, mechanicsPath, id);
      await deleteDoc(mechanicRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
      toast.success('Mécanicien supprimé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du mécanicien:', error);
      toast.error('Erreur lors de la suppression du mécanicien');
    }
  });

  const addMechanic = useMutation({
    mutationFn: async (newMechanic: Omit<Mechanic, 'id'>) => {
      // Assurer que specialization est un tableau
      const normalizedData = {
        ...newMechanic,
        specialization: Array.isArray(newMechanic.specialization) 
          ? newMechanic.specialization 
          : typeof newMechanic.specialization === 'string' 
            ? [newMechanic.specialization]
            : []
      };
      
      const mechanicsCollectionRef = collection(db, mechanicsPath);
      const docRef = await addDoc(mechanicsCollectionRef, normalizedData);
      return { id: docRef.id, ...normalizedData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'mechanics'] });
      toast.success('Mécanicien ajouté avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout du mécanicien:', error);
      toast.error('Erreur lors de l\'ajout du mécanicien');
    }
  });

  return {
    mechanics,
    isLoading,
    error,
    addMechanic,
    updateMechanic: async (id: string, data: Partial<Mechanic>) => {
      await updateMechanic.mutateAsync({ id, data });
    },
    deleteMechanic: async (id: string) => {
      await deleteMechanic.mutateAsync(id);
    }
  };
};
