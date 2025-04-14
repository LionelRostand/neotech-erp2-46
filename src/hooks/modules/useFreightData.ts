import { useEffect, useState } from 'react';
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface FreightData {
  shipments: any[];
  carriers: any[];
  containers: any[];
  trackingEvents: any[];
  documents: any[];
  rates: any[];
  invoices: any[];
  clients: any[];
  settings: any[];
  users: any[];
  packages: any[];
  packageTypes: any[];
  routes: any[];
  pricing: any[];
  billing: any[];
  quotes: any[];
  customers: any[];
  vehicles: any[];
  drivers: any[];
  isLoading: boolean;
  error: any;
}

export const useFreightData = (): FreightData => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [packageTypes, setPackageTypes] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  const { data: shipmentsData, isLoading: shipmentsLoading, error: shipmentsError } = useCollectionData(COLLECTIONS.FREIGHT.SHIPMENTS);
  const { data: carriersData, isLoading: carriersLoading, error: carriersError } = useCollectionData(COLLECTIONS.FREIGHT.CARRIERS);
  const { data: containersData, isLoading: containersLoading, error: containersError } = useCollectionData(COLLECTIONS.FREIGHT.CONTAINERS);
  const { data: trackingEventsData, isLoading: trackingEventsLoading, error: trackingEventsError } = useCollectionData(COLLECTIONS.FREIGHT.TRACKING_EVENTS);
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useCollectionData(COLLECTIONS.FREIGHT.DOCUMENTS);
  const { data: ratesData, isLoading: ratesLoading, error: ratesError } = useCollectionData(COLLECTIONS.FREIGHT.RATES);
  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useCollectionData(COLLECTIONS.FREIGHT.INVOICES);
  const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useCollectionData(COLLECTIONS.FREIGHT.CLIENTS);
  const { data: settingsData, isLoading: settingsLoading, error: settingsError } = useCollectionData(COLLECTIONS.FREIGHT.SETTINGS);
  const { data: usersData, isLoading: usersLoading, error: usersError } = useCollectionData(COLLECTIONS.FREIGHT.USERS);
  const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useCollectionData(COLLECTIONS.FREIGHT.PACKAGES);
  const { data: packageTypesData, isLoading: packageTypesLoading, error: packageTypesError } = useCollectionData(COLLECTIONS.FREIGHT.PACKAGE_TYPES);
  const { data: routesData, isLoading: routesLoading, error: routesError } = useCollectionData(COLLECTIONS.FREIGHT.ROUTES);
  const { data: pricingData, isLoading: pricingLoading, error: pricingError } = useCollectionData(COLLECTIONS.FREIGHT.PRICING);
  const { data: billingData, isLoading: billingLoading, error: billingError } = useCollectionData(COLLECTIONS.FREIGHT.BILLING);
  const { data: quotesData, isLoading: quotesLoading, error: quotesError } = useCollectionData(COLLECTIONS.FREIGHT.QUOTES);
  const { data: customersData, isLoading: customersLoading, error: customersError } = useCollectionData(COLLECTIONS.FREIGHT.CUSTOMERS);

  const vehiclesCollection = `freight_vehicles`;
  const { data: vehiclesData, isLoading: vehiclesLoading, error: vehiclesError } = useCollectionData(vehiclesCollection);

  const driversCollection = `freight_drivers`;
  const { data: driversData, isLoading: driversLoading, error: driversError } = useCollectionData(driversCollection);

  useEffect(() => {
    setShipments(shipmentsData);
    setCarriers(carriersData);
    setContainers(containersData);
    setTrackingEvents(trackingEventsData);
    setDocuments(documentsData);
    setRates(ratesData);
    setInvoices(invoicesData);
    setClients(clientsData);
    setSettings(settingsData);
    setUsers(usersData);
    setPackages(packagesData);
    setPackageTypes(packageTypesData);
    setRoutes(routesData);
    setPricing(pricingData);
    setBilling(billingData);
    setQuotes(quotesData);
    setCustomers(customersData);
    setVehicles(vehiclesData);
    setDrivers(driversData);
  }, [
    shipmentsData,
    carriersData,
    containersData,
    trackingEventsData,
    documentsData,
    ratesData,
    invoicesData,
    clientsData,
    settingsData,
    usersData,
    packagesData,
    packageTypesData,
    routesData,
    pricingData,
    billingData,
    quotesData,
    customersData,
    vehiclesData,
    driversData,
  ]);

  const isLoading =
    shipmentsLoading ||
    carriersLoading ||
    containersLoading ||
    trackingEventsLoading ||
    documentsLoading ||
    ratesLoading ||
    invoicesLoading ||
    clientsLoading ||
    settingsLoading ||
    usersLoading ||
    packagesLoading ||
    packageTypesLoading ||
    routesLoading ||
    pricingLoading ||
    billingLoading ||
    quotesLoading ||
    customersLoading ||
    vehiclesLoading ||
    driversLoading;

  const error =
    shipmentsError ||
    carriersError ||
    containersError ||
    trackingEventsError ||
    documentsError ||
    ratesError ||
    invoicesError ||
    clientsError ||
    settingsError ||
    usersError ||
    packagesError ||
    packageTypesError ||
    routesError ||
    pricingError ||
    billingError ||
    quotesError ||
    customersError ||
    vehiclesError ||
    driversError;

  return {
    shipments,
    carriers,
    containers,
    trackingEvents,
    documents,
    rates,
    invoices,
    clients,
    settings,
    users,
    packages,
    packageTypes,
    routes,
    pricing,
    billing,
    quotes,
    customers,
    vehicles,
    drivers,
    isLoading,
    error,
  };
};
