
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment, Carrier, Package, Route, TrackingEvent, PackageType } from '@/types/freight';
import { toast } from '@/hooks/use-toast';

// Hook pour récupérer les expéditions
export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const shipmentsCollection = useFirestore(COLLECTIONS.FREIGHT.SHIPMENTS);
  
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const data = await shipmentsCollection.getAll();
        setShipments(data as Shipment[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des expéditions:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les expéditions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [shipmentsCollection]);

  return { shipments, loading, error };
};

// Hook pour récupérer les transporteurs
export const useCarriers = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const carriersCollection = useFirestore(COLLECTIONS.FREIGHT.CARRIERS);
  
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        setLoading(true);
        const data = await carriersCollection.getAll();
        setCarriers(data as Carrier[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des transporteurs:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les transporteurs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, [carriersCollection]);

  return { carriers, loading, error };
};

// Hook pour récupérer les colis
export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const packagesCollection = useFirestore(COLLECTIONS.FREIGHT.PACKAGES);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packagesCollection.getAll();
        setPackages(data as Package[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des colis:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les colis.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [packagesCollection]);

  return { packages, loading, error };
};

// Hook pour récupérer les itinéraires
export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const routesCollection = useFirestore(COLLECTIONS.FREIGHT.ROUTES);
  
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await routesCollection.getAll();
        setRoutes(data as Route[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des itinéraires:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les itinéraires.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [routesCollection]);

  return { routes, loading, error };
};

// Hook pour récupérer les événements de suivi
export const useTrackingEvents = (packageId?: string) => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const eventsCollection = useFirestore(COLLECTIONS.FREIGHT.TRACKING_EVENTS);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let data;
        
        if (packageId) {
          data = await eventsCollection.query([{
            field: 'packageId',
            operator: '==',
            value: packageId
          }]);
        } else {
          data = await eventsCollection.getAll();
        }
        
        // Trier les événements par date (du plus récent au plus ancien)
        const sortedEvents = [...data].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setEvents(sortedEvents as TrackingEvent[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des événements de suivi:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les événements de suivi.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventsCollection, packageId]);

  return { events, loading, error };
};

// Hook pour récupérer les types de colis
export const usePackageTypes = () => {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const packageTypesCollection = useFirestore(COLLECTIONS.FREIGHT.PACKAGE_TYPES);
  
  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        setLoading(true);
        const data = await packageTypesCollection.getAll();
        setPackageTypes(data as PackageType[]);
      } catch (err) {
        console.error('Erreur lors de la récupération des types de colis:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les types de colis.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackageTypes();
  }, [packageTypesCollection]);

  return { packageTypes, loading, error };
};
