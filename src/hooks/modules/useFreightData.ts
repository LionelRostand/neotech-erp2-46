
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Route as FreightRoute, Carrier, Shipment } from '@/types/freight';
import { fetchCollectionData } from '@/hooks/firestore/fetchCollectionData';

export const useFreightData = () => {
  const [routes, setRoutes] = useState<FreightRoute[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch routes
        const routesData = await fetchCollectionData<FreightRoute>(
          COLLECTIONS.FREIGHT.ROUTES,
          [orderBy('name')]
        );
        setRoutes(routesData);

        // Fetch carriers
        const carriersData = await fetchCollectionData<Carrier>(
          COLLECTIONS.FREIGHT.CARRIERS,
          [orderBy('name')]
        );
        setCarriers(carriersData);

        // Fetch shipments
        const shipmentsData = await fetchCollectionData<Shipment>(
          COLLECTIONS.FREIGHT.SHIPMENTS,
          [orderBy('createdAt', 'desc')]
        );
        setShipments(shipmentsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching freight data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    routes,
    carriers,
    shipments,
    loading,
    error,
  };
};

// Add a default export to fix the import issue
export default useFreightData;
