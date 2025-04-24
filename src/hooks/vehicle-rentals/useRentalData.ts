
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

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
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicle-rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>('VEHICLE_RENTALS_VEHICLES')
  });

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ['vehicle-rentals', 'rentals'],
    queryFn: () => fetchCollectionData<Rental>('VEHICLE_RENTALS_RENTALS')
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['vehicle-rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>('VEHICLE_RENTALS_CLIENTS')
  });

  return {
    vehicles,
    rentals,
    clients,
    isLoading: isLoadingVehicles || isLoadingRentals || isLoadingClients
  };
};
