
import { useState, useEffect } from 'react';
import { Shipment, Carrier, Route, Package, TrackingEvent, PackageType, Quote, Invoice } from '@/types/freight';
import { fetchFreightCollection } from '@/hooks/fetchFreightCollectionData';

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
        console.log("Fetching all freight data from Firebase collections");
        
        // Shipments collection
        const shipmentsData = await fetchFreightCollection<Shipment>('SHIPMENTS');
        setShipments(shipmentsData);
        
        // Vehicles collection
        const vehiclesData = await fetchFreightCollection('VEHICLES');
        setVehicles(vehiclesData);
        
        // Routes collection
        const routesData = await fetchFreightCollection<Route>('ROUTES');
        setRoutes(routesData);
        
        // Drivers collection
        const driversData = await fetchFreightCollection('DRIVERS');
        setDrivers(driversData);
        
        // Packages collection
        const packagesData = await fetchFreightCollection<Package>('PACKAGES');
        setPackages(packagesData);
        
        // Carriers collection
        const carriersData = await fetchFreightCollection<Carrier>('CARRIERS');
        setCarriers(carriersData);
        
        // Tracking Events collection
        const trackingEventsData = await fetchFreightCollection<TrackingEvent>('TRACKING_EVENTS');
        setTrackingEvents(trackingEventsData);
        
        // Package Types collection
        const packageTypesData = await fetchFreightCollection<PackageType>('PACKAGE_TYPES');
        setPackageTypes(packageTypesData);
        
        // Containers collection
        const containersData = await fetchFreightCollection('CONTAINERS');
        setContainers(containersData);
        
        // Documents collection
        const documentsData = await fetchFreightCollection('DOCUMENTS');
        setDocuments(documentsData);
        
        // Pricing collection
        const pricingData = await fetchFreightCollection('PRICING');
        setPricing(pricingData);
        
        // Billing collection
        const billingData = await fetchFreightCollection('BILLING');
        setBilling(billingData);
        
        // Quotes collection
        const quotesData = await fetchFreightCollection<Quote>('QUOTES');
        setQuotes(quotesData);

        // Invoices collection
        const invoicesData = await fetchFreightCollection<Invoice>('BILLING');
        setInvoices(invoicesData);
        
        console.log("Finished fetching all freight data");
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
