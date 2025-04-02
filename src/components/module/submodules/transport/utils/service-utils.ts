
import { TransportService } from '../types/service-types';

// Convert string to a TransportService object
export const stringToService = (serviceName: string): TransportService => {
  return {
    id: `service-${Date.now()}`,
    name: serviceName,
    description: 'Service standard',
    price: 0,
    type: 'standard',
    isActive: true
  };
};

// Convert a TransportService to string
export const serviceToString = (service: TransportService): string => {
  return service.name;
};
