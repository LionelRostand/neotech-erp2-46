
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageVehiclesOperations = () => {
  const { add, update, remove } = useFirestore(COLLECTIONS.GARAGE.VEHICLES);

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const result = await add(vehicleData);
      toast.success('Véhicule ajouté avec succès');
      return result;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Erreur lors de l\'ajout du véhicule');
      throw error;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    try {
      await update(id, vehicleData);
      toast.success('Véhicule mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Erreur lors de la mise à jour du véhicule');
      throw error;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await remove(id);
      toast.success('Véhicule supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Erreur lors de la suppression du véhicule');
      throw error;
    }
  };

  return {
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
};
