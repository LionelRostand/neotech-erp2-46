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
        // Create a new object with default values for missing fields
        return {
          // Provide default values for required fields
          id: maintenance.id || '',
          date: maintenance.date || new Date().toISOString(),
          vehicleId: maintenance.vehicleId || '',
          clientId: maintenance.clientId || '',
          mechanicId: maintenance.mechanicId || '',
          description: maintenance.description || '',
          status: maintenance.status || 'pending',
          totalCost: typeof maintenance.totalCost === 'number' ? maintenance.totalCost : 0,
          services: Array.isArray(maintenance.services) ? maintenance.services : [],
          // Keep all other properties
          ...maintenance
        };
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
    error,
    refetch: () => {
      // Helper function to manually refetch all data if needed
      console.log('Refetching all garage data');
    }
  };
};
