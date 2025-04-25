
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useGarageData = () => {
  // Assurer des chemins de collection valides
  const appointmentsPath = COLLECTIONS.GARAGE.APPOINTMENTS || 'garage_appointments';
  const clientsPath = COLLECTIONS.GARAGE.CLIENTS || 'garage_clients';
  const vehiclesPath = COLLECTIONS.GARAGE.VEHICLES || 'garage_vehicles';
  const mechanicsPath = COLLECTIONS.GARAGE.MECHANICS || 'garage_mechanics';
  const servicesPath = COLLECTIONS.GARAGE.SERVICES || 'garage_services';
  const repairsPath = COLLECTIONS.GARAGE.REPAIRS || 'garage_repairs';
  const invoicesPath = COLLECTIONS.GARAGE.INVOICES || 'garage_invoices';
  const partsPath = COLLECTIONS.GARAGE.PARTS || 'garage_parts';
  
  // Fetch appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData(appointmentsPath),
  });
  
  // Fetch clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData(clientsPath),
  });
  
  // Fetch vehicles
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData(vehiclesPath),
  });
  
  // Fetch mechanics
  const { data: mechanics = [], isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData(mechanicsPath),
  });
  
  // Fetch services
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData(servicesPath),
  });
  
  // Fetch repairs
  const { data: repairs = [], isLoading: isLoadingRepairs } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData(repairsPath),
  });
  
  // Fetch invoices
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData(invoicesPath),
  });
  
  // Fetch parts
  const { data: parts = [], isLoading: isLoadingParts } = useQuery({
    queryKey: ['garage', 'parts'],
    queryFn: () => fetchCollectionData(partsPath),
  });
  
  const isLoading = 
    isLoadingAppointments || 
    isLoadingClients || 
    isLoadingVehicles || 
    isLoadingMechanics ||
    isLoadingServices ||
    isLoadingRepairs ||
    isLoadingInvoices ||
    isLoadingParts;
  
  return {
    appointments,
    clients,
    vehicles,
    mechanics,
    services,
    repairs,
    invoices,
    parts,
    isLoading
  };
};
