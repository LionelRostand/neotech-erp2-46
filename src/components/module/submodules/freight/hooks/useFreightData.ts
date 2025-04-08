
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
          // Comme nous n'avons pas de méthode query directe, utilisons getAll puis filtrons
          const allEvents = await eventsCollection.getAll();
          data = allEvents.filter(event => event.packageId === packageId);
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

// Hook pour récupérer les conteneurs
export const useContainers = () => {
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const containersCollection = useFirestore(COLLECTIONS.FREIGHT.CONTAINERS);
  
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        const data = await containersCollection.getAll();
        setContainers(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des conteneurs:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les conteneurs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
  }, [containersCollection]);

  return { containers, loading, error };
};

// Hook pour récupérer les documents
export const useFreightDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const documentsCollection = useFirestore(COLLECTIONS.FREIGHT.DOCUMENTS);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await documentsCollection.getAll();
        setDocuments(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [documentsCollection]);

  return { documents, loading, error };
};

// Hook pour récupérer les tarifs
export const usePricing = () => {
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const pricingCollection = useFirestore(COLLECTIONS.FREIGHT.PRICING);
  
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const data = await pricingCollection.getAll();
        setPricing(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des tarifs:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tarifs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [pricingCollection]);

  return { pricing, loading, error };
};

// Hook pour récupérer la facturation
export const useBilling = () => {
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const billingCollection = useFirestore(COLLECTIONS.FREIGHT.BILLING);
  
  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const data = await billingCollection.getAll();
        setBilling(data);
      } catch (err) {
        console.error('Erreur lors de la récupération de la facturation:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la facturation.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [billingCollection]);

  return { billing, loading, error };
};

// Hook pour récupérer les devis
export const useQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const quotesCollection = useFirestore(COLLECTIONS.FREIGHT.QUOTES);
  
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const data = await quotesCollection.getAll();
        setQuotes(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des devis:', err);
        setError(err as Error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les devis.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [quotesCollection]);

  return { quotes, loading, error };
};
