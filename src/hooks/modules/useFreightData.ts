
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { 
  Shipment, 
  Carrier, 
  Package,
  Route,
  TrackingEvent,
  PackageType 
} from '@/types/freight';

/**
 * Hook to fetch data for the Freight module
 */
export const useFreightData = () => {
  // Fetch shipments
  const { 
    data: shipments, 
    isLoading: isShipmentsLoading, 
    error: shipmentsError 
  } = useCollectionData<Shipment>(
    COLLECTIONS.FREIGHT.SHIPMENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch carriers
  const { 
    data: carriers, 
    isLoading: isCarriersLoading, 
    error: carriersError 
  } = useCollectionData<Carrier>(
    COLLECTIONS.FREIGHT.CARRIERS,
    [orderBy('name')]
  );

  // Fetch packages
  const { 
    data: packages, 
    isLoading: isPackagesLoading, 
    error: packagesError 
  } = useCollectionData<Package>(
    COLLECTIONS.FREIGHT.PACKAGES,
    [orderBy('createdAt', 'desc')]
  );

  // Fetch routes
  const { 
    data: routes, 
    isLoading: isRoutesLoading, 
    error: routesError 
  } = useCollectionData<Route>(
    COLLECTIONS.FREIGHT.ROUTES,
    []
  );

  // Fetch tracking events
  const { 
    data: trackingEvents, 
    isLoading: isEventsLoading, 
    error: eventsError 
  } = useCollectionData<TrackingEvent>(
    COLLECTIONS.FREIGHT.TRACKING_EVENTS,
    [orderBy('timestamp', 'desc')]
  );

  // Fetch package types
  const { 
    data: packageTypes, 
    isLoading: isTypesLoading, 
    error: typesError 
  } = useCollectionData<PackageType>(
    COLLECTIONS.FREIGHT.PACKAGE_TYPES,
    []
  );

  // Check if any data is still loading
  const isLoading = 
    isShipmentsLoading || 
    isCarriersLoading || 
    isPackagesLoading || 
    isRoutesLoading || 
    isEventsLoading || 
    isTypesLoading;

  // Combine all possible errors
  const error = 
    shipmentsError || 
    carriersError || 
    packagesError || 
    routesError || 
    eventsError || 
    typesError;

  return {
    shipments,
    carriers,
    packages,
    routes,
    trackingEvents,
    packageTypes,
    isLoading,
    error
  };
};
