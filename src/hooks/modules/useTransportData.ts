
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import type { 
  TransportVehicle, 
  TransportDriver,
  TransportReservation,
  ServiceOption,
  ServiceAvailability
} from '@/components/module/submodules/transport/types';

// Add mock data for testing
const mockServices: ServiceOption[] = [
  {
    id: "s1",
    name: "Standard Transfer",
    description: "Point-to-point transfer in standard vehicle",
    price: 50,
    isAvailable: true,
    vehicleTypes: ["sedan", "compact"],
    category: "transfer",
    duration: 60
  },
  {
    id: "s2",
    name: "Airport Pickup",
    description: "Airport pickup with waiting time included",
    price: 75,
    isAvailable: true,
    vehicleTypes: ["sedan", "luxury", "van"],
    category: "airport",
    duration: 90
  }
];

const mockServiceAvailability: ServiceAvailability[] = [
  {
    serviceId: "s1",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "20:00",
    isAvailable: true,
    maxBookings: 20
  },
  {
    serviceId: "s1",
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "20:00",
    isAvailable: true,
    maxBookings: 20
  }
];

// Create a hook to manage transport data
export const useTransportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock function to fetch services
  const fetchServices = async (): Promise<ServiceOption[]> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve(mockServices);
      }, 500);
    });
  };
  
  // Mock function to fetch service availability
  const fetchServiceAvailability = async (serviceId: string): Promise<ServiceAvailability[]> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockServiceAvailability.filter(item => item.serviceId === serviceId);
        setLoading(false);
        resolve(filtered);
      }, 500);
    });
  };
  
  // Mock function to create a service
  const createService = async (service: Omit<ServiceOption, 'id'>): Promise<ServiceOption> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newService = {
          ...service,
          id: `s${mockServices.length + 1}`
        };
        
        setLoading(false);
        toast({
          title: "Service créé",
          description: `Le service ${newService.name} a été créé avec succès.`,
        });
        
        resolve(newService);
      }, 800);
    });
  };
  
  // Mock function to update a service
  const updateService = async (id: string, service: Partial<ServiceOption>): Promise<ServiceOption> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const serviceIndex = mockServices.findIndex(s => s.id === id);
        
        if (serviceIndex === -1) {
          setLoading(false);
          setError(new Error("Service not found"));
          reject(new Error("Service not found"));
          return;
        }
        
        const updatedService = {
          ...mockServices[serviceIndex],
          ...service
        };
        
        setLoading(false);
        toast({
          title: "Service mis à jour",
          description: `Le service ${updatedService.name} a été mis à jour avec succès.`,
        });
        
        resolve(updatedService);
      }, 800);
    });
  };
  
  return {
    loading,
    error,
    fetchServices,
    fetchServiceAvailability,
    createService,
    updateService
  };
};
