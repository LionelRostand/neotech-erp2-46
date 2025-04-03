
import { TransportService } from '../types';

// Convert string to TransportService object
export const stringToService = (serviceString: string): TransportService => {
  // If we have a simple string, create a minimal service object
  return {
    name: serviceString,
    id: `service-${Math.random().toString(36).substring(2, 9)}`,
    description: '',
    type: serviceString,
    basePrice: 0,
    vehicleTypes: [],
    active: true
  };
};

// Convert TransportService to string
export const serviceToString = (service: TransportService | { name: string } | string | undefined): string => {
  if (!service) return 'airport';
  if (typeof service === 'object' && 'name' in service) return service.name;
  if (typeof service === 'string') return service;
  return service.name || service.type;
};

// Format service name for display
export const formatServiceName = (serviceName: string): string => {
  switch (serviceName.toLowerCase()) {
    case 'airport':
    case 'airport-transfer':
      return 'Transfert Aéroport';
    case 'hourly':
    case 'hourly-hire':
      return 'Location à l\'heure';
    case 'point-to-point':
    case 'pointtopoint':
      return 'Point à Point';
    case 'city-tour':
      return 'Visite de ville';
    case 'business-travel':
      return 'Voyage d\'affaires';
    case 'wedding':
      return 'Mariage';
    case 'event':
      return 'Événement';
    case 'long-distance':
      return 'Longue distance';
    case 'custom':
      return 'Personnalisé';
    default:
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
  }
};
