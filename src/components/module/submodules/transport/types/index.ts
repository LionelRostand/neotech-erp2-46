
// index.ts - reexport all types
export * from './base-types';
export * from './driver-types';
export * from './vehicle-types';
export * from './map-types';
export * from './planning-types';
export * from './reservation-types';

// Simple interim types for modules in development
export interface GeolocationConfig {
  centerLat: number;
  centerLng: number;
  zoom: number;
  refreshInterval: number;
}

export interface ReservationBasic {
  id: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  vehicleId?: string;
  driverId?: string;
}

export interface WebBookingConfig {
  siteTitle: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  enableBookingForm: boolean;
  requiredFields: string[];
}
