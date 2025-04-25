
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageData = () => {
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS)
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES)
  });

  const { data: mechanics = [], isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS)
  });
  
  const { data: repairs = [], isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS)
  });
  
  // Mock data for other collections that might be used in the dashboard
  const appointments = [];
  const invoices = [];
  const suppliers = [];
  const inventory = [];
  const loyalty = [];

  return {
    clients,
    vehicles,
    mechanics,
    repairs, // Now we're properly returning the repairs data
    appointments,
    invoices,
    suppliers,
    inventory,
    loyalty,
    isLoading: isLoadingClients || isLoadingVehicles || isLoadingMechanics || isLoadingRepairs
  };
};
