
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { useGarageVehicles } from './useGarageVehicles';

export const useGarageVehiclesByClient = (clientId?: string) => {
  const { vehicles } = useGarageVehicles();
  
  const clientVehicles = clientId ? 
    vehicles.filter(vehicle => vehicle.clientId === clientId) : 
    [];

  return {
    clientVehicles,
  };
};
