
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useTransportData = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch drivers
        const driversQuery = query(
          collection(db, COLLECTIONS.TRANSPORT.DRIVERS),
          orderBy('lastName')
        );
        const driversSnapshot = await getDocs(driversQuery);
        const driversData = driversSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDrivers(driversData);
        
        // Fetch vehicles
        const vehiclesQuery = query(
          collection(db, COLLECTIONS.TRANSPORT.VEHICLES),
          orderBy('model')
        );
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehiclesData);
        
        // Fetch reservations
        const reservationsQuery = query(
          collection(db, COLLECTIONS.TRANSPORT.RESERVATIONS),
          orderBy('pickupTime', 'desc')
        );
        const reservationsSnapshot = await getDocs(reservationsQuery);
        const reservationsData = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(reservationsData);
        
        // Fetch clients
        const clientsQuery = query(
          collection(db, COLLECTIONS.TRANSPORT.CLIENTS),
          orderBy('createdAt', 'desc')
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching transport data:', err);
        setError(err);
        toast.error('Erreur lors du chargement des données de transport');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return {
    drivers,
    vehicles,
    reservations,
    clients,
    isLoading,
    error
  };
};
