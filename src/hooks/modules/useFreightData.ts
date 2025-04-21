
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Route as FreightRoute, Carrier, Shipment, Container } from '@/types/freight';

// Define a type for client data
interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt?: any;
}

export const useFreightData = () => {
  const [routes, setRoutes] = useState<FreightRoute[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [clients, setClients] = useState<FreightClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Ensure collection paths exist
        if (!COLLECTIONS.FREIGHT) {
          throw new Error('FREIGHT collections are not defined');
        }

        // Fetch routes
        try {
          const routesRef = collection(db, COLLECTIONS.FREIGHT.ROUTES);
          const routesQuery = query(routesRef, orderBy('name'));
          const routesSnapshot = await getDocs(routesQuery);
          const routesData = routesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FreightRoute[];
          setRoutes(routesData);
        } catch (err) {
          console.error('Error fetching routes:', err);
          setRoutes([]);
        }

        // Fetch carriers
        try {
          const carriersRef = collection(db, COLLECTIONS.FREIGHT.CARRIERS);
          const carriersQuery = query(carriersRef, orderBy('name'));
          const carriersSnapshot = await getDocs(carriersQuery);
          const carriersData = carriersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Carrier[];
          setCarriers(carriersData);
        } catch (err) {
          console.error('Error fetching carriers:', err);
          setCarriers([]);
        }

        // Fetch shipments
        try {
          const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
          const shipmentsQuery = query(shipmentsRef, orderBy('createdAt', 'desc'));
          const shipmentsSnapshot = await getDocs(shipmentsQuery);
          const shipmentsData = shipmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Shipment[];
          setShipments(shipmentsData);
        } catch (err) {
          console.error('Error fetching shipments:', err);
          setShipments([]);
        }

        // Fetch clients
        try {
          const clientsRef = collection(db, COLLECTIONS.FREIGHT.CLIENTS);
          const clientsSnapshot = await getDocs(clientsRef);
          // Process clients to ensure proper structure
          const processedClients = clientsSnapshot.docs.map(doc => {
            const data = doc.data();
            if (!data || typeof data !== 'object') {
              return { id: doc.id, name: 'Client inconnu' } as FreightClient;
            }
            return {
              id: doc.id,
              name: data.name || 'Sans nom',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              notes: data.notes || '',
              createdAt: data.createdAt || null
            } as FreightClient;
          });
          setClients(processedClients);
        } catch (err) {
          console.error('Error fetching clients:', err);
          setClients([]);
        }

        // Fetch containers
        try {
          const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
          const containersQuery = query(containersRef, orderBy('number'));
          const containersSnapshot = await getDocs(containersQuery);
          const containersData = containersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Container[];
          setContainers(containersData);
        } catch (err) {
          console.error('Error fetching containers:', err);
          setContainers([]);
        }

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
