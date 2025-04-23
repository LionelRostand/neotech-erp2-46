
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

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    ...queryConfig
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<Appointment>(COLLECTIONS.GARAGE.APPOINTMENTS),
    ...queryConfig
  });

  const { data: repairs = [], isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    ...queryConfig
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData<Invoice>(COLLECTIONS.GARAGE.INVOICES),
    ...queryConfig
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData<Supplier>(COLLECTIONS.GARAGE.SUPPLIERS),
    ...queryConfig
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    ...queryConfig
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData<InventoryItem>(COLLECTIONS.GARAGE.INVENTORY),
    ...queryConfig
  });

  const { data: loyalty = [], isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => fetchCollectionData<LoyaltyProgram>(COLLECTIONS.GARAGE.LOYALTY),
    ...queryConfig
  });

  const { data: settings = [], isLoading: isLoadingSettings } = useQuery({
    queryKey: ['garage', 'settings'],
    queryFn: () => fetchCollectionData<GarageSettings>(COLLECTIONS.GARAGE.SETTINGS),
    ...queryConfig
  });

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
