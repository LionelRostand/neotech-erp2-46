
import { TransportService } from '../types/base-types';

// Adjust the mock services to match the TransportService type
export const getMockServices = (): TransportService[] => {
  return [
    {
      id: "srv-001",
      name: "Transport Standard",
      description: "Service de transport en berline standard",
      type: "standard",
      basePrice: 55,
      pricePerKm: 1.5,
      minDuration: 30,
      vehicleTypes: ['sedan'],
      active: true
    },
    {
      id: "srv-002",
      name: "Transport Premium",
      description: "Service de transport en berline haut de gamme",
      type: "premium",
      basePrice: 85,
      pricePerKm: 2,
      minDuration: 30,
      vehicleTypes: ['luxury'],
      active: true
    },
    {
      id: "srv-003",
      name: "Transport Groupe",
      description: "Service de transport en van pour groupes",
      type: "group",
      basePrice: 120,
      pricePerKm: 2.5,
      minDuration: 60,
      vehicleTypes: ['van', 'minibus'],
      active: true
    },
    {
      id: "srv-004",
      name: "Navette Aéroport",
      description: "Service de navette depuis/vers l'aéroport",
      type: "airport",
      basePrice: 70,
      minDuration: 60,
      vehicleTypes: ['sedan', 'van'],
      active: true
    }
  ] as TransportService[];
};

// Update the function to handle proper service types
export const getServiceById = (serviceId: string, services: TransportService[]): TransportService | undefined => {
  return services.find(s => s.id === serviceId);
};

// Update to handle the service by type properly
export const getServiceByType = (type: string, services: TransportService[]): TransportService | undefined => {
  return services.find(s => s.type === type);
};
