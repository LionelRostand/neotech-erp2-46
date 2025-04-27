
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

interface Repair {
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
  
  // Repairs
  const { data: repairsData = [], isLoading: isLoadingRepairs, error: repairsError } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>('garage_repairs'),
  });
  
  // Appointments for dashboard
  const { data: appointmentsData = [], isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: () => fetchCollectionData('garage_appointments'),
  });
  
  // Invoices for dashboard
  const { data: invoicesData = [], isLoading: isLoadingInvoices, error: invoicesError } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData('garage_invoices'),
  });
  
  // Inventory for dashboard
  const { data: inventoryData = [], isLoading: isLoadingInventory, error: inventoryError } = useQuery({
    queryKey: ['garage', 'inventory'],
    queryFn: () => fetchCollectionData('garage_inventory'),
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
  
  const repairs = useMemo(() => {
    if (!Array.isArray(repairsData)) return [];
    
    return repairsData
      .filter(r => r && typeof r === 'object')
      .map(repair => {
        return {
          id: repair.id || '',
          date: repair.date || new Date().toISOString(),
          vehicleId: repair.vehicleId || '',
          clientId: repair.clientId || '',
          mechanicId: repair.mechanicId || '',
          description: repair.description || '',
          status: repair.status || 'pending',
          totalCost: typeof repair.totalCost === 'number' ? repair.totalCost : 0,
          services: Array.isArray(repair.services) ? repair.services : [],
          ...repair
        };
      });
  }, [repairsData]);
  
  // Handle additional data for the dashboard
  const appointments = useMemo(() => {
    if (!Array.isArray(appointmentsData)) return [];
    return appointmentsData.filter(a => a && typeof a === 'object');
  }, [appointmentsData]);
  
  const invoices = useMemo(() => {
    if (!Array.isArray(invoicesData)) return [];
    return invoicesData.filter(i => i && typeof i === 'object');
  }, [invoicesData]);
  
  const inventory = useMemo(() => {
    if (!Array.isArray(inventoryData)) return [];
    return inventoryData.filter(i => i && typeof i === 'object');
  }, [inventoryData]);
  
  // Handle suppliers and loyalty programs for GarageDashboard
  const suppliers = [];
  const loyalty = [];

  // Track any error
  const error = vehiclesError || clientsError || mechanicsError || servicesError || 
                maintenancesError || repairsError || appointmentsError || 
                invoicesError || inventoryError;

  const isLoading = isLoadingVehicles || isLoadingClients || isLoadingMechanics || 
                   isLoadingServices || isLoadingMaintenances || isLoadingRepairs ||
                   isLoadingAppointments || isLoadingInvoices || isLoadingInventory;

  // Return everything with default empty arrays in case of undefined
  return {
    vehicles,
    clients,
    mechanics,
    services,
    maintenances,
    repairs,
    appointments,
    invoices,
    suppliers,
    inventory,
    loyalty,
    isLoading,
    error,
    refetch: () => {
      // Helper function to manually refetch all data if needed
      console.log('Refetching all garage data');
    }
  };
};
