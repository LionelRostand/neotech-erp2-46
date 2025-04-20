
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { Vehicle, Repair, Appointment, Invoice, Supplier, GarageClient, InventoryItem, LoyaltyProgram, GarageSettings } from '@/components/module/submodules/garage/types/garage-types';

const COLLECTIONS = {
  VEHICLES: 'garage_vehicles',
  APPOINTMENTS: 'garage_appointments',
  REPAIRS: 'garage_repairs',
  INVOICES: 'garage_invoices',
  SUPPLIERS: 'garage_suppliers',
  CLIENTS: 'garage_clients',
  INVENTORY: 'garage_inventory',
  LOYALTY: 'garage_loyalty',
  SETTINGS: 'garage_settings'
};

export const useGarageData = () => {
  const { data: vehicles, isLoading: isLoadingVehicles } = useFirebaseCollection<Vehicle>(COLLECTIONS.VEHICLES);
  const { data: appointments, isLoading: isLoadingAppointments } = useFirebaseCollection<Appointment>(COLLECTIONS.APPOINTMENTS);
  const { data: repairs, isLoading: isLoadingRepairs } = useFirebaseCollection<Repair>(COLLECTIONS.REPAIRS);
  const { data: invoices, isLoading: isLoadingInvoices } = useFirebaseCollection<Invoice>(COLLECTIONS.INVOICES);
  const { data: suppliers, isLoading: isLoadingSuppliers } = useFirebaseCollection<Supplier>(COLLECTIONS.SUPPLIERS);
  const { data: clients, isLoading: isLoadingClients } = useFirebaseCollection<GarageClient>(COLLECTIONS.CLIENTS);
  const { data: inventory, isLoading: isLoadingInventory } = useFirebaseCollection<InventoryItem>(COLLECTIONS.INVENTORY);
  const { data: loyalty, isLoading: isLoadingLoyalty } = useFirebaseCollection<LoyaltyProgram>(COLLECTIONS.LOYALTY);
  const { data: settings, isLoading: isLoadingSettings } = useFirebaseCollection<GarageSettings>(COLLECTIONS.SETTINGS);

  return {
    vehicles: vehicles || [],
    appointments: appointments || [],
    repairs: repairs || [],
    invoices: invoices || [],
    suppliers: suppliers || [],
    clients: clients || [],
    inventory: inventory || [],
    loyalty: loyalty || [],
    settings: settings?.[0],
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
