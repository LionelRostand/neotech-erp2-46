
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { 
  TransportDriver, 
  TransportVehicle,
  TransportReservation
} from '@/components/module/submodules/transport/types';

// Import service-related types directly from service-types
import {
  ServiceOption,
  ServiceAvailability
} from '@/components/module/submodules/transport/types/service-types';

/**
 * Hook to fetch data for the Transport module
 */
export const useTransportData = () => {
  // Fetch drivers
  const { 
    data: drivers, 
    isLoading: isDriversLoading, 
    error: driversError 
  } = useCollectionData<TransportDriver>(
    COLLECTIONS.TRANSPORT.DRIVERS,
    [orderBy('lastName')]
  );

  // Fetch vehicles
  const { 
    data: vehicles, 
    isLoading: isVehiclesLoading, 
    error: vehiclesError 
  } = useCollectionData<TransportVehicle>(
    COLLECTIONS.TRANSPORT.VEHICLES,
    [orderBy('name')]
  );

  // Fetch reservations
  const { 
    data: reservations, 
    isLoading: isReservationsLoading, 
    error: reservationsError 
  } = useCollectionData<TransportReservation>(
    COLLECTIONS.TRANSPORT.RESERVATIONS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch clients
  const { 
    data: clients, 
    isLoading: isClientsLoading, 
    error: clientsError 
  } = useCollectionData(
    COLLECTIONS.TRANSPORT.CLIENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch services
  const { 
    data: services, 
    isLoading: isServicesLoading, 
    error: servicesError 
  } = useCollectionData<ServiceOption>(
    COLLECTIONS.TRANSPORT.SETTINGS,
    []
  );

  // Check if any data is still loading
  const isLoading = isDriversLoading || isVehiclesLoading || isReservationsLoading || isClientsLoading || isServicesLoading;

  // Combine all possible errors
  const error = driversError || vehiclesError || reservationsError || clientsError || servicesError;

  return {
    drivers,
    vehicles,
    reservations,
    clients,
    services,
    isLoading,
    error
  };
};
