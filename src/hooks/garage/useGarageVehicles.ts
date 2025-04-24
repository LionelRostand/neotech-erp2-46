import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useGarageClients } from './useGarageClients';

export const useGarageVehicles = () => {
  const { add, getAll, update, remove, loading, error } = useFirestore(COLLECTIONS.GARAGE.VEHICLES);
  const { clients, updateClient } = useGarageClients();

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const vehicleId = await add({
        ...vehicleData,
        createdAt: new Date().toISOString()
      });

      if (vehicleData.clientId) {
        const client = clients.find(c => c.id === vehicleData.clientId);
        
        if (client) {
          const updatedVehicles = client.vehicles || [];
          updatedVehicles.push({
            id: vehicleId,
            make: vehicleData.make,
            model: vehicleData.model,
            licensePlate: vehicleData.licensePlate
          });
          
          await updateClient(vehicleData.clientId, {
            vehicles: updatedVehicles
          });
        }
      }
      
      toast.success('Véhicule ajouté avec succès');
      return vehicleId;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du véhicule:', err);
      toast.error('Erreur lors de l\'ajout du véhicule');
      throw err;
    }
  };

  const updateVehicle = async (vehicleId: string, vehicleData: Partial<Vehicle>) => {
    try {
      await update(vehicleId, {
        ...vehicleData,
        updatedAt: new Date().toISOString()
      });
      
      if (vehicleData.clientId) {
        const client = clients.find(c => c.id === vehicleData.clientId);
        if (client) {
          const updatedVehicles = client.vehicles?.filter(v => v.id !== vehicleId) || [];
          updatedVehicles.push({
            id: vehicleId,
            make: vehicleData.make || '',
            model: vehicleData.model || '',
            licensePlate: vehicleData.licensePlate || ''
          });
          
          await updateClient(vehicleData.clientId, {
            vehicles: updatedVehicles
          });
        }
      }
      
      toast.success('Véhicule mis à jour avec succès');
      await refetch();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du véhicule:', err);
      toast.error('Erreur lors de la mise à jour du véhicule');
      throw err;
    }
  };

  const deleteVehicle = async (vehicleId: string, clientId: string) => {
    try {
      await remove(vehicleId);
      
      const client = clients.find(c => c.id === clientId);
      if (client) {
        const updatedVehicles = client.vehicles?.filter(v => v.id !== vehicleId) || [];
        await updateClient(clientId, {
          vehicles: updatedVehicles
        });
      }
      
      toast.success('Véhicule supprimé avec succès');
      await refetch();
    } catch (err) {
      console.error('Erreur lors de la suppression du véhicule:', err);
      toast.error('Erreur lors de la suppression du véhicule');
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

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetchVehicles: refetch,
    loading,
    error
  };
};
