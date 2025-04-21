
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
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

// Utility function to safely fetch from a collection
const safelyFetchCollection = async <T>(collectionPath: string, queryConstraints: any[] = []): Promise<T[]> => {
  try {
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Collection path cannot be empty');
      return [];
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    console.error(`Error fetching from ${collectionPath}:`, error);
    return [];
  }
};

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
        const routesPath = COLLECTIONS.FREIGHT.ROUTES;
        if (routesPath && routesPath.trim() !== '') {
          try {
            const routesData = await safelyFetchCollection<FreightRoute>(
              routesPath, 
              [orderBy('name')]
            );
            setRoutes(routesData);
          } catch (err) {
            console.error('Error fetching routes:', err);
            setRoutes([]);
          }
        }

        // Fetch carriers
        const carriersPath = COLLECTIONS.FREIGHT.CARRIERS;
        if (carriersPath && carriersPath.trim() !== '') {
          try {
            const carriersData = await safelyFetchCollection<Carrier>(
              carriersPath, 
              [orderBy('name')]
            );
            setCarriers(carriersData);
          } catch (err) {
            console.error('Error fetching carriers:', err);
            setCarriers([]);
          }
        }

        // Fetch shipments
        const shipmentsPath = COLLECTIONS.FREIGHT.SHIPMENTS;
        if (shipmentsPath && shipmentsPath.trim() !== '') {
          try {
            const shipmentsData = await safelyFetchCollection<Shipment>(
              shipmentsPath, 
              [orderBy('createdAt', 'desc')]
            );
            setShipments(shipmentsData);
          } catch (err) {
            console.error('Error fetching shipments:', err);
            setShipments([]);
          }
        }

        // Fetch clients
        const clientsPath = COLLECTIONS.FREIGHT.CLIENTS;
        if (clientsPath && clientsPath.trim() !== '') {
          try {
            const clientsSnapshot = await safelyFetchCollection<any>(clientsPath);
            // Process clients to ensure proper structure
            const processedClients = clientsSnapshot.map(data => {
              if (!data || typeof data !== 'object') {
                return { id: data.id || 'unknown', name: 'Client inconnu' } as FreightClient;
              }
              return {
                id: data.id,
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
        }

        // Fetch containers
        const containersPath = COLLECTIONS.FREIGHT.CONTAINERS;
        if (containersPath && containersPath.trim() !== '') {
          try {
            const containersData = await safelyFetchCollection<Container>(
              containersPath, 
              [orderBy('createdAt', 'desc')]
            );
            setContainers(containersData);
          } catch (err) {
            console.error('Error fetching containers:', err);
            setContainers([]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching freight data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
        toast.error('Erreur lors du chargement des données');
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
