
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useGarageClients } from './useGarageClients';

export const useGarageVehicles = () => {
  const { add, getAll, update, loading, error } = useFirestore(COLLECTIONS.GARAGE.VEHICLES);
  const { clients, updateClient } = useGarageClients();

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      // Ajouter le véhicule à la collection des véhicules
      const vehicleId = await add({
        ...vehicleData,
        createdAt: new Date().toISOString()
      });

      // Si un client est associé au véhicule, mettre à jour le client
      if (vehicleData.clientId) {
        const client = clients.find(c => c.id === vehicleData.clientId);
        
        if (client) {
          // Préparer la mise à jour du client avec le nouveau véhicule
          const updatedVehicles = client.vehicles || [];
          updatedVehicles.push({
            id: vehicleId,
            make: vehicleData.make,
            model: vehicleData.model,
            licensePlate: vehicleData.licensePlate
          });
          
          // Mettre à jour le client avec la nouvelle liste de véhicules
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
    refetchVehicles: refetch,
    loading,
    error
  };
};
