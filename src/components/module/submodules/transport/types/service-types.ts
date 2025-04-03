
// service-types.ts

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  vehicleTypes: string[];
  category: string;
  duration: number;
}

export interface ServiceAvailability {
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
}

export interface ServicePricing {
  id: string;
  serviceId: string;
  name: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumCharge?: number;
  specialRates?: {
    nightRate?: number;
    weekendRate?: number;
    holidayRate?: number;
  };
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  type: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minDuration?: number;
  vehicleTypes: string[];
  active: boolean;
}

export interface TransportServiceDetails extends TransportService {
  availabilities: {
    day: string;
    hours: string;
    maxBookings: number;
  }[];
  requirements?: string[];
  additionalInfo?: string;
}
