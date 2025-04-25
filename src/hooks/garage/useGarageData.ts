
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair, GarageAppointment } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageData = () => {
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage clients:', error);
      toast.error(`Erreur lors du chargement des clients`);
    }
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles, error: vehiclesError } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage vehicles:', error);
      toast.error(`Erreur lors du chargement des véhicules`);
    }
  });

  const { data: mechanics = [], isLoading: isLoadingMechanics, error: mechanicsError } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage mechanics:', error);
      toast.error(`Erreur lors du chargement des mécaniciens`);
    }
  });

  const { data: repairs = [], isLoading: isLoadingRepairs, error: repairsError } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage repairs:', error);
      toast.error(`Erreur lors du chargement des réparations`);
    }
  });

  const { data: services = [], isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.SERVICES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage services:', error);
      toast.error(`Erreur lors du chargement des services`);
    }
  });

  const { data: appointments = [], isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<GarageAppointment>(COLLECTIONS.GARAGE.APPOINTMENTS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage appointments:', error);
      toast.error(`Erreur lors du chargement des rendez-vous`);
    }
  });

  // Log errors to help with debugging
  if (clientsError) console.error('Error fetching garage clients:', clientsError);
  if (vehiclesError) console.error('Error fetching garage vehicles:', vehiclesError);
  if (mechanicsError) console.error('Error fetching garage mechanics:', mechanicsError);
  if (repairsError) console.error('Error fetching garage repairs:', repairsError);
  if (servicesError) console.error('Error fetching garage services:', servicesError);
  if (appointmentsError) console.error('Error fetching garage appointments:', appointmentsError);

  // Create placeholders for data we haven't implemented fetching for yet
  const { data: invoices = [] } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.INVOICES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: false // Disabled until we implement it fully
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.SUPPLIERS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: false
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.INVENTORY),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: false
  });

  const { data: loyalty = [] } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.LOYALTY),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: false
  });

  // Calculate overall loading state
  const isLoading = isLoadingClients || isLoadingVehicles || isLoadingMechanics || 
             isLoadingRepairs || isLoadingServices || isLoadingAppointments;

  // Calculate if there's any error
  const error = clientsError || vehiclesError || mechanicsError || repairsError || servicesError || appointmentsError;

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
    isLoading,
    error
  };
};
