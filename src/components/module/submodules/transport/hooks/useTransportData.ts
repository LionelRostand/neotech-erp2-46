
import { useState, useEffect } from 'react';
import { TransportReservation, TransportClient, TransportVehicle, TransportDriver } from '../types/transport-types';
import { TRANSPORT_COLLECTIONS } from '@/lib/firebase-collections';
import { getAllDocuments } from '@/hooks/firestore/firestore-utils';

export const useTransportReservations = () => {
  const [reservations, setReservations] = useState<TransportReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // Uncomment when connecting to Firebase
        // const data = await getAllDocuments(TRANSPORT_COLLECTIONS.RESERVATIONS);
        // setReservations(data as TransportReservation[]);
        
        // For now, we'll use mock data
        console.log("Would fetch reservations from", TRANSPORT_COLLECTIONS.RESERVATIONS);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return { reservations, loading, error, setReservations };
};

export const useTransportClients = () => {
  const [clients, setClients] = useState<TransportClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Uncomment when connecting to Firebase
        // const data = await getAllDocuments(TRANSPORT_COLLECTIONS.CLIENTS);
        // setClients(data as TransportClient[]);
        
        // For now, we'll use mock data
        console.log("Would fetch clients from", TRANSPORT_COLLECTIONS.CLIENTS);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error, setClients };
};

export const useTransportVehicles = () => {
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Uncomment when connecting to Firebase
        // const data = await getAllDocuments(TRANSPORT_COLLECTIONS.VEHICLES);
        // setVehicles(data as TransportVehicle[]);
        
        // For now, we'll use mock data
        console.log("Would fetch vehicles from", TRANSPORT_COLLECTIONS.VEHICLES);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error, setVehicles };
};

export const useTransportDrivers = () => {
  const [drivers, setDrivers] = useState<TransportDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        // Uncomment when connecting to Firebase
        // const data = await getAllDocuments(TRANSPORT_COLLECTIONS.DRIVERS);
        // setDrivers(data as TransportDriver[]);
        
        // For now, we'll use mock data
        console.log("Would fetch drivers from", TRANSPORT_COLLECTIONS.DRIVERS);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return { drivers, loading, error, setDrivers };
};
