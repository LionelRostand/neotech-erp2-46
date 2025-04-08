
import { useState, useEffect } from 'react';
import { Shipment, Carrier, Route, Package, TrackingEvent, PackageType, Quote, Invoice } from '@/types/freight';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useFreightData = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [containers, setContainers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [billing, setBilling] = useState([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchAllFreightData = async () => {
      try {
        // Shipments collection
        const shipmentsData = await fetchCollectionData<Shipment>(COLLECTIONS.FREIGHT.SHIPMENTS);
        setShipments(shipmentsData);
        
        // Vehicles collection
        const vehiclesData = await fetchCollectionData(COLLECTIONS.FREIGHT.VEHICLES);
        setVehicles(vehiclesData);
        
        // Routes collection
        const routesData = await fetchCollectionData<Route>(COLLECTIONS.FREIGHT.ROUTES);
        setRoutes(routesData);
        
        // Drivers collection
        const driversData = await fetchCollectionData(COLLECTIONS.FREIGHT.DRIVERS);
        setDrivers(driversData);
        
        // Packages collection
        const packagesData = await fetchCollectionData<Package>(COLLECTIONS.FREIGHT.PACKAGES);
        setPackages(packagesData);
        
        // Carriers collection
        const carriersData = await fetchCollectionData<Carrier>(COLLECTIONS.FREIGHT.CARRIERS);
        setCarriers(carriersData);
        
        // Tracking Events collection
        const trackingEventsData = await fetchCollectionData<TrackingEvent>(COLLECTIONS.FREIGHT.TRACKING_EVENTS);
        setTrackingEvents(trackingEventsData);
        
        // Package Types collection
        const packageTypesData = await fetchCollectionData<PackageType>(COLLECTIONS.FREIGHT.PACKAGE_TYPES);
        setPackageTypes(packageTypesData);
        
        // Containers collection
        const containersData = await fetchCollectionData(COLLECTIONS.FREIGHT.CONTAINERS);
        setContainers(containersData);
        
        // Documents collection
        const documentsData = await fetchCollectionData(COLLECTIONS.FREIGHT.DOCUMENTS);
        setDocuments(documentsData);
        
        // Pricing collection
        const pricingData = await fetchCollectionData(COLLECTIONS.FREIGHT.PRICING);
        setPricing(pricingData);
        
        // Billing collection
        const billingData = await fetchCollectionData(COLLECTIONS.FREIGHT.BILLING);
        setBilling(billingData);
        
        // Quotes collection
        const quotesData = await fetchCollectionData<Quote>(COLLECTIONS.FREIGHT.QUOTES);
        setQuotes(quotesData);

        // Invoices collection
        const invoicesData = await fetchCollectionData<Invoice>(COLLECTIONS.FREIGHT.BILLING);
        setInvoices(invoicesData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching freight data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };
    
    fetchAllFreightData();
  }, []);

  return {
    shipments,
    vehicles,
    routes,
    drivers,
    packages,
    carriers,
    trackingEvents,
    packageTypes,
    containers,
    documents,
    pricing,
    billing,
    quotes,
    invoices,
    isLoading,
    error
  };
};
