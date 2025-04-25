
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useGarageData = () => {
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.CLIENTS)
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.VEHICLES)
  });

  const { data: mechanics = [], isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.MECHANICS)
  });

  return {
    clients,
    vehicles,
    mechanics,
    isLoading: isLoadingClients || isLoadingVehicles || isLoadingMechanics
  };
};
