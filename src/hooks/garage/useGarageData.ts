
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle, Mechanic, Repair, GarageAppointment, Service, Supplier, Inventory } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageData = () => {
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError, refetch: refetchClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage clients:', error);
      toast.error(`Erreur lors du chargement des clients`);
    }
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles, error: vehiclesError, refetch: refetchVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage vehicles:', error);
      toast.error(`Erreur lors du chargement des véhicules`);
    }
  });

  const { data: mechanics = [], isLoading: isLoadingMechanics, error: mechanicsError, refetch: refetchMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage mechanics:', error);
      toast.error(`Erreur lors du chargement des mécaniciens`);
    }
  });

  const { data: repairs = [], isLoading: isLoadingRepairs, error: repairsError, refetch: refetchRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage repairs:', error);
      toast.error(`Erreur lors du chargement des réparations`);
    }
  });

  const { data: services = [], isLoading: isLoadingServices, error: servicesError, refetch: refetchServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage services:', error);
      toast.error(`Erreur lors du chargement des services`);
    }
  });

  const { data: appointments = [], isLoading: isLoadingAppointments, error: appointmentsError, refetch: refetchAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<GarageAppointment>(COLLECTIONS.GARAGE.APPOINTMENTS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage appointments:', error);
      toast.error(`Erreur lors du chargement des rendez-vous`);
    }
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers, error: suppliersError, refetch: refetchSuppliers } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData<Supplier>(COLLECTIONS.GARAGE.SUPPLIERS),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage suppliers:', error);
      toast.error(`Erreur lors du chargement des fournisseurs`);
    }
  });

  const { data: inventory = [], isLoading: isLoadingInventory, error: inventoryError, refetch: refetchInventory } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData<Inventory>(COLLECTIONS.GARAGE.INVENTORY),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching garage inventory:', error);
      toast.error(`Erreur lors du chargement de l'inventaire`);
    }
  });

  // Placeholder for other data (invoices, loyalty)
  const { data: invoices = [] } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.INVOICES),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: true // Enable this query
  });

  const { data: loyalty = [] } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.LOYALTY),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: true
  });

  // Calculate overall loading state
  const isLoading = isLoadingClients || isLoadingVehicles || isLoadingMechanics || 
             isLoadingRepairs || isLoadingServices || isLoadingAppointments || 
             isLoadingSuppliers || isLoadingInventory;

  // Calculate if there's any error
  const error = clientsError || vehiclesError || mechanicsError || repairsError || 
          servicesError || appointmentsError || suppliersError || inventoryError;
  
  // Refetch all data
  const refetch = () => {
    refetchClients();
    refetchVehicles();
    refetchMechanics();
    refetchRepairs();
    refetchServices();
    refetchAppointments();
    refetchSuppliers();
    refetchInventory();
  };

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
    error,
    refetch
  };
};
