
import { useState, useEffect } from 'react';
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
  const { data: vehicles = [], isLoading: isLoadingVehicles, error: vehiclesError } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>('garage_vehicles'),
  });

  // Clients
  const { data: clients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<Client>('garage_clients'),
  });

  // Mechanics
  const { data: mechanics = [], isLoading: isLoadingMechanics, error: mechanicsError } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>('garage_mechanics'),
  });

  // Services
  const { data: services = [], isLoading: isLoadingServices, error: servicesError } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>('garage_services'),
  });

  // Maintenances
  const { data: maintenances = [], isLoading: isLoadingMaintenances, error: maintenancesError } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: () => fetchCollectionData<Maintenance>('garage_maintenances'),
    onSuccess: (data) => {
      // Validate that each maintenance has required fields
      if (Array.isArray(data)) {
        const validatedData = data.map(maintenance => {
          if (!maintenance.date) {
            console.warn(`Maintenance ${maintenance.id} missing date field`, maintenance);
            return { ...maintenance, date: new Date().toISOString() };
          }
          return maintenance;
        });
      }
    },
  });

  // Track any error
  const error = vehiclesError || clientsError || mechanicsError || servicesError || maintenancesError;

  const isLoading = isLoadingVehicles || isLoadingClients || isLoadingMechanics || isLoadingServices || isLoadingMaintenances;

  // Return everything with default empty arrays in case of undefined
  return {
    vehicles: vehicles || [],
    clients: clients || [],
    mechanics: mechanics || [],
    services: services || [],
    maintenances: maintenances || [],
    isLoading,
    error
  };
};
