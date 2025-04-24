
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Define types for rental-related entities
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  status: 'available' | 'rented' | 'maintenance';
}

export interface Rental {
  id: string;
  vehicleId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export const useRentalData = () => {
  // Helper function to safely access collection paths
  const getCollectionPath = (path: string | undefined): string => {
    if (!path) {
      console.error('Collection path is undefined');
      return 'invalid_collection_placeholder';
    }
    return path;
  };

  // Use placeholders if COLLECTIONS.TRANSPORT doesn't exist
  const vehiclesCollection = COLLECTIONS.TRANSPORT?.VEHICLES || 'invalid_collection_placeholder';
  const rentalsCollection = COLLECTIONS.TRANSPORT?.RENTALS || 'invalid_collection_placeholder';
  const clientsCollection = COLLECTIONS.TRANSPORT?.CLIENTS || 'invalid_collection_placeholder';

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicle-rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(vehiclesCollection)
  });

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ['vehicle-rentals', 'rentals'],
    queryFn: () => fetchCollectionData<Rental>(rentalsCollection)
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['vehicle-rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>(clientsCollection)
  });

  return {
    vehicles,
    rentals,
    clients,
    isLoading: isLoadingVehicles || isLoadingRentals || isLoadingClients
  };
};
