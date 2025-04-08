
import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useFreightData = () => {
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [packageTypes, setPackageTypes] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [containers, setContainers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [billing, setBilling] = useState([]);
  const [quotes, setQuotes] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Shipments collection
      const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
      const unsubShipments = onSnapshot(shipmentsRef, (snapshot) => {
        const shipmentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShipments(shipmentsData);
      });
      
      // Vehicles collection 
      const vehiclesRef = collection(db, COLLECTIONS.FREIGHT.VEHICLES);
      const unsubVehicles = onSnapshot(vehiclesRef, (snapshot) => {
        const vehiclesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehiclesData);
      });
      
      // Routes collection
      const routesRef = collection(db, COLLECTIONS.FREIGHT.ROUTES);
      const unsubRoutes = onSnapshot(routesRef, (snapshot) => {
        const routesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRoutes(routesData);
      });
      
      // Drivers collection
      const driversRef = collection(db, COLLECTIONS.FREIGHT.DRIVERS);
      const unsubDrivers = onSnapshot(driversRef, (snapshot) => {
        const driversData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrivers(driversData);
      });
      
      // Packages collection
      const packagesRef = collection(db, COLLECTIONS.FREIGHT.PACKAGES);
      const unsubPackages = onSnapshot(packagesRef, (snapshot) => {
        const packagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(packagesData);
      });
      
      // Carriers collection
      const carriersRef = collection(db, COLLECTIONS.FREIGHT.CARRIERS);
      const unsubCarriers = onSnapshot(carriersRef, (snapshot) => {
        const carriersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCarriers(carriersData);
      });
      
      // Tracking Events collection
      const trackingEventsRef = collection(db, COLLECTIONS.FREIGHT.TRACKING_EVENTS);
      const unsubTrackingEvents = onSnapshot(trackingEventsRef, (snapshot) => {
        const trackingEventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrackingEvents(trackingEventsData);
      });
      
      // Package Types collection
      const packageTypesRef = collection(db, COLLECTIONS.FREIGHT.PACKAGE_TYPES);
      const unsubPackageTypes = onSnapshot(packageTypesRef, (snapshot) => {
        const packageTypesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackageTypes(packageTypesData);
      });
      
      // Containers collection
      const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
      const unsubContainers = onSnapshot(containersRef, (snapshot) => {
        const containersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContainers(containersData);
      });
      
      // Documents collection
      const documentsRef = collection(db, COLLECTIONS.FREIGHT.DOCUMENTS);
      const unsubDocuments = onSnapshot(documentsRef, (snapshot) => {
        const documentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(documentsData);
      });
      
      // Pricing collection
      const pricingRef = collection(db, COLLECTIONS.FREIGHT.PRICING);
      const unsubPricing = onSnapshot(pricingRef, (snapshot) => {
        const pricingData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPricing(pricingData);
      });
      
      // Billing collection
      const billingRef = collection(db, COLLECTIONS.FREIGHT.BILLING);
      const unsubBilling = onSnapshot(billingRef, (snapshot) => {
        const billingData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBilling(billingData);
      });
      
      // Quotes collection
      const quotesRef = collection(db, COLLECTIONS.FREIGHT.QUOTES);
      const unsubQuotes = onSnapshot(quotesRef, (snapshot) => {
        const quotesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuotes(quotesData);
      });
      
      setIsLoading(false);
      
      // Cleanup
      return () => {
        unsubShipments();
        unsubVehicles();
        unsubRoutes();
        unsubDrivers();
        unsubPackages();
        unsubCarriers();
        unsubTrackingEvents();
        unsubPackageTypes();
        unsubContainers();
        unsubDocuments();
        unsubPricing();
        unsubBilling();
        unsubQuotes();
      };
    } catch (err) {
      console.error('Error fetching freight data:', err);
      setError(err);
      setIsLoading(false);
    }
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
    isLoading,
    error
  };
};
