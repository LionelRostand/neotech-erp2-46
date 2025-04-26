
import { useState, useEffect, useMemo } from 'react';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { useQuery } from '@tanstack/react-query';

// Types for our garage data
interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  year: number;
  clientId: string;
  status: string;
  [key: string]: any;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  [key: string]: any;
}

interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  status: string;
  [key: string]: any;
}

interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  [key: string]: any;
}

interface Maintenance {
  id: string;
  date: string;
  vehicleId: string;
  clientId: string;
  mechanicId: string;
  description: string;
  status: string;
  totalCost: number;
  services: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>;
  [key: string]: any;
}

export const useGarageData = () => {
  // Vehicles
  const { data: vehiclesData = [], isLoading: isLoadingVehicles, error: vehiclesError } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>('garage_vehicles'),
  });

  // Clients
  const { data: clientsData = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<Client>('garage_clients'),
  });

  // Mechanics
  const { data: mechanicsData = [], isLoading: isLoadingMechanics, error: mechanicsError } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>('garage_mechanics'),
  });

  // Services
  const { data: servicesData = [], isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>('garage_services'),
  });

  // Maintenances
  const { data: maintenancesData = [], isLoading: isLoadingMaintenances, error: maintenancesError } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: () => fetchCollectionData<Maintenance>('garage_maintenances'),
  });

  // Sanitize and validate data
  const vehicles = useMemo(() => {
    if (!Array.isArray(vehiclesData)) return [];
    return vehiclesData.filter(v => v && typeof v === 'object');
  }, [vehiclesData]);

  const clients = useMemo(() => {
    if (!Array.isArray(clientsData)) return [];
    return clientsData.filter(c => c && typeof c === 'object');
  }, [clientsData]);

  const mechanics = useMemo(() => {
    if (!Array.isArray(mechanicsData)) return [];
    return mechanicsData.filter(m => m && typeof m === 'object');
  }, [mechanicsData]);

  const services = useMemo(() => {
    if (!Array.isArray(servicesData)) return [];
    return servicesData.filter(s => s && typeof s === 'object');
  }, [servicesData]);

  const maintenances = useMemo(() => {
    if (!Array.isArray(maintenancesData)) return [];
    
    // Filter out any null or undefined items and ensure each maintenance has required fields
    return maintenancesData
      .filter(m => m && typeof m === 'object')
      .map(maintenance => {
        // Ensure each maintenance has a date field
        if (!maintenance.date) {
          console.warn(`Maintenance ${maintenance.id} missing date field. Using current date as fallback.`);
          return { ...maintenance, date: new Date().toISOString() };
        }
        // Ensure each maintenance has a status
        if (!maintenance.status) {
          return { ...maintenance, status: 'pending' };
        }
        // Ensure totalCost is a number
        if (maintenance.totalCost && typeof maintenance.totalCost !== 'number') {
          try {
            return { ...maintenance, totalCost: parseFloat(maintenance.totalCost) };
          } catch (e) {
            return { ...maintenance, totalCost: 0 };
          }
        }
        return maintenance;
      });
  }, [maintenancesData]);

  // Track any error
  const error = vehiclesError || clientsError || mechanicsError || servicesError || maintenancesError;

  const isLoading = isLoadingVehicles || isLoadingClients || isLoadingMechanics || isLoadingServices || isLoadingMaintenances;

  // Return everything with default empty arrays in case of undefined
  return {
    vehicles,
    clients,
    mechanics,
    services,
    maintenances,
    isLoading,
    error
  };
};
