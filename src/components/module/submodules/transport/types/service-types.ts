
// service-types.ts
export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  vehicleTypes: string[];
  category: string;
  duration: number;
}

export interface ServiceAvailability {
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available: boolean;
  maxBookings: number;
}

export interface ServicePricing {
  id: string;
  serviceId: string;
  name: string;
  basePrice: number;
  distancePricing?: {
    ratePerKm: number;
    minDistance?: number;
    maxDistance?: number;
  };
  timePricing?: {
    ratePerHour: number;
    minimumHours?: number;
  };
  extras?: {
    id: string;
    name: string;
    price: number;
    description?: string;
  }[];
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  vehicleTypes: string[];
  maxPassengers: number;
  maxLuggage: number;
  features: string[];
  cancellationPolicy: string;
  availabilityHours?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  pricing?: ServicePricing;
  [key: string]: any;
}

export interface TransportServiceDetails extends TransportService {
  availability: ServiceAvailability[];
  pricing: ServicePricing[];
}
