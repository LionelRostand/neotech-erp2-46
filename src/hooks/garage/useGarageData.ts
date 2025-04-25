
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair, GarageAppointment } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageData = () => {
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles, error: vehiclesError } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  const { data: mechanics = [], isLoading: isLoadingMechanics, error: mechanicsError } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  const { data: repairs = [], isLoading: isLoadingRepairs, error: repairsError } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  const { data: services = [], isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.SERVICES),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  const { data: appointments = [], isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<GarageAppointment>(COLLECTIONS.GARAGE.APPOINTMENTS),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });

  // Log errors to help with debugging
  if (clientsError) console.error('Error fetching garage clients:', clientsError);
  if (vehiclesError) console.error('Error fetching garage vehicles:', vehiclesError);
  if (mechanicsError) console.error('Error fetching garage mechanics:', mechanicsError);
  if (repairsError) console.error('Error fetching garage repairs:', repairsError);
  if (servicesError) console.error('Error fetching garage services:', servicesError);
  if (appointmentsError) console.error('Error fetching garage appointments:', appointmentsError);

  // For now, these are placeholders until we implement their data fetching
  const invoices = [];
  const suppliers = [];
  const inventory = [];
  const loyalty = [];

  // Return properly typed data to ensure consumers of this hook get the data they expect
  return {
    clients,
    vehicles,
    mechanics,
    repairs,
    services,
    appointments,
    invoices,
    suppliers,
    inventory,
    loyalty,
    isLoading: isLoadingClients || isLoadingVehicles || isLoadingMechanics || 
               isLoadingRepairs || isLoadingServices || isLoadingAppointments,
    error: clientsError || vehiclesError || mechanicsError || repairsError || servicesError || appointmentsError
  };
};
