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
      
      // Other collections if they exist
      if (COLLECTIONS.FREIGHT.TRACKING_EVENTS) {
        const trackingEventsRef = collection(db, COLLECTIONS.FREIGHT.TRACKING_EVENTS);
        const unsubTrackingEvents = onSnapshot(trackingEventsRef, (snapshot) => {
          const trackingEventsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTrackingEvents(trackingEventsData);
        });
      }
      
      if (COLLECTIONS.FREIGHT.PACKAGE_TYPES) {
        const packageTypesRef = collection(db, COLLECTIONS.FREIGHT.PACKAGE_TYPES);
        const unsubPackageTypes = onSnapshot(packageTypesRef, (snapshot) => {
          const packageTypesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPackageTypes(packageTypesData);
        });
      }
      
      if (COLLECTIONS.FREIGHT.CARRIERS) {
        const carriersRef = collection(db, COLLECTIONS.FREIGHT.CARRIERS);
        const unsubCarriers = onSnapshot(carriersRef, (snapshot) => {
          const carriersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCarriers(carriersData);
        });
      }
      
      setIsLoading(false);
      
      // Cleanup
      return () => {
        unsubShipments();
        unsubVehicles();
        unsubRoutes();
        unsubDrivers();
        unsubPackages();
        // Only unsubscribe if they exist
        if (COLLECTIONS.FREIGHT.TRACKING_EVENTS) {
          //unsubTrackingEvents();
        }
        if (COLLECTIONS.FREIGHT.PACKAGE_TYPES) {
          //unsubPackageTypes();
        }
        if (COLLECTIONS.FREIGHT.CARRIERS) {
          //unsubCarriers();
        }
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
    trackingEvents,
    packageTypes,
    carriers,
    isLoading,
    error
  };
};
