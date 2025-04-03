
// service-types.ts
export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  vehicleTypes: string[];
  category: string;
  duration?: number;
  image?: string;
}

export interface ServiceAvailability {
  serviceId: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  available: boolean;
  maxBookings?: number;
}

export interface ServicePricing {
  serviceId: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumDuration?: number;
  minimumDistance?: number;
  rushHourMultiplier?: number;
  peakSeasonMultiplier?: number;
  weekendMultiplier?: number;
}

// This was causing the conflict in types/index.ts
// Renamed from TransportService to TransportServiceDetails
export interface TransportServiceDetails {
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

// Add the TransportService interface that was missing
export interface TransportService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  isActive: boolean;
}
