import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useGarageVehicles = () => {
  const { add, getAll, loading, error } = useFirestore(COLLECTIONS.GARAGE.VEHICLES);

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      // Make sure createdAt is a valid ISO string
      const vehicleWithValidDate = {
        ...vehicleData,
        createdAt: new Date().toISOString()
      };
      
      const result = await add(vehicleWithValidDate);
      toast.success('Véhicule ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du véhicule:', err);
      toast.error('Erreur lors de l\'ajout du véhicule');
      throw err;
    }
  };

  const { data: vehicles = [], refetch } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      try {
        const result = await getAll() as Vehicle[];
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des véhicules:', err);
        toast.error('Erreur lors de la récupération des véhicules');
        return [];
      }
    }
  });

  const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
    try {
      const docRef = doc(db, COLLECTIONS.GARAGE.VEHICLES, id);
      await updateDoc(docRef, data);
      toast.success('Véhicule mis à jour avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du véhicule:', err);
      toast.error('Erreur lors de la mise à jour du véhicule');
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const docRef = doc(db, COLLECTIONS.GARAGE.VEHICLES, id);
      await deleteDoc(docRef);
      toast.success('Véhicule supprimé avec succès');
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du véhicule:', err);
      toast.error('Erreur lors de la suppression du véhicule');
      throw err;
    }
  };

  return {
    vehicles,
    addVehicle,
    refetchVehicles: refetch,
    loading,
    error,
    updateVehicle,
    deleteVehicle,
  };
};
