
// service-types.ts
export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ServiceAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Additional service-related types used throughout the application
export interface ServicePricing {
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumPrice?: number;
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'standard' | 'premium' | 'luxury' | 'custom';
  availability?: ServiceAvailability[];
  pricing?: ServicePricing;
  isActive: boolean;
}

export function serviceToString(service: TransportService): string {
  return service.name;
}

export function stringToService(serviceName: string): TransportService {
  return {
    id: 'default',
    name: serviceName,
    description: 'Service par défaut',
    price: 0,
    type: 'standard',
    isActive: true
  };
}
