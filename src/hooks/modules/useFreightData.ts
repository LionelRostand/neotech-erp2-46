
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Route as FreightRoute, Carrier, Shipment, Container } from '@/types/freight';
import { fetchCollectionData } from '@/hooks/firestore/fetchCollectionData';

export const useFreightData = () => {
  const [routes, setRoutes] = useState<FreightRoute[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [clients, setClients] = useState<any[]>([]);
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

        // Fetch clients
        const clientsSnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CLIENTS));
        // Process clients to ensure proper structure
        const processedClients = clientsSnapshot.docs.map(doc => {
          const data = doc.data();
          if (!data || typeof data !== 'object') {
            return { id: doc.id, name: 'Client inconnu' };
          }
          return {
            id: doc.id,
            name: data.name || 'Sans nom',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            notes: data.notes || '',
            createdAt: data.createdAt || null
          };
        });
        setClients(processedClients);

        // Fetch containers
        const containersData = await fetchCollectionData<Container>(
          COLLECTIONS.FREIGHT.CONTAINERS,
          [orderBy('number')]
        );
        setContainers(containersData);

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
    clients,
    containers,
    loading,
    error,
  };
};

// Add a default export to fix the import issue
export default useFreightData;
