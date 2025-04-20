
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useFreightData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the collection paths directly from COLLECTIONS object
  const { data: billing } = useCollectionData(COLLECTIONS.FREIGHT.BILLING);
  const { data: carriers } = useCollectionData(COLLECTIONS.FREIGHT.CARRIERS);
  const { data: clients } = useCollectionData(COLLECTIONS.FREIGHT.CLIENTS);
  const { data: containers } = useCollectionData(COLLECTIONS.FREIGHT.CONTAINERS);
  const { data: customers } = useCollectionData(COLLECTIONS.FREIGHT.CUSTOMERS);
  const { data: documents } = useCollectionData(COLLECTIONS.FREIGHT.DOCUMENTS);
  const { data: packageTypes } = useCollectionData(COLLECTIONS.FREIGHT.PACKAGE_TYPES);
  const { data: packages } = useCollectionData(COLLECTIONS.FREIGHT.PACKAGES);
  const { data: pricing } = useCollectionData(COLLECTIONS.FREIGHT.PRICING);
  const { data: quotes } = useCollectionData(COLLECTIONS.FREIGHT.QUOTES);
  const { data: routes } = useCollectionData(COLLECTIONS.FREIGHT.ROUTES);
  const { data: settings } = useCollectionData(COLLECTIONS.FREIGHT.SETTINGS);
  const { data: shipments } = useCollectionData(COLLECTIONS.FREIGHT.SHIPMENTS);
  const { data: tracking } = useCollectionData(COLLECTIONS.FREIGHT.TRACKING);
  const { data: trackingEvents } = useCollectionData(COLLECTIONS.FREIGHT.TRACKING_EVENTS);
  const { data: users } = useCollectionData(COLLECTIONS.FREIGHT.USERS);

  // Update loading state based on all collection queries
  useEffect(() => {
    const collections = [
      billing, carriers, clients, containers, customers, 
      documents, packageTypes, packages, pricing, quotes,
      routes, settings, shipments, tracking, trackingEvents, users
    ];
    
    const isLoading = collections.some(collection => !collection);
    setLoading(isLoading);
  }, [
    billing, carriers, clients, containers, customers,
    documents, packageTypes, packages, pricing, quotes,
    routes, settings, shipments, tracking, trackingEvents, users
  ]);

  return {
    billing: billing || [],
    carriers: carriers || [],
    clients: clients || [],
    containers: containers || [],
    customers: customers || [],
    documents: documents || [],
    packageTypes: packageTypes || [],
    packages: packages || [],
    pricing: pricing || [],
    quotes: quotes || [],
    routes: routes || [],
    settings: settings || [],
    shipments: shipments || [],
    tracking: tracking || [],
    trackingEvents: trackingEvents || [],
    users: users || [],
    loading,
    error
  };
};

export default useFreightData;
