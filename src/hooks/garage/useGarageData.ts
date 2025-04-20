
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { Vehicle, Repair, Appointment, Invoice, Supplier, GarageClient, InventoryItem, LoyaltyProgram, GarageSettings } from '@/components/module/submodules/garage/types/garage-types';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useGarageData = () => {
  const { data: vehicles, isLoading: isLoadingVehicles } = useFirebaseCollection<Vehicle>(COLLECTIONS.GARAGE.VEHICLES);
  const { data: appointments, isLoading: isLoadingAppointments } = useFirebaseCollection<Appointment>(COLLECTIONS.GARAGE.APPOINTMENTS);
  const { data: repairs, isLoading: isLoadingRepairs } = useFirebaseCollection<Repair>(COLLECTIONS.GARAGE.REPAIRS);
  const { data: invoices, isLoading: isLoadingInvoices } = useFirebaseCollection<Invoice>(COLLECTIONS.GARAGE.INVOICES);
  const { data: suppliers, isLoading: isLoadingSuppliers } = useFirebaseCollection<Supplier>(COLLECTIONS.GARAGE.SUPPLIERS);
  const { data: clients, isLoading: isLoadingClients } = useFirebaseCollection<GarageClient>(COLLECTIONS.GARAGE.CLIENTS);
  const { data: inventory, isLoading: isLoadingInventory } = useFirebaseCollection<InventoryItem>(COLLECTIONS.GARAGE.INVENTORY);
  const { data: loyalty, isLoading: isLoadingLoyalty } = useFirebaseCollection<LoyaltyProgram>(COLLECTIONS.GARAGE.LOYALTY);
  const { data: settings, isLoading: isLoadingSettings } = useFirebaseCollection<GarageSettings>(COLLECTIONS.GARAGE.SETTINGS);

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
