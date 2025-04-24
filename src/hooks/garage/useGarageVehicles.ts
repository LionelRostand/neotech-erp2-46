
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
      console.log('Tentative d\'ajout du véhicule:', vehicleData);
      
      const vehicleId = await add({
        ...vehicleData,
        status: vehicleData.status || 'active',
        createdAt: new Date().toISOString()
      });
      
      console.log('Véhicule ajouté avec succès, ID:', vehicleId);

      // Mettre à jour les véhicules du client si un client est spécifié
      if (vehicleData.clientId) {
        console.log('Mise à jour des véhicules du client:', vehicleData.clientId);
        const client = clients.find(c => c.id === vehicleData.clientId);
        
        if (client) {
          const updatedVehicles = [...(client.vehicles || [])];
          updatedVehicles.push({
            id: vehicleId,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year,
            licensePlate: vehicleData.licensePlate
          });
          
          console.log('Véhicules mis à jour pour le client:', updatedVehicles);
          await updateClient(vehicleData.clientId, {
            vehicles: updatedVehicles
          });
        }
      }
      
      toast.success('Véhicule ajouté avec succès');
      await refetch();
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
            year: vehicleData.year || 0,
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

  const { data: vehicles = [], isLoading, refetch } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      try {
        console.log('Récupération des véhicules depuis:', COLLECTIONS.GARAGE.VEHICLES);
        const result = await getAll() as Vehicle[];
        console.log('Véhicules récupérés:', result);
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
    isLoading,
    error
  };
};
