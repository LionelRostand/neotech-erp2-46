
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Vehicle, Repair, Appointment, Invoice, Supplier, GarageClient, InventoryItem, LoyaltyProgram, GarageSettings } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageData = () => {
  // Configuration commune pour tous les useQuery
  const queryConfig = {
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchIntervalInBackground: true, // Continuer le rafraîchissement même si l'onglet est en arrière-plan
    refetchOnWindowFocus: true, // Rafraîchir quand l'utilisateur revient sur l'onglet
    staleTime: 10000, // Considérer les données comme périmées après 10 secondes
  };

  // Safety check for collection paths
  const validateCollectionPath = (path: string | undefined, name: string): string => {
    if (!path || path.trim() === '') {
      console.error(`Collection path for ${name} is undefined or empty`);
      // Return a placeholder path that won't be used but prevents Firebase error
      return 'invalid_collection_placeholder';
    }
    return path;
  };

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(
      validateCollectionPath(COLLECTIONS.GARAGE?.VEHICLES, 'vehicles')
    ),
    ...queryConfig
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<Appointment>(
      validateCollectionPath(COLLECTIONS.GARAGE?.APPOINTMENTS, 'appointments')
    ),
    ...queryConfig
  });

  const { data: repairs = [], isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(
      validateCollectionPath(COLLECTIONS.GARAGE?.REPAIRS, 'repairs')
    ),
    ...queryConfig
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData<Invoice>(
      validateCollectionPath(COLLECTIONS.GARAGE?.INVOICES, 'invoices')
    ),
    ...queryConfig
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData<Supplier>(
      validateCollectionPath(COLLECTIONS.GARAGE?.SUPPLIERS, 'suppliers')
    ),
    ...queryConfig
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(
      validateCollectionPath(COLLECTIONS.GARAGE?.CLIENTS, 'clients')
    ),
    ...queryConfig
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData<InventoryItem>(
      validateCollectionPath(COLLECTIONS.GARAGE?.INVENTORY, 'inventory')
    ),
    ...queryConfig
  });

  const { data: loyalty = [], isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => fetchCollectionData<LoyaltyProgram>(
      validateCollectionPath(COLLECTIONS.GARAGE?.LOYALTY, 'loyalty')
    ),
    ...queryConfig
  });

  const { data: settings = [], isLoading: isLoadingSettings } = useQuery({
    queryKey: ['garage', 'settings'],
    queryFn: () => fetchCollectionData<GarageSettings>(
      validateCollectionPath(COLLECTIONS.GARAGE?.SETTINGS, 'settings')
    ),
    ...queryConfig
  });

  // Add refetch functions for each collection
  const refetchRepairs = () => {
    // Explicitly trigger a refetch for the repairs query
    return useQuery.getQueryCache().findAll(['garage', 'repairs'])[0]?.fetch();
  };

  return {
    vehicles,
    appointments,
    repairs,
    invoices,
    suppliers,
    clients,
    inventory,
    loyalty,
    settings: settings[0],
    refetchRepairs,
    isLoading: 
      isLoadingVehicles || 
      isLoadingAppointments || 
      isLoadingRepairs || 
      isLoadingInvoices || 
      isLoadingSuppliers || 
      isLoadingClients || 
      isLoadingInventory || 
      isLoadingLoyalty || 
      isLoadingSettings
  };
};
