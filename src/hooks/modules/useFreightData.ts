
import { useState, useEffect } from 'react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { Shipment, Carrier, Route, Package, TrackingEvent, PackageType, Quote, Invoice } from '@/types/freight';

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
        const shipmentsData = await fetchFreightCollectionData<Shipment>('SHIPMENTS');
        setShipments(shipmentsData);
        
        // Vehicles collection
        const vehiclesData = await fetchFreightCollectionData('VEHICLES');
        setVehicles(vehiclesData);
        
        // Routes collection
        const routesData = await fetchFreightCollectionData<Route>('ROUTES');
        setRoutes(routesData);
        
        // Drivers collection
        const driversData = await fetchFreightCollectionData('DRIVERS');
        setDrivers(driversData);
        
        // Packages collection
        const packagesData = await fetchFreightCollectionData<Package>('PACKAGES');
        setPackages(packagesData);
        
        // Carriers collection
        const carriersData = await fetchFreightCollectionData<Carrier>('CARRIERS');
        setCarriers(carriersData);
        
        // Tracking Events collection
        const trackingEventsData = await fetchFreightCollectionData<TrackingEvent>('TRACKING_EVENTS');
        setTrackingEvents(trackingEventsData);
        
        // Package Types collection
        const packageTypesData = await fetchFreightCollectionData<PackageType>('PACKAGE_TYPES');
        setPackageTypes(packageTypesData);
        
        // Containers collection
        const containersData = await fetchFreightCollectionData('CONTAINERS');
        setContainers(containersData);
        
        // Documents collection
        const documentsData = await fetchFreightCollectionData('DOCUMENTS');
        setDocuments(documentsData);
        
        // Pricing collection
        const pricingData = await fetchFreightCollectionData('PRICING');
        setPricing(pricingData);
        
        // Billing collection
        const billingData = await fetchFreightCollectionData('BILLING');
        setBilling(billingData);
        
        // Quotes collection
        const quotesData = await fetchFreightCollectionData<Quote>('QUOTES');
        setQuotes(quotesData);

        // Invoices collection
        const invoicesData = await fetchFreightCollectionData<Invoice>('BILLING');
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
