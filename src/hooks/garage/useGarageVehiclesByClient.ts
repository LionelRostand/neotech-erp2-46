
import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

export const useGarageVehiclesByClient = (clientId?: string) => {
  const { data: vehicles = [] } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      const result = await fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES);
      return result;
    }
  });
  
  const clientVehicles = clientId ? 
    vehicles.filter(vehicle => vehicle.clientId === clientId) : 
    [];

  return {
    clientVehicles,
  };
};
