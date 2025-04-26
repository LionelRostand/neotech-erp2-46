
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
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>('garage_vehicles'),
  });

  // Clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<Client>('garage_clients'),
  });

  // Mechanics
  const { data: mechanics = [], isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>('garage_mechanics'),
  });

  // Services
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>('garage_services'),
  });

  // Maintenances
  const { data: maintenances = [], isLoading: isLoadingMaintenances } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: () => fetchCollectionData<Maintenance>('garage_maintenances'),
  });

  const isLoading = isLoadingVehicles || isLoadingClients || isLoadingMechanics || isLoadingServices || isLoadingMaintenances;

  return {
    vehicles,
    clients,
    mechanics,
    services,
    maintenances,
    isLoading
  };
};
