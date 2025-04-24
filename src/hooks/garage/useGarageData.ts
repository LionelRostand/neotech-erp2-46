import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Vehicle, Repair, Appointment, Invoice, Supplier, GarageClient, InventoryItem, LoyaltyProgram, GarageSettings } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageData = () => {
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES)
  });

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData<Appointment>('garage_appointments')
  });

  const { data: repairs = [], isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => {
      // Check if REPAIRS exists in collections
      const collectionPath = COLLECTIONS.GARAGE.REPAIRS || 'garage_repairs';
      return fetchCollectionData<Repair>(collectionPath);
    }
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData<Invoice>(COLLECTIONS.GARAGE.INVOICES)
  });

  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => {
      // Check if SUPPLIERS exists in collections
      const collectionPath = COLLECTIONS.GARAGE.SUPPLIERS || 'garage_suppliers';
      return fetchCollectionData<Supplier>(collectionPath);
    }
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS)
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => {
      // Check if INVENTORY exists in collections
      const collectionPath = COLLECTIONS.GARAGE.INVENTORY || 'garage_inventory';
      return fetchCollectionData<InventoryItem>(collectionPath);
    }
  });

  const { data: loyalty = [], isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['garage', 'loyalty'],
    queryFn: () => {
      // Check if LOYALTY exists in collections
      const collectionPath = COLLECTIONS.GARAGE.LOYALTY || 'garage_loyalty';
      return fetchCollectionData<LoyaltyProgram>(collectionPath);
    }
  });

  const { data: settings = [], isLoading: isLoadingSettings } = useQuery({
    queryKey: ['garage', 'settings'],
    queryFn: () => {
      // Check if SETTINGS exists in collections
      const collectionPath = COLLECTIONS.GARAGE.SETTINGS || 'garage_settings';
      return fetchCollectionData<GarageSettings>(collectionPath);
    }
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
